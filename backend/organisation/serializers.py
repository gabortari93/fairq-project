from rest_framework import serializers
from .models import Organisation


class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ["id", "name", "description", "website_url", "contact_url", "privacy_url", "logo", "banner", "font",
                  "background_color", "font_color", "accent_color", "custom_branding", "remove_default_branding"]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'required': True},
        }


class OrganisationPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ["id", "name", "description", "website_url", "contact_url", "privacy_url", "logo", "banner", "font",
                  "background_color", "font_color", "accent_color", "custom_branding", "remove_default_branding"]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'read_only': True},
        }


class OrganisationVeryShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ["id", "name"]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'required': True},
        }
