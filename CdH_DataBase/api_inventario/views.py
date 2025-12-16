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
    BodegaSerializer,
    ProveedorSerializer,
    PiezaSerializer,
    InventarioSerializer,
    InventarioPiezaSerializer,
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
    serializer_class = PiezaSerializer

class PiezaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pieza.objects.all()
    serializer_class = PiezaSerializer


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
    serializer_class = InventarioSerializer

    def get_queryset(self):
        queryset = Inventario.objects.all()
        producto = self.request.query_params.get('producto')
        if producto is not None:
            queryset = queryset.filter(producto=producto)
        return queryset

class InventarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer


# Inventario de piezas de repuesto
class InventarioPiezaListCreateView(generics.ListCreateAPIView):
    queryset = InventarioPieza.objects.all()
    serializer_class = InventarioPiezaSerializer

    def get_queryset(self):
        queryset = InventarioPieza.objects.all()
        pieza = self.request.query_params.get('pieza')
        if pieza is not None:
            queryset = queryset.filter(pieza=pieza)
        return queryset

class InventarioPiezaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InventarioPieza.objects.all()
    serializer_class = InventarioPiezaSerializer


# Movimientos de los inventarios
class MovimientoInventarioListCreateView(generics.ListCreateAPIView):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer

class MovimientoInventarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MovimientoInventario.objects.all()
    serializer_class = MovimientoInventarioSerializer


