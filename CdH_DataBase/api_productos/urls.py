from django.urls import path
from .views import (
    CategoriaListCreateView, CategoriaDetailView,
    ModalidadListCreateView, ModalidadDetailView,
    ProductoListCreateView, ProductoDetailView,
    ProductoModalidadListCreateView, ProductoModalidadDetailView,
    UploadArchivo
)

urlpatterns = [
    # Productos
    path('producto/', ProductoListCreateView.as_view(), name='productos-list'),
    path('producto/<int:pk>/', ProductoDetailView.as_view(), name='productos-detail'),

    # Categorías
    path('categoria/', CategoriaListCreateView.as_view(), name='categorias-list'),
    path('categoria/<int:pk>/', CategoriaDetailView.as_view(), name='categorias-detail'),

    # Modalidades
    path('modalidad/', ModalidadListCreateView.as_view(), name='modalidades-list'),
    path('modalidad/<int:pk>/', ModalidadDetailView.as_view(), name='modalidades-detail'),

    # Modalidades por Producto
    path('modalidadproducto/', ProductoModalidadListCreateView.as_view(), name='producto-modalidad-list'),
    path('modalidadproducto/<int:pk>/', ProductoModalidadDetailView.as_view(), name='producto-modalidad-detail'),

    # Cargar imagen
    path("upload/", UploadArchivo.as_view()),
]
