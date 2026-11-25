from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [('customer', 'Customer'), ('admin', 'Admin')]
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=160, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    driving_license = models.CharField(max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # The application authenticates users by email, so Django's management
    # commands must resolve users by email too (including changepassword).
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.full_name or self.email
