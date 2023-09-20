from rest_framework import serializers

from applicant.serializers import ApplicantSerializer
from application.models import Application
from user.models import AuthUser
from waiting_list.models import WaitingList
from .models import Activity


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUser
        fields = ["first_name", "last_name"]


class SimpleWaitingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitingList
        fields = ["id", "name", "slug"]


class SimpleApplicationSerializer(serializers.ModelSerializer):
    applicant = ApplicantSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ["id", "status", "applicant"]


class ActivitySerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    waiting_list = SimpleWaitingListSerializer(read_only=True)
    application = SimpleApplicationSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = '__all__'
