from django.contrib import admin

from .models import Vehicle, VehicleImage


class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    inlines = [VehicleImageInline]
    list_display = ('name', 'brand', 'category', 'location', 'hourly_price', 'daily_price', 'is_active', 'updated_at')
    list_filter = ('category', 'brand', 'fuel_type', 'transmission', 'location', 'is_active')
    search_fields = ('name', 'brand', 'registration_number', 'location')
    list_editable = ('hourly_price', 'daily_price', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Vehicle identity', {'fields': ('name', 'brand', 'category', 'description', 'registration_number')}),
        ('Rental settings', {'fields': ('hourly_price', 'daily_price', 'location', 'is_active')}),
        ('Specifications', {'fields': ('fuel_type', 'transmission', 'seating_capacity', 'image')}),
        ('Audit', {'fields': ('created_at', 'updated_at')}),
    )
