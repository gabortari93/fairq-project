from django.utils import timezone
from rest_framework import status
from rest_framework.generics import get_object_or_404, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.models import Application
from permissions.permissions import IsReconfirmationApplicantOrAdminUser
from waiting_list.models import WaitingList
from .models import Reconfirmation
from .serializers import ReconfirmationSerializer


class HandleReconfirmation(GenericAPIView):
    """
    get:
    Get next open reconfirmation

    Get next open reconfirmation


    post:
    Reconfirm a reconfirmation

    Reconfirm a reconfirmation


    delete:
    Decline a reconfirmation; withdraw application

    Decline a reconfirmation; withdraw application

    """
    serializer_class = ReconfirmationSerializer
    permission_classes = [IsAuthenticated, IsReconfirmationApplicantOrAdminUser]
    http_method_names = ['get', 'post', 'delete']

    def get_object(self):  # Get the next open reconfirmation (based on deadline)
        list = get_object_or_404(WaitingList, id=self.kwargs.get('list_id'))
        application = get_object_or_404(Application, id=self.kwargs.get('application_id'))
        obj = Reconfirmation.objects.filter(application=application, application__waiting_list=list,
                                            reconfirmation_date=None).order_by("deadline").first()

        if obj:
            self.check_object_permissions(self.request, obj)
            return obj
        else:
            return None

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        now = timezone.now()
        if now > instance.deadline:
            return Response({"message": "Deadline is already expired"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            instance.reconfirmation_date = timezone.now()
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        application = get_object_or_404(Application, id=instance.application.id)
        application.status = "removed"
        application.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
