from django.contrib import admin
from .models import DailyStatsPerWaitingList


@admin.register(DailyStatsPerWaitingList)
class DailyStatsPerWaitingListAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'waiting_list',
        'date',
        'date_created',
    ]

    list_filter = ['waiting_list', ]

    actions = ['duplicate_entries']

    def duplicate_entries(self, request, queryset):
        for object in queryset:
            object.id = None
            object.save()

    duplicate_entries.short_description = "Duplicate selected entries"
