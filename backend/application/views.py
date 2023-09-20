import hashlib
import os
from datetime import datetime, timedelta

from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.utils.html import strip_tags
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import phonenumbers

from applicant.models import Applicant
from application.models import Application
from application.serializers import ApplicationSerializer, ApplicationShortSerializer
from application.utils import has_validation_error
from application_field.models import ApplicationField
from auth_token.models import AuthToken
from organisation_user.models import OrganisationUser
from permissions.permissions import IsApplicationOwner
from project.sendgrid import send_email
from user.models import AuthUser
from user.serializers import AuthUserSerializer
from waiting_list.models import WaitingList
from waiting_list.serializers import WaitinglistVeryShortSerializer
from waiting_list_field.models import WaitingListField


class CreateApplicationView(CreateAPIView):
    """
    post:
    Create an application on a waiting list

    Create an application on a waiting list. Also creates a new user and an Applicant if not existing
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def create(self, request, *args, **kwargs):
        waiting_list = get_object_or_404(WaitingList, id=kwargs.get('list_id'))
        request.data['waiting_list'] = waiting_list.id

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        errors = {}

        if not (request.data.get("email") and request.data.get("first_name") and request.data.get("last_name")):
            return Response({"message": "Email, first and last name are required."}, status=status.HTTP_400_BAD_REQUEST)

        email_validator = EmailValidator()

        try:
            email_validator(request.data.get("email"))
        except ValidationError:
            errors["email"] = "This email address is not valid"

        user, user_created = AuthUser.objects.get_or_create(
            email=request.data.get("email"),
            defaults={
                'is_active': False,
                'first_name': request.data.get("first_name"),
                'last_name': request.data.get("last_name"),
            },
        )

        applicant, applicant_created = Applicant.objects.get_or_create(
            user=user
        )

        existing_application = Application.objects.filter(applicant=applicant, waiting_list=waiting_list).exists()

        if existing_application:
            return Response({"message": "Application already exists"}, status=status.HTTP_400_BAD_REQUEST)

        application = Application(
            waiting_list=waiting_list,
            applicant=applicant,
            status="created",
        )

        fields = WaitingListField.objects.filter(waiting_list=waiting_list,
                                                 is_displayed=True)  # all fields that are activated on the waiting list
        submit_data = request.data.get('fields')

        entries = []

        for field in fields:
            value_submitted = submit_data.get(field.name)
            if not value_submitted:
                value = None
            else:
                value = strip_tags(submit_data.get(field.name)).strip()
                if len(value) == 0:
                    value = None

            if value is not None and has_validation_error(field, value):
                errors[field.name] = has_validation_error(field, value)

            elif value is None:
                continue

            else:
                entries.append(ApplicationField(
                    waiting_list_field=field,
                    application=application,
                    value=value,
                ))

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        application.save()

        for entry in entries:  # only save fields after all fields were validated and application was stored
            entry.save()

        serialized = ApplicationSerializer(application)

        token = AuthToken(
            user=user,
            expiry_date=datetime.now() + timedelta(hours=12),
            token=hashlib.md5(str(datetime.now()).encode()).hexdigest()
        )
        token.save()

        login_url = f"{os.environ.get('FRONTEND_BASE_URL')}/list/{waiting_list.slug}/login-link?token={token.token}"

        template_data = {
            'user': AuthUserSerializer(user).data,
            'link': login_url,
            'waiting_list': WaitinglistVeryShortSerializer(waiting_list).data,
            'application': ApplicationShortSerializer(application).data
        }

        send_email(user, "application_created", template_data)

        return Response(serialized.data, status=status.HTTP_201_CREATED)


@staticmethod
def validate_phone_number(number):
    parsed_number = phonenumbers.parse(number)
    if phonenumbers.is_valid_number(parsed_number):
        return True
    else:
        return False


class RetrieveUpdateDeleteApplicationView(RetrieveUpdateDestroyAPIView):
    """
    get:
    Retrieve an application on a waiting list

    Retrieve an application on a waiting list.


    delete:
    Delete an application on a waiting list

    Delete an application on a waiting list.


    patch:
    Update an application on a waiting list

    Update an application on a waiting list.
    """

    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    http_method_names = ['get', 'patch', 'delete', ]
    lookup_field = "application_id"
    permission_classes = [IsAuthenticated, IsApplicationOwner]

    def get_object(self):
        application_id = self.kwargs.get("application_id")
        obj = get_object_or_404(Application, id=application_id)
        self.check_object_permissions(self.request, obj)
        return obj

    def retrieve(self, request, *args, **kwargs):
        application = self.get_object()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        application = self.get_object()
        user = get_object_or_404(AuthUser, id=application.applicant.user.id)

        self.perform_destroy(application)

        other_applications = Application.objects.filter(applicant__user=user)
        org_user = OrganisationUser.objects.filter(user=user)

        if other_applications:
            return Response({"application_deleted": True, "applicant_deleted": False, "user_deleted": False},
                            status=status.HTTP_204_NO_CONTENT)

        if org_user:
            applicant_user = Applicant.objects.filter(user=user)
            applicant_user.delete()
            return Response({"application_deleted": True, "applicant_deleted": True, "user_deleted": False},
                            status=status.HTTP_204_NO_CONTENT)

        if user:
            user.delete()
            return Response({"application_deleted": True, "applicant_deleted": True, "user_deleted": True},
                            status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        application = self.get_object()
        waiting_list_id = kwargs.get('list_id')
        waiting_list = get_object_or_404(WaitingList, id=waiting_list_id)
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(application, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Update fields

        fields = WaitingListField.objects.filter(waiting_list=waiting_list,
                                                 is_displayed=True)  # all fields that are activated on the waiting list
        submit_data = request.data.get('fields')

        errors = {}

        for field in fields:
            existing_field = ApplicationField.objects.filter(waiting_list_field=field, application=application).first()
            value_submitted = submit_data.get(field.name)
            if not value_submitted:
                value = None
            else:
                value = strip_tags(submit_data.get(field.name)).strip()
                if len(value) == 0:
                    value = None

            if field.is_required:
                if existing_field:

                    if value is not None:  # Validate input and update record
                        if has_validation_error(field, value):
                            errors[field.name] = has_validation_error(field, value)
                        else:
                            existing_field.value = value
                            existing_field.save()
                    else:
                        continue  # if it's a required field and there is no update, just skip it
                else:  # no field existing; we need to create one and throw an error if we don't have a value
                    if value is None:
                        errors[field.name] = "This field is required and needs a value"
                    else:  # Validate input and create record
                        if has_validation_error(field, value):
                            errors[field.name] = has_validation_error(field, value)
                        else:
                            new_field = ApplicationField(
                                waiting_list_field=field,
                                application=application,
                                value=value,
                            )
                            new_field.save()

            else:  # not required field
                if existing_field:
                    # If field not sent, just skip
                    if field.name not in submit_data:
                        continue
                    if value is not None:  # Validate input and update record
                        print(f"{field.name} with {value} is not None")
                        if has_validation_error(field, value):
                            errors[field.name] = has_validation_error(field, value)
                        else:
                            existing_field.value = value
                            existing_field.save()
                    else:  # store empty value
                        existing_field.value = None
                        existing_field.save()
                else:  # no field existing; we need to create one and throw an error if we don't have a value
                    if value is None:
                        continue  # if there is no value, we just skip it
                    else:  # Validate input and create record
                        if has_validation_error(field, value):
                            errors[field.name] = has_validation_error(field, value)
                        else:
                            new_field = ApplicationField(
                                waiting_list_field=field,
                                application=application,
                                value=value,
                            )
                            new_field.save()

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        if getattr(application, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            application._prefetched_objects_cache = {}

        return Response(serializer.data)

    def put(self):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class ListApplicationView(RetrieveAPIView):
    serializer_class = ApplicationSerializer
    http_method_names = ['get', ]
    lookup_field = "application_id"
    permission_classes = [IsAuthenticated, IsApplicationOwner]

    def get_object(self):
        list_id = self.kwargs.get("list_id")
        waiting_list = get_object_or_404(WaitingList, id=list_id)
        if waiting_list:
            obj = Application.objects.filter(waiting_list=list_id, applicant__user=self.request.user).first()
            self.check_object_permissions(self.request, obj)
            return obj

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
