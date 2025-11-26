from django.urls import path
from .views import PagoListCreateView, PagoDetailView

urlpatterns = [
    path('pago/', PagoListCreateView.as_view(), name='pago-list'),
    path('pago/<int:pk>/', PagoDetailView.as_view(), name='pago-detail')
]