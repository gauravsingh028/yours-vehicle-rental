from django.urls import path

from .views import CreateOrderView, PaymentHistoryView, VerifyPaymentView

urlpatterns = [
    path('create-order/', CreateOrderView.as_view()),
    path('verify/', VerifyPaymentView.as_view()),
    path('history/', PaymentHistoryView.as_view()),
]
