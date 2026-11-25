from django.contrib import admin

from .models import Booking


@admin.action(description='Mark selected bookings as confirmed')
def confirm_bookings(modeladmin, request, queryset):
    queryset.filter(status='pending_payment').update(status='confirmed', payment_status='paid')


@admin.action(description='Cancel selected bookings')
def cancel_bookings(modeladmin, request, queryset):
    queryset.exclude(status='completed').update(status='cancelled')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'user', 'vehicle', 'pickup_datetime', 'return_datetime', 'total_amount', 'status', 'payment_status')
    list_filter = ('status', 'payment_status', 'vehicle__category', 'pickup_datetime')
    search_fields = ('booking_reference', 'user__email', 'user__full_name', 'vehicle__name', 'vehicle__registration_number')
    autocomplete_fields = ('user', 'vehicle')
    readonly_fields = ('booking_reference', 'rental_hours', 'rental_amount', 'tax_amount', 'security_deposit', 'total_amount', 'created_at', 'updated_at')
    actions = (confirm_bookings, cancel_bookings)
    date_hierarchy = 'pickup_datetime'
