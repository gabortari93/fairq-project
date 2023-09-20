from django.contrib import admin
from .models import Language


class LanguageAdmin(admin.ModelAdmin):
    list_display = ['iso_code', 'id']


admin.site.register(Language, LanguageAdmin)
