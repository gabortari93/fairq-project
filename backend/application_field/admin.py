from django.contrib import admin
from .models import ApplicationField


class ApplicationFieldAdmin(admin.ModelAdmin):
    list_display = ['waiting_list_field', 'application', 'value']

    list_filter = ['application', ]


admin.site.register(ApplicationField, ApplicationFieldAdmin)
