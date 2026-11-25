from datetime import timedelta
from django.utils import timezone
from rest_framework.test import APITestCase

from accounts.models import User
from bookings.models import Booking
from vehicles.models import Vehicle


class PaymentVerificationTests(APITestCase):
    def test_local_test_signature_confirms_booking(self):
        user = User.objects.create_user(username='payer@example.com', email='payer@example.com', password='StrongPass123')
        vehicle = Vehicle.objects.create(name='Payment Bike', brand='YOURS', category='Bikes', registration_number='PAY-001', hourly_price=80, daily_price=1250, fuel_type='Petrol', transmission='Manual', seating_capacity=2, location='Bengaluru')
        self.client.post('/api/accounts/login/', {'email': user.email, 'password': 'StrongPass123'}, format='json')
        token = self.client.post('/api/accounts/login/', {'email': user.email, 'password': 'StrongPass123'}, format='json').data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        start = timezone.now() + timedelta(days=1)
        booking = self.client.post('/api/bookings/create/', {'vehicle_id': vehicle.id, 'pickup_datetime': start.isoformat(), 'return_datetime': (start + timedelta(hours=2)).isoformat()}, format='json').data
        order = self.client.post('/api/payments/create-order/', {'booking_id': booking['id']}, format='json').data
        response = self.client.post('/api/payments/verify/', {'razorpay_order_id': order['order_id'], 'razorpay_payment_id': 'test_payment', 'razorpay_signature': 'test_signature'}, format='json')
        self.assertEqual(response.status_code, 200)
