from .models import Vehiculo
from .serializers import VehiculoSerializer
from rest_framework import generics

class VehiculoListCreateView(generics.ListCreateAPIView):
    queryset = Vehiculo
    serializer_class = VehiculoSerializer

class VehiculoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehiculo
    serializer_class = VehiculoSerializer