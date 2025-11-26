from .models import Pago
from .serializers import PagoSerializer
from rest_framework import generics

class PagoListCreateView(generics.ListCreateAPIView):
    queryset = Pago
    serializer_class = PagoSerializer

class PagoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pago
    serializer_class = PagoSerializer