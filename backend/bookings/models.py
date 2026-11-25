import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone

from vehicles.models import Vehicle


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending_payment', 'Pending payment'), ('confirmed', 'Confirmed'), ('active', 'Active'),
        ('completed', 'Completed'), ('cancelled', 'Cancelled'), ('expired', 'Expired'),
    ]
    PAYMENT_STATUS_CHOICES = [('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded')]

    booking_reference = models.CharField(max_length=18, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='bookings')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='bookings')
    pickup_datetime = models.DateTimeField()
    return_datetime = models.DateTimeField()
    rental_hours = models.PositiveIntegerField()
    rental_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_payment')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    hold_expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['vehicle', 'pickup_datetime', 'return_datetime']),
            models.Index(fields=['user', 'status']),
        ]

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = f'YRS-{uuid.uuid4().hex[:10].upper()}'
        super().save(*args, **kwargs)

    def is_active_hold(self):
        return self.status in {'confirmed', 'active'} or (self.status == 'pending_payment' and self.hold_expires_at and self.hold_expires_at > timezone.now())

    def __str__(self):
        return self.booking_reference
