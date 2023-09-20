from rest_framework import serializers
from applicant.serializers import ApplicantSerializer
from application_field.serializers import ApplicationFieldSerializer
from identity_verification.serializers import IdentityVerificationSerializer
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    num_waiting_after = serializers.SerializerMethodField()
    num_waiting_total = serializers.SerializerMethodField()
    relative_position = serializers.SerializerMethodField()

    latest_identity_verification = serializers.SerializerMethodField()

    def get_latest_identity_verification(self, obj):
        verifications = obj.applicant.verifications.last()  # get all related identity verifications
        return IdentityVerificationSerializer(verifications, many=False).data  # serialize them

    def get_num_waiting_after(self, obj):
        if obj.position is None:
            return Application.objects.filter(waiting_list=obj.waiting_list, status="waiting").count()
        else:
            return Application.objects.filter(waiting_list=obj.waiting_list, position__gt=obj.position,
                                              status="waiting").count()

    def get_num_waiting_total(self, obj):
        return Application.objects.filter(waiting_list=obj.waiting_list, status="waiting").count()

    def get_relative_position(self, obj):
        if obj.position is None:
            return None
        else:
            total = Application.objects.filter(waiting_list=obj.waiting_list, status="waiting").count()
            return ((total - obj.position) / (total - 1)) * 100 if total > 1 else 100

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        representation['applicant'] = ApplicantSerializer(instance.applicant,
                                                          context={'request': request}).data
        representation['fields'] = ApplicationFieldSerializer(instance.application_fields,
                                                              context={'request': request}, many=True).data
        return representation

    class Meta:
        model = Application
        fields = [
            "id",
            "applicant",
            "waiting_list",
            "status",
            "position",
            "latest_identity_verification",
            "num_waiting_after",
            "num_waiting_total",
            "relative_position",
            "waiting_since_date",
            "estimated_selection_date",
            "selected_date",
            "created_date",
            "updated_date",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'created_date': {'read_only': True},
            'updated_date': {'read_only': True},
            'waiting_since_date': {'read_only': True},
            'selected_date': {'read_only': True},
            'applicant': {'read_only': True},
            'status': {'read_only': True},
            'waiting_list': {'read_only': True},
            'position': {'read_only': True},
            'estimated_selection_date': {'read_only': True},
        }


class ApplicationShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id",
            "waiting_list",
            "status",
            "position",
            "waiting_since_date",
            "estimated_selection_date",
            "selected_date",
            "created_date",
            "updated_date",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'created_date': {'read_only': True},
            'updated_date': {'read_only': True},
            'waiting_since_date': {'read_only': True},
            'selected_date': {'read_only': True},
            'status': {'read_only': True},
            'waiting_list': {'read_only': True},
            'position': {'read_only': True},
            'estimated_selection_date': {'read_only': True},
        }
