from django.db import models


class Vehicle(models.Model):
    CATEGORY_CHOICES = [('Cars', 'Cars'), ('Bikes', 'Bikes'), ('Scooters', 'Scooters'), ('SUVs', 'SUVs'), ('Premium Vehicles', 'Premium Vehicles')]
    FUEL_CHOICES = [('Petrol', 'Petrol'), ('Diesel', 'Diesel'), ('Electric', 'Electric'), ('Hybrid', 'Hybrid')]
    TRANSMISSION_CHOICES = [('Manual', 'Manual'), ('Automatic', 'Automatic')]

    name = models.CharField(max_length=120)
    brand = models.CharField(max_length=80)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    registration_number = models.CharField(max_length=30, unique=True)
    hourly_price = models.DecimalField(max_digits=10, decimal_places=2)
    daily_price = models.DecimalField(max_digits=10, decimal_places=2)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES)
    seating_capacity = models.PositiveSmallIntegerField(default=2)
    location = models.CharField(max_length=120)
    pickup_address = models.CharField(max_length=240, blank=True)
    image = models.ImageField(upload_to='vehicles/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.brand} {self.name}'


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='vehicles/gallery/')
    caption = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at', 'id']

    def __str__(self):
        return f'{self.vehicle} image {self.pk}'
