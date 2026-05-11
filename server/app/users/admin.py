from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['username', 'get_full_name', 'email', 'department', 'is_email_verified', 'is_active']
    list_filter   = ['department', 'is_active', 'is_email_verified']
    search_fields = ['username', 'first_name', 'last_name', 'email']
    ordering      = ['username']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('SCH 정보', {
            'fields': ('department', 'gpa', 'ai_tone', 'is_email_verified'),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('SCH 정보', {
            'fields': ('email', 'department'),
        }),
    )


@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display  = ['email', 'code', 'is_used', 'created_at', 'expires_at']
    list_filter   = ['is_used']
    search_fields = ['email']
    readonly_fields = ['created_at']
