import hashlib
import os
from datetime import datetime, timedelta
from urllib.parse import quote

from django.db.models import Count
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.generics import CreateAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from auth_token.models import AuthToken
from membership.models import Membership
from membership.serializers import MembershipSerializer
from organisation_user.models import OrganisationUser
from permissions.permissions import IsOrganisationAdminOrOrganisationReadOnly, \
    IsOrganisationOwnerOrOrganisationReadOnly, IsOrganisationUser, IsOrganisationMember, IsMemberOfOrganisation, \
    IsAdminOfOrganisation
from project.sendgrid import send_email
from user.models import AuthUser
from .models import Organisation
from .serializers import OrganisationSerializer


class OrganisationCreateAPIView(CreateAPIView):
    """
    post:
    Create a new organisation

    Create a new organisation and automatically create a membership for the user that creates the organisation.
    """
    serializer_class = OrganisationSerializer
    permission_classes = [IsOrganisationUser, IsOrganisationMember]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the serializer data to create a new organization instance
        self.perform_create(serializer)

        # Get the created organization instance
        organisation = serializer.instance

        # Get the OrganisationUser for the current AuthUser
        organisation_user, _ = OrganisationUser.objects.get_or_create(user=request.user)
        # TODO: Check if get_or_create is really needed here; after signing up an organisation_user should already exist
        # !!! if i delete this, its said organisation_user not exist, so i think i need rework this part when the
        # registration working properly and just check the creator of the organisation is an organisation user or not!!!

        # Create a membership for the user who creates the organization
        membership = Membership.objects.create(
            status=2,  # Joined
            role=3,  # Owner
            organisation=organisation,
            member=organisation_user  # Use the OrganisationUser instance
        )

        # Set the membership and role fields in the organization serializer
        serializer.instance.organisation_membership.set([membership])
        serializer.instance.role = membership.role
        serializer.instance.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class OrganisationRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    """
    get:
    Get organisation details

    Retrieve details of a specific organisation.

    Parameters:
    - org_id: ID of the organisation to retrieve.

    patch:
    Update organisation

    Update a specific organisation.

    Parameters:
    - org_id: ID of the organisation to delete.

    delete:
    Delete organisation

    Delete a specific organisation.

    Parameters:
    - org_id: ID of the organisation to delete.
    """
    http_method_names = ['get', 'patch', 'delete']

    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    permission_classes = []

    def get_permissions(self):
        if self.request.method == 'PATCH':
            self.permission_classes = [IsOrganisationUser, IsOrganisationAdminOrOrganisationReadOnly]
        elif self.request.method == 'DELETE':
            self.permission_classes = [IsOrganisationUser, IsOrganisationOwnerOrOrganisationReadOnly]
        return super().get_permissions()

    def perform_update(self, serializer):
        self.check_permissions(self.request)
        serializer.save()

    def perform_destroy(self, instance):
        self.check_permissions(self.request)
        instance.delete()


class ListCreateOrganisationMembersView(ListCreateAPIView):
    """
    get:
    List all members of an organisation

    List all members of an organisation


    post:
    Create a new member in the organisation

    Create a new member in the organisation
    """
    serializer_class = MembershipSerializer
    pagination_class = None
    queryset = Membership.objects.all()
    permission_classes = []

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [IsOrganisationUser, IsMemberOfOrganisation]
        elif self.request.method == 'POST':
            self.permission_classes = [IsOrganisationUser, IsAdminOfOrganisation]
        return super().get_permissions()

    def get_queryset(self):
        org_id = self.kwargs.get('pk')
        return Membership.objects.filter(organisation_id=org_id)

    def create(self, request, *args, **kwargs):
        data = request.data

        email = data.get('email')

        if not email:
            raise ValidationError({"email": "This field is required"})

        try:
            # Attempt to retrieve an existing AuthUser with the provided email
            auth_user = AuthUser.objects.get(email=email)
        except AuthUser.DoesNotExist:
            # If an AuthUser doesn't exist with the provided email, create a new one
            auth_user = AuthUser.objects.create_user(email=email, password=None)
            auth_user.save()

        # Retrieve or create a new OrganisationUser linked with the retrieved or newly created AuthUser
        organisation_user, organisation_user_created = OrganisationUser.objects.get_or_create(user=auth_user, defaults={
            "language_id": 1})

        # Retrieve or create a new Membership linked with the retrieved or newly created OrganisationUser
        organisation_id = self.kwargs.get('pk')

        organisation = get_object_or_404(Organisation, id=organisation_id)

        if not organisation_user_created:  # Organisation user already existed; can directly join team
            membership, membership_created = Membership.objects.get_or_create(
                organisation_id=organisation_id,
                member=organisation_user,
                defaults={
                    "status": 2,  # Directly joined
                    "role": data.get('role', 1)  # Viewer, if not provided
                }
            )

            if membership_created or membership.status == 1:  # If the membership was not created
                # before or user is not activated yet: send an eMail with the info
                login_url = f"{os.environ.get('FRONTEND_BASE_URL')}/sign-in?email={quote(auth_user.email)}"

                email_data = {
                    "link": login_url,
                    "inviter": {
                        "first_name": request.user.first_name,
                        "last_name": request.user.last_name,
                    },
                    "organisation": {
                        "name": organisation.name,
                    },
                }

                send_email(user=auth_user, event="invitation-existing-user", template_data=email_data)

        else:  # Organisation user was created; needs to be invited first
            membership, membership_created = Membership.objects.get_or_create(
                organisation_id=organisation_id,
                member=organisation_user,
                defaults={
                    "status": 1,  # Invited
                    "role": data.get('role', 1)  # Viewer, if not provided
                }
            )

            token = AuthToken(
                user=auth_user,
                expiry_date=datetime.now() + timedelta(hours=36),
                token=hashlib.md5(str(datetime.now()).encode()).hexdigest()
            )

            token.save()

            # Send eMail

            complete_profile_url = f"{os.environ.get('FRONTEND_BASE_URL')}/complete-profile?email={quote(auth_user.email)}&token={token.token}"

            email_data = {
                "link": complete_profile_url,
                "inviter": {
                    "first_name": request.user.first_name,
                    "last_name": request.user.last_name,
                },
                "organisation": {
                    "name": organisation.name,
                },
            }

            send_email(user=auth_user, event="complete-profile-invitation", template_data=email_data)

        return Response(self.get_serializer(membership).data,
                        status=status.HTTP_201_CREATED if membership_created else status.HTTP_200_OK)


