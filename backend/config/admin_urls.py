from django.urls import include, path
from rest_framework.routers import DefaultRouter

from config.admin_views import AdminBookingViewSet, AdminDashboardView, AdminPaymentViewSet, AdminUserViewSet, AdminVehicleViewSet

router = DefaultRouter()
router.register('vehicles', AdminVehicleViewSet, basename='admin-vehicles')
router.register('bookings', AdminBookingViewSet, basename='admin-bookings')
router.register('users', AdminUserViewSet, basename='admin-users')
router.register('payments', AdminPaymentViewSet, basename='admin-payments')

urlpatterns = [path('dashboard/', AdminDashboardView.as_view())]
urlpatterns += router.urls
