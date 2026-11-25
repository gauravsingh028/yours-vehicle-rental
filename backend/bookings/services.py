import math
from decimal import Decimal, ROUND_HALF_UP
from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Booking

TAX_RATE = Decimal('0.18')
DEFAULT_DEPOSIT = Decimal('500.00')
ADVANCE_PAYMENT_RATE = Decimal('0.30')
HOLD_MINUTES = 15
BLOCKING_STATUSES = ['pending_payment', 'confirmed', 'active']


def money(value):
    return Decimal(value).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def calculate_quote(vehicle, pickup_datetime, return_datetime):
    seconds = (return_datetime - pickup_datetime).total_seconds()
    if seconds <= 0:
        raise ValidationError({'return_datetime': 'Return time must be after pickup time.'})
    hours = max(1, math.ceil(seconds / 3600))
    hourly_total = Decimal(hours) * vehicle.hourly_price
    daily_blocks = math.ceil(hours / 24)
    daily_total = Decimal(daily_blocks) * vehicle.daily_price
    rental_amount = money(min(hourly_total, daily_total))
    tax_amount = money(rental_amount * TAX_RATE)
    total_amount = money(rental_amount + tax_amount + DEFAULT_DEPOSIT)
    advance_amount = money(total_amount * ADVANCE_PAYMENT_RATE)
    return {
        'rental_hours': hours,
        'rental_amount': rental_amount,
        'tax_amount': tax_amount,
        'security_deposit': DEFAULT_DEPOSIT,
        'total_amount': total_amount,
        'advance_amount': advance_amount,
    }


def expire_pending_holds(vehicle=None):
    now = timezone.now()
    query = Booking.objects.filter(status='pending_payment', hold_expires_at__lte=now)
    if vehicle is not None:
        query = query.filter(vehicle=vehicle)
    query.update(status='expired')


@transaction.atomic
def create_booking(*, user, vehicle_id, pickup_datetime, return_datetime):
    from vehicles.models import Vehicle
    vehicle = Vehicle.objects.select_for_update().get(pk=vehicle_id, is_active=True)
    expire_pending_holds(vehicle)
    overlap = Booking.objects.filter(
        vehicle=vehicle,
        status__in=BLOCKING_STATUSES,
        pickup_datetime__lt=return_datetime,
        return_datetime__gt=pickup_datetime,
    ).exists()
    if overlap:
        raise ValidationError({'detail': 'This vehicle is already reserved for part of that time window.'})
    quote = calculate_quote(vehicle, pickup_datetime, return_datetime)
    booking = Booking.objects.create(
        user=user,
        vehicle=vehicle,
        pickup_datetime=pickup_datetime,
        return_datetime=return_datetime,
        hold_expires_at=timezone.now() + timedelta(minutes=HOLD_MINUTES),
        **quote,
    )
    return booking
