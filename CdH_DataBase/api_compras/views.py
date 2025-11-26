from .models import OrdenCompra, DetalleCompra
from .serializers import OrdenCompraSerializer, DetalleCompraSerializer
from rest_framework import generics


# Orden de compra
class OrdenCompraListCreateView(generics.ListCreateAPIView):
    queryset = OrdenCompra
    serializer_class = OrdenCompraSerializer

class OrdenCompraDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OrdenCompra
    serializer_class = OrdenCompraSerializer


# Detalle de la compra
class DetalleCompraListCreateView(generics.ListCreateAPIView):
    queryset = DetalleCompra
    serializer_class = DetalleCompraSerializer

class DetalleCompraDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DetalleCompra
    serializer_class = DetalleCompraSerializer