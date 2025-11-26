from django.urls import path
from .views import (
    VentaListCreateView, VentaDetailView,
    DetalleVentaListCreateView, DetalleVentaDetailView
)

urlpatterns = [
    # Venta
    path('venta/', VentaListCreateView.as_view(), name='venta-list'),
    path('venta/<int:pk>/', VentaDetailView.as_view(), name='venta-Detail'),

    # Detalles de venta
    path('detalleVenta/', DetalleVentaListCreateView.as_view(), name='detalleVenta-list'),
    path('detalleVenta/<int:pk>/', DetalleVentaDetailView.as_view(), name='detalleVenta-Detail'),
]