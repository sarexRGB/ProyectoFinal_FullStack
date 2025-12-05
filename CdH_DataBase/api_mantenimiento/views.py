from .models import (
    TipoMantenimiento,
    MantenimientoProducto,
    MantenimientoVehiculo,
    MantenimientoPieza
)
from .serializers import (
    TipoMantenimientoSerializer, MantenimientoPiezaSerializer,
    MantenimientoProductoListSerializer, MantenimientoProductoDetailSerializer,
    MantenimientoVehiculoListSerializer, MantenimientoVehiculoDetailSerializer
)
from rest_framework import generics

# Tipo de mantenimiento
class TipoMantenimientoListCreateView(generics.ListCreateAPIView):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer

class TipoMantenimientoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer


# Mantenimiento del producto
class MantenimientoProductoListCreateView(generics.ListCreateAPIView):
    queryset = MantenimientoProducto.objects.all()

    def get_serializer_class(self):
        if self.reques.method == 'GET':
            return MantenimientoProductoListSerializer
        return MantenimientoProductoDetailSerializer

class MantenimientoProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MantenimientoProducto.objects.all()
    serializer_class = MantenimientoProductoDetailSerializer


# Mantenimiento del vehículo
class MantenimientoVehiculoListCreateView(generics.ListCreateAPIView):
    queryset = MantenimientoVehiculo.objects.all()

    def get_serializer_class(self):
        if self.reques.method == 'GET':
            return MantenimientoVehiculoListSerializer
        return MantenimientoVehiculoDetailSerializer

class MantenimientoVehiculoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MantenimientoVehiculo.objects.all()
    serializer_class = MantenimientoVehiculoDetailSerializer

# Repuestos usados en reparación
class MantenimientoPiezaListCreateView(generics.ListCreateAPIView):
    queryset = MantenimientoPieza.objects.all()
    serializer_class = MantenimientoPiezaSerializer

class MantenimientoPiezaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MantenimientoPieza.objects.all()
    serializer_class = MantenimientoPiezaSerializer
