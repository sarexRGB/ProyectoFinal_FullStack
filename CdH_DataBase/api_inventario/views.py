from .models import (
    Bodega,
    Pieza,
    Proveedor,
    Inventario,
    InventarioPieza,
    MovimientoInventario
)
from rest_framework import generics
from .serializers import(
    BodegaSerializer, ProveedorSerializer,
    PiezaDetailSerializer, PiezaListSerializer,
    InventarioListSerializer, InventarioDetailSerializer,
    InventarioPiezaListSerializer, InventarioPiezaDetailSerializer,
    MovimientoInventarioSerializer
)

# Bodega
class BodegaLisCreateView(generics.ListCreateAPIView):
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer

class BodegaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer


# Piezas de repuesto
class PiezaListCreateView(generics.ListCreateAPIView):
    queryset = Pieza.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PiezaListSerializer
        return PiezaDetailSerializer

class PiezaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pieza.objects.all()
    serializer_class = PiezaDetailSerializer


# Proveedor
class ProveedoresListCreateView(generics.ListCreateAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class ProveedoresDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer


# Inventario
class InventarioListCreateView(generics.ListCreateAPIView):
    queryset = Inventario.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return InventarioListSerializer
        return InventarioDetailSerializer

class InventarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventario.objects.all()
    serializer_class = InventarioDetailSerializer


# Inventario de piezas de repuesto
class InventarioPiezaListCreateView(generics.ListCreateAPIView):
    queryset = InventarioPieza.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return InventarioPiezaListSerializer
        return InventarioPiezaDetailSerializer

class InventarioPiezaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InventarioPieza.objects.all()
    serializer_class = InventarioPiezaDetailSerializer


# Movimientos de los inventarios
class MovimientoInventarioListCreateView(generics.ListCreateAPIView):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer

class MovimientoInventarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer


