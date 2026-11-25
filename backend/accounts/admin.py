from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class AccountAdmin(UserAdmin):
    list_display = ('email', 'full_name', 'phone', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'full_name', 'phone', 'driving_license')
    ordering = ('-created_at',)
    fieldsets = UserAdmin.fieldsets + (
        ('YOURS profile', {'fields': ('full_name', 'phone', 'role', 'driving_license')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('YOURS profile', {'fields': ('email', 'full_name', 'phone', 'role')}),
    )
