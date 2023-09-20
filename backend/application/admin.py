from django.contrib import admin

from application_field.models import ApplicationField
from .models import Application


class ApplicationFieldInline(admin.TabularInline):
    model = ApplicationField
    readonly_fields = ['waiting_list_field', ]
    extra = 0


class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'applicant', 'waiting_list', 'created_date', 'waiting_since_date', 'position', 'status']
    list_filter = ['status', 'waiting_list', ]
    readonly_fields = ['position', 'applicant', 'waiting_list', 'waiting_since_date', 'selected_date', 'estimated_selection_date']
    inlines = [ApplicationFieldInline]

    @staticmethod
    def set_to_waiting(modeladmin, request, queryset):
        for obj in queryset:
            obj.status = "waiting"
            obj.save()

    set_to_waiting.short_description = "Change status to 'waiting'"

    @staticmethod
    def set_to_selected(modeladmin, request, queryset):
        for obj in queryset:
            obj.status = "selected"
            obj.save()

    set_to_selected.short_description = "Change status to 'selected'"

    @staticmethod
    def set_to_removed(modeladmin, request, queryset):
        for obj in queryset:
            obj.status = "removed"
            obj.save()

    set_to_removed.short_description = "Change status to 'removed'"

    actions = [set_to_waiting, set_to_selected, set_to_removed]


admin.site.register(Application, ApplicationAdmin)
