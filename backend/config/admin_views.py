from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework import permissions, viewsets
from django.db import transaction
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from bookings.serializers import BookingSerializer
from payments.models import Payment
from vehicles.models import Vehicle, VehicleImage
from vehicles.serializers import VehicleSerializer
from accounts.models import User
from payments.models import Payment
from payments.serializers import PaymentSerializer
from rest_framework import serializers


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'driving_license', 'is_staff', 'is_active', 'created_at']
        read_only_fields = ['id', 'email', 'created_at', 'is_staff']


class IsStaff(permissions.IsAdminUser):
    pass


class AdminDashboardView(APIView):
    permission_classes = [IsStaff]

    def get(self, request):
        revenue = Payment.objects.filter(status='captured').aggregate(total=Sum('amount'))['total'] or 0
        monthly = Payment.objects.filter(status='captured').annotate(month=TruncMonth('created_at')).values('month').annotate(total=Sum('amount')).order_by('month')
        return Response({
            'customers': User.objects.filter(role='customer').count(),
            'vehicles': Vehicle.objects.filter(is_active=True).count(),
            'bookings': Booking.objects.count(),
            'active_rentals': Booking.objects.filter(status='active').count(),
            'pending_bookings': Booking.objects.filter(status='pending_payment').count(),
            'revenue': revenue,
            'monthly_revenue': list(monthly),
        })


class AdminVehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by('-created_at')
    serializer_class = VehicleSerializer
    permission_classes = [IsStaff]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['category', 'brand', 'location', 'fuel_type', 'transmission', 'is_active']
    search_fields = ['name', 'brand', 'registration_number']

    @transaction.atomic
    def perform_create(self, serializer):
        vehicle = serializer.save()
        self._save_gallery(vehicle)

    @transaction.atomic
    def perform_update(self, serializer):
        vehicle = serializer.save()
        self._save_gallery(vehicle)

    def _save_gallery(self, vehicle):
        for image in self.request.FILES.getlist('images'):
            VehicleImage.objects.create(vehicle=vehicle, image=image)


class AdminBookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('user', 'vehicle').all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [IsStaff]
    http_method_names = ['get', 'patch', 'head', 'options']
    filterset_fields = ['status', 'payment_status', 'vehicle']


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = AdminUserSerializer
    permission_classes = [IsStaff]
    http_method_names = ['get', 'patch', 'head', 'options']
    filterset_fields = ['role', 'is_active']
    search_fields = ['email', 'full_name', 'phone']


class AdminPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.select_related('booking', 'user').all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [IsStaff]
    filterset_fields = ['status', 'currency']
    search_fields = ['razorpay_order_id', 'razorpay_payment_id', 'booking__booking_reference', 'user__email']
