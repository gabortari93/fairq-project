from rest_framework.serializers import ModelSerializer

from .models import IdentityVerification


class IdentityVerificationSerializer(ModelSerializer):
    class Meta:
        model = IdentityVerification
        fields = ['id', 'applicant', 'file_front', 'file_back', 'status', 'created_date', 'updated_date']
