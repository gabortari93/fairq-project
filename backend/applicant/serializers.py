from rest_framework import serializers

from user.serializers import AuthUserSerializer
from .models import Applicant


class ApplicantSerializer(serializers.ModelSerializer):
    user = AuthUserSerializer(read_only=False)

    class Meta:
        model = Applicant
        fields = [
            'id', 'user',
        ]
        extra_kwargs = {
            'id': {'read_only': True},
        }
