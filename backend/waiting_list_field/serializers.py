from rest_framework import serializers

from .models import WaitingListField


class WaitinglistFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitingListField
        fields = [
            "id",
            "name",
            "section",
            "order",
            "type",
            "label",
            "placeholder",
            "data",
            "is_displayed",
            "is_required",
            "waiting_list",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'name': {'required': True},
            'section': {'required': True},
            'order': {'required': True},
            'type': {'required': True},
            'is_displayed': {'required': True},
            'is_required': {'required': True},
            'waiting_list': {'required': True, 'read_only': True},
        }


class WaitinglistFieldShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitingListField
        fields = [
            "id",
            "name",
            "section",
            "order",
            "type",
            "label",
            "data",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
        }
