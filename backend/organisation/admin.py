from django.contrib import admin
from .models import Organisation


class OrganisationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'description',
    ]


admin.site.register(Organisation, OrganisationAdmin)
