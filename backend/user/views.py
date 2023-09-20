import hashlib
import os
from datetime import datetime, timedelta
from urllib.parse import quote

from django.db import IntegrityError
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from application.models import Application
from auth_token.models import AuthToken
from membership.models import Membership
from organisation_user.models import OrganisationUser
from project.sendgrid import send_email
from waiting_list.models import WaitingList
from waiting_list.serializers import WaitinglistShortSerializer
from .models import AuthUser
from .serializers import AuthUserSerializer


class AuthUserRetrieveUpdateMeView(RetrieveUpdateAPIView):
    """
    get:
    Get auth user details

    Retrieve details of the auth user.

    patch:
    Update auth user details

    Update details of the auth user (first_name, last_name, password).
    """
    http_method_names = ['get', 'patch', 'head', 'options', 'trace']
    permission_classes = [IsAuthenticated]
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = request.user  # Ensure current user is retrieved
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = request.user  # Ensure the current AuthUser is updated
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)  # do not allow put; only patch


class RegisterUserView(APIView):
    """
    post:
    Register as new OrganisationUser

    Registering a new user with an email and requesting a validation code

    """

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"message": "No email provided"}, status=status.HTTP_400_BAD_REQUEST)

        # TODO: Decide whether needed or not; we can also just let the user redo the signup process
        # existing_user = AuthUser.objects.filter(email=email, is_active=True).first()
        #
        # if existing_user is not None:  # AuthUser already exists and is active
        #     organisation_user, created = OrganisationUser.objects.get_or_create(
        #         user=existing_user
        #     )
        #     if created:
        #         return Response({"message": "AuthUser already exists and is active; created new organisationUser"},
        #                         status=status.HTTP_201_CREATED)
        #     else:
        #         return Response({"message": "AuthUser already exists and is active; organisationUser also exists"},
        #                         status=status.HTTP_200_OK)

        # No existing active AuthUser (there might be an inactive one)
        user, user_created = AuthUser.objects.get_or_create(  # Get inactive AuthUser or create a new AuthUser
            email=email,
            defaults={'is_active': False},
        )

        organisation_user, organisation_user_created = OrganisationUser.objects.get_or_create(
            user=user
        )

        organisation_user.save()

        if organisation_user_created:
            token = AuthToken(
                user=user,
                expiry_date=datetime.now() + timedelta(hours=12),
                token=hashlib.md5(str(datetime.now()).encode()).hexdigest()
            )

            token.save()

            # Send eMail
            complete_profile_url = f"{os.environ.get('FRONTEND_BASE_URL')}/complete-profile?email={quote(user.email)}&token={token.token}"

            email = send_email(
                user=user,
                event="complete-profile-signup",
                template_data={"link": complete_profile_url}
            )

            return Response({"message": "User registration created"}, status=status.HTTP_201_CREATED)

        else:
            return Response({"message": "User already existing"},
                            status=status.HTTP_200_OK)


