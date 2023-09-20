from rest_framework import serializers
from .models import DailyStatsPerWaitingList


class WaitingListStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStatsPerWaitingList
        fields = '__all__'
