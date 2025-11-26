from django.urls import path
from .views import (
    AlquilerListCreateView, AlquilerDetailView,
    DetalleAlquilerListCreateView, DetalleAlquilerDetailView,
    DevolucionListCreateView, DevolucionDetailView,
    EntregaListCreateView, EntregaDetailView,
    UploadArchivo
)

urlpatterns = [
    # Alquiler
    path('alquiler/', AlquilerListCreateView.as_view(), name='alquiler-list'),
    path('alquiler/<int:pk>/', AlquilerDetailView.as_view(), name='alquiler-detail'),

    # Detalle del alquiler
    path('detalle_alquiler/', DetalleAlquilerListCreateView.as_view(), name='detalleAlquiler-list'),
    path('detalle_alquiler/<int:pk>/', DetalleAlquilerDetailView.as_view(), name='detalleAlquiler-detail'),

    # Devolución del alquiler
    path('devolucion/', DevolucionListCreateView.as_view(), name='devolucion-list'),
    path('devolucion/<int:pk>/', DevolucionDetailView.as_view(), name='devolucion-detail'),

    # Entregas
    path('entrega/', EntregaListCreateView.as_view(), name='entrega-list'),
    path('entrega/<int:pk>/', EntregaDetailView.as_view(), name='entrega-detail'),

    # Cargar archivo
    path("upload/", UploadArchivo.as_view()),
]