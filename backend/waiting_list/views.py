import csv

from django.http import HttpResponse
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, UpdateAPIView, \
    RetrieveAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.text import slugify
from rest_framework.views import APIView

from application.models import Application
from application.serializers import ApplicationSerializer
from application_field.models import ApplicationField
from language.models import Language
from language.serializers import LanguageSerializer
from permissions.permissions import \
    IsOrganisationAdminOrOwnerForCSV, IsWaitinglistOrganisationMember, IsOrganisationAdminOrOwner
from waiting_list_field.default_fields import street_field, zip_field, city_field, country_field, comment_field, \
    register_for_another_field, motivation_field, phone_field, gender_field, birthdate_field
from waiting_list_field.models import WaitingListField
from waiting_list_field.serializers import WaitinglistFieldSerializer
from .serializers import WaitinglistEditorSerializer, WaitinglistPublicSerializer, WaitingListOptionsSerializer
from .models import WaitingList, RECONFIRMATION_CYCLE_CHOICES, RECONFIRMATION_REMINDER_CHOICES, PRIORITIZATION_CHOICES


class CreateWaitinglistView(CreateAPIView):
    """
    post:
    Create waiting list

    Create a new waiting list. Requires name and organisation; automatically creates a unique slug
    """
    queryset = WaitingList.objects.all()
    serializer_class = WaitinglistEditorSerializer
    permission_classes = [IsAuthenticated, IsOrganisationAdminOrOwner]

    def create(self, request, *args, **kwargs):
        slug_base = slugify(request.data['name'])
        slug = slug_base
        num_suffix = 1

        while WaitingList.objects.filter(slug=slug).exists():
            slug = "{slug_base}-{num_suffix}".format(slug_base=slug_base, num_suffix=num_suffix)
            num_suffix += 1

        request.data['slug'] = slug
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        waiting_list = serializer.instance

        fields = [street_field, zip_field, city_field, country_field, birthdate_field, gender_field, phone_field,
                  motivation_field, register_for_another_field, comment_field]

        for field in fields:
            field.waiting_list = waiting_list
            field.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UpdateWaitingListFieldView(UpdateAPIView):
    """
    patch:
    Update field of a waiting list

    Update the field on a waiting list
    """
    http_method_names = ['patch', 'head', 'options', 'trace']
    queryset = WaitingListField.objects.all()
    serializer_class = WaitinglistFieldSerializer

    def update(self, request, *args, **kwargs):
        list_id = kwargs.get('list_id')
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if not instance.waiting_list.id == list_id:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # ensure critical fields cannot be changed
        if 'name' in request.data:
            request.data.pop('name')
        if 'data' in request.data:
            request.data.pop('data')
        if 'type' in request.data:
            request.data.pop('type')
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


class RetrieveUpdateDeleteWaitinglistView(RetrieveUpdateDestroyAPIView):
    """
    get:
    Get a single waiting list

    Get a single waiting list with all setting details

    patch:
    Update a waiting list

    Partially update a  waiting list. Updating the organisation will be ignored.

    delete:
    Delete a waiting list

    Delete a waiting list; also deletes all dependent objects!
    """
    http_method_names = ['get', 'patch', 'delete', 'head', 'options', 'trace']
    queryset = WaitingList.objects.all()
    serializer_class = WaitinglistEditorSerializer
    permission_classes = [IsAuthenticated, IsWaitinglistOrganisationMember]

    def put(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)  # do not allow put; only patch

    def update(self, request, *args, **kwargs):
        if 'organisation' in request.data:
            request.data.pop('organisation')  # Ensure organisation does not get changed

        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        print(self)
        serializer.save()


