from django.contrib import admin
from .models import OrganisationUser


class OrganisationUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'language']


admin.site.register(OrganisationUser, OrganisationUserAdmin)
