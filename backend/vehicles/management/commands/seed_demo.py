from django.core.management.base import BaseCommand

from vehicles.models import Vehicle


class Command(BaseCommand):
    help = 'Create the starter YOURS vehicle catalogue.'

    def handle(self, *args, **options):
        demo_vehicles = [
            ('Classic 350', 'Royal Enfield', 'Bikes', 'YRS-BK-001', 80, 1250, 'Petrol', 'Manual', 2, 'YOURS Indiranagar pickup hub, 100 Feet Road, Bengaluru'),
            ('Duke 390', 'KTM', 'Bikes', 'YRS-BK-002', 120, 1800, 'Petrol', 'Manual', 2, 'YOURS Koramangala pickup hub, Bengaluru'),
            ('Creta', 'Hyundai', 'SUVs', 'YRS-CAR-001', 240, 3200, 'Petrol', 'Automatic', 5, 'YOURS HSR Layout pickup hub, Bengaluru'),
            ('Thar', 'Mahindra', 'Premium Vehicles', 'YRS-CAR-002', 300, 4200, 'Diesel', 'Automatic', 4, 'YOURS Whitefield pickup hub, Bengaluru'),
            ('R15 V4', 'Yamaha', 'Bikes', 'YRS-BK-003', 110, 1600, 'Petrol', 'Manual', 2, 'YOURS MG Road pickup hub, Bengaluru'),
            ('Nexon EV', 'Tata', 'Cars', 'YRS-CAR-003', 220, 2900, 'Electric', 'Automatic', 5, 'YOURS Yeshwanthpur pickup hub, Bengaluru'),
        ]
        for name, brand, category, registration, hourly, daily, fuel, transmission, seats, pickup_address in demo_vehicles:
            Vehicle.objects.update_or_create(registration_number=registration, defaults={
                'name': name, 'brand': brand, 'category': category, 'hourly_price': hourly, 'daily_price': daily,
                'fuel_type': fuel, 'transmission': transmission, 'seating_capacity': seats, 'location': 'Bengaluru',
                'pickup_address': pickup_address,
                'description': f'{brand} {name} — maintained and ready for your next journey.', 'is_active': True,
            })
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(demo_vehicles)} vehicles.'))
