from rest_framework import serializers

from waiting_list_field.serializers import WaitinglistFieldShortSerializer
from .models import ApplicationField


class ApplicationFieldSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        representation['waiting_list_field'] = WaitinglistFieldShortSerializer(instance.waiting_list_field,
                                                                               context={'request': request}).data
        return representation

    class Meta:
        model = ApplicationField
        fields = [
            "id",
            "waiting_list_field",
            "value",
        ]
        extra_kwargs = {
            'id': {'read_only': True},
        }
