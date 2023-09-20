from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from application.models import Application
from permissions.permissions import IsApplicationOwner, IsOrganisationMember
from waiting_list.models import WaitingList
from .models import Activity
from .serializers import ActivitySerializer


class ActivitiesByApplication(generics.ListAPIView):
    """
    get:
    Get activities per application

    Get all activities of an application, latest first
    """
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsApplicationOwner]
    pagination_class = None

    def get_queryset(self):
        waiting_list = get_object_or_404(WaitingList, id=self.kwargs.get("list_id"))
        application = get_object_or_404(Application, waiting_list=waiting_list, id=self.kwargs.get("application_id"))
        return Activity.objects.filter(waiting_list=waiting_list, application=application).order_by('-created_date')


class ActivitiesByWaitingList(generics.ListAPIView):
    """
    get:
    Get activities per waiting list

    Get all activities of a waiting list and all its applications, latest first
    """
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsOrganisationMember]
    pagination_class = None

    def get_queryset(self):
        waiting_list = get_object_or_404(WaitingList, id=self.kwargs.get("list_id"))
        return Activity.objects.filter(waiting_list=waiting_list).order_by('-created_date')
