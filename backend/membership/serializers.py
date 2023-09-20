from rest_framework import serializers

from application.models import Application
from organisation.models import Organisation
from waiting_list.models import WaitingList
from .models import Membership, ROLE_CHOICES, STATUS_CHOICES
from organisation.serializers import OrganisationSerializer
from organisation_user.serializers import OrganisationUserSerializer


class MembershipSerializer(serializers.ModelSerializer):
    organisation = OrganisationSerializer(read_only=True)
    member = OrganisationUserSerializer(read_only=True)
    role_name = serializers.SerializerMethodField()
    status_name = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = [
            'status',
            'status_name',
            'role',
            'role_name',
            'organisation',
            'member',
            'created_date',
        ]

    def get_role_name(self, obj):
        role_id = obj.role
        role_name = dict(ROLE_CHOICES).get(role_id)
        return role_name

    def get_status_name(self, obj):
        status_id = obj.status
        status_name = dict(STATUS_CHOICES).get(status_id)
        return status_name


class WaitinglistNoOrganisationSerializer(serializers.ModelSerializer):
    waiting_applications = serializers.SerializerMethodField()
    selected_applications = serializers.SerializerMethodField()

    def get_waiting_applications(self, obj):
        return Application.objects.filter(waiting_list=obj, status='waiting').count()

    def get_selected_applications(self, obj):
        return Application.objects.filter(waiting_list=obj, status='selected').count()

    class Meta:
        model = WaitingList
        fields = [
            "id",
            "name",
            "slug",
            "waiting_applications",
            "selected_applications",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'required': True},
        }


class OrganisationAndListsSerializer(serializers.ModelSerializer):
    waiting_lists = WaitinglistNoOrganisationSerializer(many=True, read_only=True)

    class Meta:
        model = Organisation
        fields = ["id", "name", "description", "waiting_lists", "logo", "banner", "font",
                  "background_color", "font_color", "accent_color", "custom_branding", "remove_default_branding"]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'read_only': True},
        }


class MembershipUserSerializer(serializers.ModelSerializer):
    organisation = OrganisationAndListsSerializer(read_only=True)
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = [
            'status',
            'role',
            'role_name',
            'organisation',
        ]

    def get_role_name(self, obj):
        role_id = obj.role
        role_name = dict(ROLE_CHOICES).get(role_id)
        return role_name
