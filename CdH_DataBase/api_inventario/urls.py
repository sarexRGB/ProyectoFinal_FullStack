from django.urls import path
from .views import (
    BodegaLisCreateView, BodegaDetailView,
    PiezaListCreateView, PiezaDetailView,
    ProveedoresListCreateView, ProveedoresDetailView,
    InventarioListCreateView, InventarioDetailView,
    InventarioPiezaListCreateView, InventarioPiezaDetailView,
    MovimientoInventarioListCreateView, MovimientoInventarioDetailView
)

urlpatterns = [
    # Bodega
    path('bodega/', BodegaLisCreateView.as_view(), name='bodega-list'),
    path('bodega/<int:pk>/', BodegaDetailView.as_view(), name='bodega-detail'),

    # Piezas de repuesto
    path('pieza/', PiezaListCreateView.as_view(), name='pieza-list'),
    path('pieza/<int:pk>/', PiezaDetailView.as_view(), name='pieza-detail'),

    # Proveedor
    path('proveedor/', ProveedoresListCreateView.as_view(), name='proveedor-list'),
    path('proveedor/<int:pk>/', ProveedoresDetailView.as_view(), name='proveedor-detail'),

    # Inventario
    path('inventario/', InventarioListCreateView.as_view(), name='inventario-list'),
    path('inventario/<int:pk>/', InventarioDetailView.as_view(), name='inventario-detail'),

    # Inventario de piezas de repuesto
    path('inventario_pieza/', InventarioPiezaListCreateView.as_view(), name='inventarioPieza-list'),
    path('inventario_pieza/<int:pk>/', InventarioPiezaDetailView.as_view(), name='inventarioPieza-detail'),

    # Movimientos de los inventarios
    path('movimiento/', MovimientoInventarioListCreateView.as_view(), name='movimiento-list'),
    path('movimiento/<int:pk>/', MovimientoInventarioDetailView.as_view(), name='movimiento-detail'),
]