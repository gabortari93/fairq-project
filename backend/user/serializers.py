from rest_framework import serializers

from .models import AuthUser


class AuthUserSerializer(serializers.ModelSerializer):
    is_org_user = serializers.SerializerMethodField()
    is_applicant = serializers.SerializerMethodField()

    def get_is_org_user(self, user):
        if hasattr(user, 'organisation_user'):
            return True
        return False

    def get_is_applicant(self, user):
        if hasattr(user, 'applicant'):
            return True
        return False

    class Meta:
        model = AuthUser
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_org_user',
            'is_applicant',
            'is_active',
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'is_active': {'read_only': True},
        }