class MembershipDetailView(RetrieveUpdateDestroyAPIView):
    """
    get:
    Retrieve membership details

    Retrieve details of a user's membership in an organisation.

    patch:
    Update membership

    Update the role and status of a user's membership in an organisation.

    delete:
    Delete membership

    Delete the membership of a user in an organisation.

    Parameters:
    - pk: ID of the membership.
    - user_id: ID of the user.
    """
    http_method_names = ['get', 'patch', 'delete']
    serializer_class = MembershipSerializer
    permission_classes = [IsOrganisationUser, IsOrganisationMember]

    def get_object(self):
        org_id = self.kwargs['id']
        user_id = self.kwargs['user_id']

        try:
            membership = Membership.objects.get(organisation_id=org_id, member__user_id=user_id)
        except Membership.DoesNotExist:
            raise NotFound("Membership not found.")

        return membership

    def get(self, request, *args, **kwargs):
        membership = self.get_object()
        serializer = self.get_serializer(membership)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        membership = self.get_object()

        # Check if the current user is the owner of the organization
        current_user = request.user
        owner_membership = membership.organisation.organisation_membership.get(role=3)
        if not owner_membership.member.user == current_user:
            return Response("Only the owner can change membership roles.", status=status.HTTP_403_FORBIDDEN)

        # Check if the membership role is 'Owner'
        if membership.role == 3:
            return Response("Cannot change the role of an owner.", status=status.HTTP_400_BAD_REQUEST)

        # Extract the 'role' field from the request data
        try:
            role = int(request.data.get('role'))
        except TypeError:
            return Response("Role must be provided", status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response("Role must be a number", status=status.HTTP_400_BAD_REQUEST)

        # Ensure the role is either '1' or '2'
        if role not in (1, 2):
            return Response("Invalid role. Allowed roles are (1) 'Viewer' and (2) 'Admin'.",
                            status=status.HTTP_400_BAD_REQUEST)

        # Update the role of the membership
        membership.role = role
        membership.save()

        serializer = self.get_serializer(membership)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        membership = self.get_object()

        # Check if the current user is the owner of the organization
        current_user = request.user
        owner_membership = membership.organisation.organisation_membership.get(role=3)
        if not owner_membership.member.user == current_user:
            return Response("Only the owner can delete memberships.", status=status.HTTP_403_FORBIDDEN)

        # Check if the user is part of another organisation
        user_id = membership.member.user_id
        memberships_count = Membership.objects.filter(member__user_id=user_id).exclude(
            pk=membership.pk).aggregate(count=Count('id'))['count']

        if memberships_count > 0:
            membership.delete()
            return Response("Membership removed.", status=status.HTTP_204_NO_CONTENT)

        # Check if the org_user is not part of any other organisation
        memberships = Membership.objects.filter(member__user_id=user_id)
        if not memberships.exists():
            membership.member.delete()
            return Response("Membership and OrganisationUser removed.", status=status.HTTP_204_NO_CONTENT)

        # Check if the AuthUser is linked to an Applicant
        auth_user = membership.member.user
        is_linked_to_applicant = hasattr(auth_user, 'applicant')
        if is_linked_to_applicant:
            membership.delete()
            membership.member.delete()
            return Response("Membership, OrganisationUser removed.",
                            status=status.HTTP_204_NO_CONTENT)

        # If none of the above conditions apply, delete the membership, org_user, and auth_user
        membership.delete()
        membership.member.delete()
        auth_user.delete()
        return Response("Membership, OrganisationUser, and AuthUser removed.", status=status.HTTP_204_NO_CONTENT)

    def put(self, request, *args, **kwargs):
        return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)
