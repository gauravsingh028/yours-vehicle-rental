from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source='vehicle.name', read_only=True)
    vehicle_image = serializers.ImageField(source='vehicle.image', read_only=True)
    vehicle_location = serializers.CharField(source='vehicle.location', read_only=True)
    vehicle_pickup_address = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)

    def get_vehicle_pickup_address(self, obj):
        return obj.vehicle.pickup_address or obj.vehicle.location

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'booking_reference', 'user', 'rental_hours', 'rental_amount', 'tax_amount', 'security_deposit', 'total_amount', 'advance_amount', 'status', 'payment_status', 'hold_expires_at', 'created_at', 'updated_at', 'vehicle_name', 'vehicle_image', 'vehicle_location', 'vehicle_pickup_address', 'user_email']


class CreateBookingSerializer(serializers.Serializer):
    vehicle_id = serializers.IntegerField()
    pickup_datetime = serializers.DateTimeField()
    return_datetime = serializers.DateTimeField()
