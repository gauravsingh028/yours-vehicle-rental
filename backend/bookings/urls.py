from django.urls import path

from .views import BookingDetailView, CancelBookingView, CreateBookingView, MyBookingsView

urlpatterns = [
    path('create/', CreateBookingView.as_view()),
    path('my-bookings/', MyBookingsView.as_view()),
    path('<int:pk>/', BookingDetailView.as_view()),
    path('<int:pk>/cancel/', CancelBookingView.as_view()),
]
