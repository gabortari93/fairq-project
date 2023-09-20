from django.contrib import admin
from .models import AuthToken


class AuthTokenAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'expiry_date', 'token']


admin.site.register(AuthToken, AuthTokenAdmin)
