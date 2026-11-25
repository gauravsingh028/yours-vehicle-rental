from django.urls import reverse
from rest_framework.test import APITestCase


class RegistrationTests(APITestCase):
    def test_customer_can_register(self):
        response = self.client.post('/api/accounts/register/', {
            'email': 'rider@example.com', 'full_name': 'Test Rider', 'phone': '9999999999',
            'password': 'StrongPass123', 'confirm_password': 'StrongPass123',
        }, format='json')
        self.assertEqual(response.status_code, 201)
