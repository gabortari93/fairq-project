from django.contrib import admin
from .models import Membership


class MembershipAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'role', 'organisation', 'member', 'created_date', 'updated_date']


admin.site.register(Membership, MembershipAdmin)
