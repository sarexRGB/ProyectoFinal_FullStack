from .models import (
    Categoria,
    Modalidad,
    Producto,
    ProductoModalidad
)
from rest_framework import generics
from .serializers import (
    CategoriaListSerializer, CategoriaDetailSerializer,
    ModalidadSerializer,ProductoModalidadSerializer,
    ProductoListSerializer, ProductoDetailSerializer
)

# Categorías
class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CategoriaListSerializer
        return CategoriaDetailSerializer

class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaDetailSerializer


# Modalidad
class ModalidadListCreateView(generics.ListCreateAPIView):
    queryset = Modalidad.objects.all()
    serializer_class = ModalidadSerializer

class ModalidadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Modalidad.objects.all()
    serializer_class = ModalidadSerializer


# Productos
class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductoListSerializer
        return ProductoDetailSerializer

class ProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoDetailSerializer


# Modalidades de Productos
class ProductoModalidadListCreateView(generics.ListCreateAPIView):
    queryset = ProductoModalidad.objects.all()
    serializer_class = ProductoModalidadSerializer

class ProductoModalidadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductoModalidad.objects.all()
    serializer_class = ProductoModalidadSerializer