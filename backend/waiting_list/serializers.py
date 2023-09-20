from django.utils.text import slugify
from rest_framework import serializers

from language.serializers import LanguageSerializer
from organisation.serializers import OrganisationSerializer, OrganisationPublicSerializer, \
    OrganisationVeryShortSerializer
from waiting_list_field.serializers import WaitinglistFieldSerializer
from .models import WaitingList


class WaitinglistEditorSerializer(serializers.ModelSerializer):

    def validate_slug(self, value):
        # Check if slugified version of the input matches the original input
        if value != slugify(value):
            raise serializers.ValidationError(
                f"Please only use letters, numbers, and hyphens. Example: {slugify(value)}.")

        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        representation['organisation'] = OrganisationSerializer(instance.organisation,
                                                                context={'request': request}).data
        representation['fields'] = WaitinglistFieldSerializer(instance.fields.all(), many=True).data
        return representation

    class Meta:
        model = WaitingList
        fields = [
            "id",
            "name",
            "slug",
            "organisation",
            "description",
            "usual_waiting_time",
            "fields",
            "reconfirmation_cycle",
            "reconfirmation_first_reminder",
            "reconfirmation_second_reminder",
            "reconfirmation_message",
            "reconfirmation_remove",
            "num_selectable",
            "identity_verification_required",
            "prioritization_sorting",
            "see_absolute_position",
            "see_relative_position",
            "see_calculated_waiting_time",
            "notify_applicant_monthly",
            "notify_org_weekly",
            "notify_org_no_reconfirm",
            "created_date",
            "updated_date",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'required': True},
            'organisation': {'required': True},
            'fields': {'read_only': True},
            'created_date': {'read_only': True},
            'updated_date': {'read_only': True},
        }


class WaitinglistPublicSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        representation['organisation'] = OrganisationPublicSerializer(instance.organisation,
                                                                      context={'request': request}).data
        representation['fields'] = WaitinglistFieldSerializer(instance.fields.all(), many=True).data
        return representation

    class Meta:
        model = WaitingList
        fields = [
            "id",
            "name",
            "slug",
            "organisation",
            "description",
            "usual_waiting_time",
            "fields",
            "reconfirmation_cycle",
            "reconfirmation_first_reminder",
            "reconfirmation_second_reminder",
            "reconfirmation_message",
            "reconfirmation_remove",
            "identity_verification_required",
            "num_selectable",
            "prioritization_sorting",
            "see_absolute_position",
            "see_relative_position",
            "see_calculated_waiting_time",
            "notify_applicant_monthly",
            "notify_org_weekly",
            "notify_org_no_reconfirm",
            "created_date",
            "updated_date",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'read_only': True},
            'organisation': {'read_only': True},
            'fields': {'read_only': True},
            'created_date': {'read_only': True},
            'updated_date': {'read_only': True},
        }


class WaitinglistShortSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        representation['organisation'] = OrganisationSerializer(instance.organisation,
                                                                context={'request': request}).data
        return representation

    class Meta:
        model = WaitingList
        fields = [
            "id",
            "name",
            "slug",
            "organisation",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'required': True},
            'organisation': {'required': True},
        }


class WaitinglistVeryShortSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        representation['organisation'] = OrganisationVeryShortSerializer(instance.organisation,
                                                                         context={'request': request}).data
        return representation

    class Meta:
        model = WaitingList
        fields = [
            "id",
            "name",
            "slug",
            "organisation",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'required': True},
            'organisation': {'required': True},
        }


class WaitingListOptionsSerializer(serializers.Serializer):
    reconfirmationCycles = serializers.ListField(child=serializers.JSONField())
    reconfirmationReminders = serializers.ListField(child=serializers.JSONField())
    prioritizationOptions = serializers.ListField(child=serializers.JSONField())
    numSelectable = serializers.ListField(child=serializers.JSONField())
    languages = serializers.ListField(child=LanguageSerializer())
