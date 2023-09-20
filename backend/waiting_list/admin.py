from django.contrib import admin
from .models import WaitingList


class WaitingListAdmin(admin.ModelAdmin):
    list_display = ['name', 'id', 'organisation', 'slug', 'created_date']


admin.site.register(WaitingList, WaitingListAdmin)
