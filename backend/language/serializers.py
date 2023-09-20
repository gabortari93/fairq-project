from rest_framework import serializers
from .models import Language


class LanguageSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.get_iso_code_display()

    class Meta:
        model = Language
        fields = ['iso_code', 'name']
