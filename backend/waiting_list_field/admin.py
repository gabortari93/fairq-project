from django.contrib import admin
from .models import WaitingListField


class WaitingListFieldAdmin(admin.ModelAdmin):
    readonly_fields = ('waiting_list', 'data',)


admin.site.register(WaitingListField, WaitingListFieldAdmin)
