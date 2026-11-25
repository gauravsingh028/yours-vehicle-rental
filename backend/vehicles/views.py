from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Vehicle
from .serializers import VehicleSerializer


class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vehicle.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = VehicleSerializer
    filterset_fields = ['category', 'brand', 'location', 'fuel_type', 'transmission']
    search_fields = ['name', 'brand', 'location', 'description']
    ordering_fields = ['hourly_price', 'daily_price', 'created_at', 'name']

    @action(detail=False, methods=['get'])
    def categories(self, request):
        return Response([{'value': value, 'label': label} for value, label in Vehicle.CATEGORY_CHOICES])
