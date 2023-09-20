import os

from django.contrib.auth import get_user_model

from rest_framework.generics import CreateAPIView, get_object_or_404

from applicant.models import Applicant
from project.sendgrid import send_email
from .serializers import IdentityVerificationSerializer
from .models import IdentityVerification


class IdentityVerificationCreateView(CreateAPIView):
    queryset = IdentityVerification.objects.all()
    serializer_class = IdentityVerificationSerializer

    def create(self, request, *args, **kwargs):
        applicant_id = self.kwargs.get('applicant_id')
        applicant = get_object_or_404(Applicant, id=applicant_id)
        request.data['applicant'] = applicant.id

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save()

        # Create unsaved User instance to hold admin email
        User = get_user_model()
        admin_user = User(email={os.environ.get('EMAIL_TO_ADDRESS')})

        # Send email to fairQ team
        # Template data
        template_data = {
            "name": "fairQ Team",
            "id": instance.id,
            "link": f"{os.environ.get('BACKEND_BASE_URL')}/api/admin/identity_verification/identityverification/{instance.id}/change/"
        }

        # Send email to fairQ team
        send_email(
            user=admin_user,
            event="identity_verification_admin",
            template_data=template_data
        )
