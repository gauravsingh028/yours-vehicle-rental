from django.conf import settings
from django.db import models

from bookings.models import Booking


class Payment(models.Model):
    STATUS_CHOICES = [('created', 'Created'), ('captured', 'Captured'), ('failed', 'Failed'), ('refunded', 'Refunded')]
    booking = models.OneToOneField(Booking, on_delete=models.PROTECT, related_name='payment')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='payments')
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=255, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=6, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.razorpay_order_id or f'Payment {self.pk}'
