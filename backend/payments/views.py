from django.conf import settings
from django.db import transaction
from decimal import Decimal, ROUND_HALF_UP
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from .models import Payment
from .serializers import PaymentSerializer


class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking_id')
        booking = Booking.objects.filter(pk=booking_id, user=request.user, status='pending_payment').first()
        if not booking:
            return Response({'detail': 'Pending booking not found.'}, status=status.HTTP_404_NOT_FOUND)
        advance_amount = booking.advance_amount or (booking.total_amount * Decimal('0.30')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        amount_paise = int(advance_amount * 100)
        if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            order = client.order.create({'amount': amount_paise, 'currency': 'INR', 'receipt': booking.booking_reference})
            order_id = order['id']
        else:
            order_id = f'local_test_order_{booking.booking_reference}'
        payment, _ = Payment.objects.update_or_create(booking=booking, defaults={'user': request.user, 'razorpay_order_id': order_id, 'amount': advance_amount, 'status': 'created'})
        return Response({'order_id': order_id, 'key_id': settings.RAZORPAY_KEY_ID, 'amount': amount_paise, 'currency': 'INR', 'booking_reference': booking.booking_reference, 'payment_id': payment.id, 'advance_amount': advance_amount, 'total_amount': booking.total_amount, 'remaining_amount': booking.total_amount - advance_amount, 'advance_percentage': 30})


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        order_id = request.data.get('razorpay_order_id')
        payment_id = request.data.get('razorpay_payment_id')
        signature = request.data.get('razorpay_signature')
        payment = Payment.objects.select_for_update().select_related('booking').filter(razorpay_order_id=order_id, user=request.user).first()
        if not payment:
            return Response({'detail': 'Payment order not found.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
                import razorpay
                client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                client.utility.verify_payment_signature({'razorpay_order_id': order_id, 'razorpay_payment_id': payment_id, 'razorpay_signature': signature})
            elif signature != 'test_signature':
                raise ValueError('Local mode requires test_signature.')
        except Exception:
            payment.status = 'failed'
            payment.save(update_fields=['status', 'updated_at'])
            return Response({'detail': 'Payment signature verification failed.'}, status=status.HTTP_400_BAD_REQUEST)
        payment.razorpay_payment_id = payment_id or 'local_test_payment'
        payment.razorpay_signature = signature or 'test_signature'
        payment.status = 'captured'
        payment.save(update_fields=['razorpay_payment_id', 'razorpay_signature', 'status', 'updated_at'])
        booking = payment.booking
        booking.status = 'confirmed'
        booking.payment_status = 'paid'
        booking.save(update_fields=['status', 'payment_status', 'updated_at'])
        return Response({'detail': 'Advance payment verified and booking confirmed.', 'booking_reference': booking.booking_reference, 'vehicle_name': booking.vehicle.name, 'pickup_location': booking.vehicle.pickup_address or booking.vehicle.location, 'advance_amount': payment.amount, 'remaining_amount': booking.total_amount - payment.amount})


class PaymentHistoryView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).select_related('booking')
