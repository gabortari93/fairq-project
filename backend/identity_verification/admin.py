from django.contrib import admin
from django import forms

from .models import IdentityVerification


class IdentityVerificationAdminForm(forms.ModelForm):

    class Meta:
        model = IdentityVerification
        fields = "__all__"


class IdentityVerificationAdmin(admin.ModelAdmin):
    form = IdentityVerificationAdminForm
    list_display = ['id', 'applicant', 'status', 'created_date', 'verification_date']
    list_filter = ['status']
    readonly_fields = ['verification_date', 'created_date', 'updated_date']

    change_form_template = 'admin/identity_verification/change_form.html'


admin.site.register(IdentityVerification, IdentityVerificationAdmin)