class ValidateUserTokenView(APIView):
    """
    post:
    Validate token of a User

    Validate token of an AuthUser without completing the profile
    """

    def post(self, request):
        email = request.data.get('email')
        token_value = request.data.get('token')

        if not email or not token_value:
            return Response({"message": "Both email and token must be provided."},
                            status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(AuthUser, email=email)
        token = AuthToken.objects.filter(
            user=user,
            token=token_value,
            expiry_date__gte=timezone.now(),
            used_date__isnull=True,
        ).order_by('-created_date').first()

        if token is not None:
            return Response({"message": "Token is valid."},
                            status=status.HTTP_200_OK)

        return Response({"message": "Token not found or invalid, or already used."},
                        status=status.HTTP_400_BAD_REQUEST)


class CompleteUserProfileView(APIView):
    """
    post:
    Complete OrganisationUser profile

    Validate registration of an OrganisationUser
    """

    def post(self, request):
        user = get_object_or_404(AuthUser, email=request.data.get('email'))

        token = AuthToken.objects.filter(
            user=user,
            expiry_date__gte=datetime.now(),
            used_date__isnull=True,
        ).order_by('-created_date').first()

        if token is not None and request.data.get('token') == token.token:
            # Token is valid

            required_fields = ['first_name', 'last_name', 'password', 'password_repeat']

            missing_fields = [field for field in required_fields if not request.data.get(field)]

            if missing_fields:
                return Response({"message": f"Missing required fields: {', '.join(missing_fields)}"},
                                status=status.HTTP_400_BAD_REQUEST)

            if request.data.get('password') != request.data.get('password_repeat'):
                return Response({"message": "Passwords must match"},
                                status=status.HTTP_400_BAD_REQUEST)

            try:
                user.set_password(request.data.get(
                    'password'))
                user.first_name = request.data.get('first_name')
                user.last_name = request.data.get('last_name')
                user.is_active = True
                user.save()
                # TODO: process language; store it
            except IntegrityError:
                return Response({"message": "This user already exists"}, status=status.HTTP_400_BAD_REQUEST)

            token.used_date = datetime.now()
            token.save()

            # Update all memberships from "invited" to "joined"
            organisation_user = OrganisationUser.objects.get(user=user)

            memberships = Membership.objects.filter(member=organisation_user, status=1)
            for membership in memberships:
                membership.status = 2
                membership.save()

            return Response({"message": "User successfully registered"}, status=status.HTTP_200_OK)

        return Response({"message": "Token not found or invalid, or already used"}, status=status.HTTP_400_BAD_REQUEST)


class MagicLinkLoginView(APIView):
    def get(self, request, token):
        auth_token = get_object_or_404(AuthToken, token=token)

        user = get_object_or_404(AuthUser, tokens=auth_token)

        if auth_token.used_date is not None or auth_token.expiry_date < timezone.now():
            return Response({"detail": "Invalid or expired token", "user": AuthUserSerializer(user).data}, status=400)

        auth_token.used_date = timezone.now()
        auth_token.save()

        refresh = RefreshToken.for_user(auth_token.user)

        user.is_active = True  # Set to active if user was not active before
        user.save()

        # Update "created" applications to "waiting" (DOI)
        if hasattr(user, 'applicant'):
            createdApplications = Application.objects.filter(applicant__user=user, status="created")
            for application in createdApplications:
                waiting_list = application.waiting_list
                if not waiting_list.identity_verification_required:
                    application.status = "waiting"
                    application.save()
                else:
                    pass
                    # TODO later: If identity verification is required, set application.status to "waiting" if document is verified

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class RequestLoginLink(APIView):
    def post(self, request):
        email = request.data.get('email')
        list_id = request.data.get('waiting_list')
        user = AuthUser.objects.filter(email=email).first()
        if not user:  # Don't return a 404, but a 200 so that it cannot be guessed if user exists
            return Response(status=status.HTTP_200_OK)

        if list_id:  # Don't return a 404, but a 200 so that it cannot be guessed if user exists on waiting list
            waiting_list = WaitingList.objects.filter(id=list_id, applications__applicant__user=user).first()
            if not waiting_list:
                return Response(status=status.HTTP_200_OK)
            else:
                list_slug = waiting_list.slug

        token = AuthToken(
            user=user,
            expiry_date=datetime.now() + timedelta(hours=12),
            token=hashlib.md5(str(datetime.now()).encode()).hexdigest()
        )
        token.save()

        if list_id:  # Login for applicant
            login_url = f"{os.environ.get('FRONTEND_BASE_URL')}/list/{list_slug}/login-link?token={token.token}"

            template_data = {
                'user': AuthUserSerializer(user).data,
                'link': login_url,
                'waiting_list': WaitinglistShortSerializer(waiting_list).data,
            }

            send_email(user, "magic_link_applicant", template_data)

        else:
            login_url = f"{os.environ.get('FRONTEND_BASE_URL')}/login-link?token={token.token}"

            template_data = {
                'user': AuthUserSerializer(user).data,
                'link': login_url,
            }

            send_email(user, "magic_link_org_user", template_data)

        return Response({"detail": "Magic link has been sent"}, status=status.HTTP_201_CREATED)
