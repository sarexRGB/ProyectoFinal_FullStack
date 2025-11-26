from django.urls import path
from .views import (
    TipoMantenimientoListCreateView, TipoMantenimientoDetailView,
    MantenimientoProductoListCreateView, MantenimientoProductoDetailView,
    MantenimientoVehiculoListCreateView, MantenimientoVehiculoDetailView,
    MantenimientoPiezaListCreateView, MantenimientoPiezaDetailView
)

urlpatterns = [
    # Tipo de mantenimiento
    path('tipo_mantenimiento/', TipoMantenimientoListCreateView.as_view(), name='tipoMantenimiento-list'),
    path('tipo_mantenimiento/<int:pk>/', TipoMantenimientoDetailView.as_view(), name='tipoMantenimiento-detail'),

    # Mantenimiento del producto
    path('mantenimiento_producto/', MantenimientoProductoListCreateView.as_view(), name='mantenimientoProducto-list'),
    path('mantenimiento_producto/<int:pk>/', MantenimientoProductoDetailView.as_view(), name='mantenimientoProducto-detail'),

    # Mantenimiento del vehículo
    path('mantenimiento_vehiculo/', MantenimientoVehiculoListCreateView.as_view(), name='mantenimientoVehiculo-list'),
    path('mantenimiento_vehiculo/<int:pk>/', MantenimientoVehiculoDetailView.as_view(), name='mantenimientoVehiculo-detail'),

    # Repuestos usados en reparación
    path('mantenimiento_pieza/', MantenimientoPiezaListCreateView.as_view(), name='mantenimientoPieza-list'),
    path('mantenimiento_pieza/<int:pk>/', MantenimientoPiezaDetailView.as_view(), name='mantenimientoPieza-detail'),
]