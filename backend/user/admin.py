from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AuthUser


class IsOrganisationUserFilter(admin.SimpleListFilter):
    title = 'is editor'
    parameter_name = 'is_org_user'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Yes'),
            ('no', 'No'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(organisation_user__isnull=False)
        if self.value() == 'no':
            return queryset.filter(organisation_user__isnull=True)


class IsApplicantFilter(admin.SimpleListFilter):
    title = 'is applicant'
    parameter_name = 'is_applicant'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Yes'),
            ('no', 'No'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(applicant__isnull=False)
        if self.value() == 'no':
            return queryset.filter(applicant__isnull=True)


class AuthUserAdmin(UserAdmin):
    model = AuthUser
    list_display = ['email', 'first_name', 'last_name', 'is_active', 'is_org_user', 'is_applicant', 'date_joined']
    list_filter = [IsOrganisationUserFilter, IsApplicantFilter, 'is_active', 'is_staff', 'is_superuser', ]
    fieldsets = (
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Meta', {'fields': ('date_joined', 'last_login')}),
        ('Credentials', {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser',)}),
        ('Roles', {'fields': ('is_org_user', 'is_applicant')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser')}
         ),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)

    def is_org_user(self, obj):
        return hasattr(obj, 'organisation_user')

    is_org_user.boolean = True
    is_org_user.admin_order_field = 'organisation_user'
    is_org_user.short_description = 'Editor'

    def is_applicant(self, obj):
        return hasattr(obj, 'applicant')

    is_applicant.boolean = True
    is_applicant.admin_order_field = 'applicant'
    is_applicant.short_description = 'Applicant'

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        return readonly_fields + ('is_org_user', 'is_applicant', 'date_joined', 'last_login')


admin.site.register(AuthUser, AuthUserAdmin)