class ListApplicationsPerWaitinglistView(ListAPIView):
    """
    get:
    Get list of applicants & search/filter

    Get a list of all applicants of a waiting list.
    Search: ?search=term
    Filter by status: ?status=removed
    """

    serializer_class = ApplicationSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['applicant__user__first_name', 'applicant__user__last_name', 'applicant__user__email']
    ordering_fields = ['created_date', 'selected_date', 'waiting_since_date', 'position', 'applicant__user__first_name',
                       'applicant__user__last_name']
    ordering = ['created_date']

    def get_queryset(self):
        list_id = self.kwargs.get("list_id")
        queryset = Application.objects.filter(waiting_list=list_id)

        status = self.request.query_params.get('status', None)
        custom_order = self.request.query_params.get('ordering', None)

        if not custom_order:
            if status == "waiting":
                self.ordering = ['waiting_since_date']

            if status == "selected":
                self.ordering = ['-selected_date']

        if status is not None:
            queryset = queryset.filter(status=status)

        return queryset

    permission_classes = [IsAuthenticated, IsWaitinglistOrganisationMember]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ListWaitinglistConfigurationOptionsView(ListAPIView):
    """
    get:
    List all configuration options for waiting list

    List all configuration options for waiting list
    """
    serializer_class = WaitingListOptionsSerializer

    def get(self, request, *args, **kwargs):
        reconfirmation_cycles = [{"key": key, "value": name} for key, name in RECONFIRMATION_CYCLE_CHOICES]
        reconfirmation_reminders = [{"key": key, "value": name} for key, name in RECONFIRMATION_REMINDER_CHOICES]
        prioritization_options = [{"key": key, "value": name} for key, name in PRIORITIZATION_CHOICES]
        num_selectable = [{"key": key, "value": key} for key in range(1, 11)]
        languages = LanguageSerializer(Language.objects.all(), many=True).data

        return Response({
            "reconfirmationCycles": reconfirmation_cycles,
            "reconfirmationReminders": reconfirmation_reminders,
            "prioritizationOptions": prioritization_options,
            "numSelectable": num_selectable,
            "languages": languages,
        }, status=status.HTTP_200_OK)


class RetrieveWaitinglistPublic(RetrieveAPIView):
    """
    get:
    Get public info on a single waiting list

    Get public info on a single waiting list

    """
    http_method_names = ['get', 'head', 'options', 'trace']
    queryset = WaitingList.objects.all()
    serializer_class = WaitinglistPublicSerializer

    def get_object(self):
        slug = self.kwargs.get("slug")
        waiting_list = get_object_or_404(WaitingList, slug=slug)
        return waiting_list


@swagger_auto_schema(
    method='get',
    operation_description="Export the waiting list applications to CSV file.",
    responses={200: 'CSV file'},
)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsOrganisationAdminOrOwnerForCSV])
def export_waiting_list_to_csv(request, list_id, status):
    # Get the WaitingList object based on the list_id
    waiting_list = get_object_or_404(WaitingList, id=list_id)

    # Get the applications based on the specified status
    if status == 'all':
        applications = waiting_list.applications.all()
    else:
        applications = waiting_list.applications.filter(status=status)

    # Create the HttpResponse object with CSV content-type
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{waiting_list.slug}_applications.csv"'

    # Create the CSV writer
    writer = csv.writer(response)

    # Write the CSV header row with application fields
    field_names = [
        'Application ID',
        'Status',
        'Waiting Since Date',
        'Selected Date',
        'Created Date',
        'Updated Date',
        'Estimated Selection Date',
        'Applicant First Name',
        'Applicant Last Name',
        'Applicant Email',
        'Waiting List Name',
    ]

    for field in WaitingListField.objects.filter(waiting_list=waiting_list, is_displayed=True):
        field_names.append(field.name)

    writer.writerow(field_names)

    # Write each application's data to the CSV file
    for application in applications:
        row = [
            application.id,
            application.status,
            application.waiting_since_date,
            application.selected_date,
            application.created_date,
            application.updated_date,
            application.estimated_selection_date,
            application.applicant.user.first_name,
            application.applicant.user.last_name,
            application.applicant.user.email,
            waiting_list.name,
        ]

        # Add the values of each application field to the row
        for field in WaitingListField.objects.filter(waiting_list=waiting_list, is_displayed=True):
            application_field = ApplicationField.objects.filter(application=application,
                                                                waiting_list_field=field).first()
            row.append(application_field.value if application_field else '')

        writer.writerow(row)

    return response


class SelectApplicationView(APIView):
    """
    post:
    Select an application from the list

    Select an application from the list
    """
    http_method_names = ['post', 'head', 'options', 'trace']
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsWaitinglistOrganisationMember]

    def post(self, request, *args, **kwargs):
        application = get_object_or_404(Application, id=self.kwargs.get("application_id"))

        if application.status == "waiting":
            application.status = "selected"
            application.save()

            return Response(status=status.HTTP_200_OK)

        else:
            return Response("Cannot select application if currently not waiting", status=status.HTTP_400_BAD_REQUEST)
