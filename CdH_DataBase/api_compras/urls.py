from django.urls import path
from .views import (
    OrdenCompraListCreateView, OrdenCompraDetailView,
    DetalleCompraListCreateView, DetalleCompraDetailView
    )

urlpatterns = [
    # Orden de compra
    path('orden_compra/', OrdenCompraListCreateView.as_view(), name='orden_compra-list'),
    path('orden_compra/<int:pk>/', OrdenCompraDetailView.as_view(), name='orden_compra-detail'),

    # Detalle de la compra
    path('detalle_compra/', DetalleCompraListCreateView.as_view(), name='detalle_compra-list'),
    path('detalle_compra/<int:pk>/', DetalleCompraDetailView.as_view(), name='detalle_compra-detail'),
]