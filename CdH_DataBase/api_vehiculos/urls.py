from django.urls import path
from .views import VehiculoListCreateView, VehiculoDetailView

urlpatterns = [
    path('vehiculo/', VehiculoListCreateView.as_view(), name='vehiculo-list'),
    path('vehiculo/<int:pk>/', VehiculoDetailView.as_view(), name='vehiculo-detail')
]