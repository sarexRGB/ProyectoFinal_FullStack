from .models import Pago
from .serializers import PagoSerializer
from rest_framework import generics

class PagoListCreateView(generics.ListCreateAPIView):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer

class PagoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
