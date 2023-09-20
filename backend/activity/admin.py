from django.contrib import admin
from .models import Activity


class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity', 'waiting_list', 'note', 'created_date')
    list_filter = ('activity', 'waiting_list', 'user')
    search_fields = ('user__username', 'waiting_list__name', 'note')


admin.site.register(Activity, ActivityAdmin)
