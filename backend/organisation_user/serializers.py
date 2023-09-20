from rest_framework import serializers

from language.serializers import LanguageSerializer
from user.serializers import AuthUserSerializer
from .models import OrganisationUser


class OrganisationUserSerializer(serializers.ModelSerializer):
    language = LanguageSerializer(read_only=True)
    user = AuthUserSerializer(read_only=False)

    class Meta:
        model = OrganisationUser
        fields = [
            'id',
            'user',
            'language',
        ]
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def update(self, instance, validated_data):
        # Handle the nested `user` field
        user_data = validated_data.pop('user')
        # Assuming `user` is a OneToOne field
        user = instance.user

        # Update the `AuthUser` data
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        # Handle the non-nested fields
        instance.language = validated_data.get('language', instance.language)
        instance.save()

        return instance
