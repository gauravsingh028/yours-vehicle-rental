from datetime import timedelta
from django.utils import timezone
from rest_framework.test import APITestCase

from accounts.models import User
from vehicles.models import Vehicle


class BookingAvailabilityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test@example.com', email='test@example.com', password='StrongPass123')
        self.vehicle = Vehicle.objects.create(name='Test Bike', brand='YOURS', category='Bikes', registration_number='TEST-001', hourly_price=80, daily_price=1250, fuel_type='Petrol', transmission='Manual', seating_capacity=2, location='Bengaluru')
        response = self.client.post('/api/accounts/login/', {'email': 'test@example.com', 'password': 'StrongPass123'}, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_overlapping_booking_is_rejected(self):
        start = timezone.now() + timedelta(days=1)
        first = self.client.post('/api/bookings/create/', {'vehicle_id': self.vehicle.id, 'pickup_datetime': start.isoformat(), 'return_datetime': (start + timedelta(hours=4)).isoformat()}, format='json')
        second = self.client.post('/api/bookings/create/', {'vehicle_id': self.vehicle.id, 'pickup_datetime': (start + timedelta(hours=1)).isoformat(), 'return_datetime': (start + timedelta(hours=5)).isoformat()}, format='json')
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 400)
