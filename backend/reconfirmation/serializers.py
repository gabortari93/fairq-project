from rest_framework import serializers
from .models import Reconfirmation


class ReconfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reconfirmation
        fields = '__all__'  # or specify the fields you want to include
