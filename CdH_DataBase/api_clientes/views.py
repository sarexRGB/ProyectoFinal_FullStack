from .models import Cliente
from rest_framework import generics
from .serializers import ClienteSerializer
from .permissions import IsAdminGroupOrReadOnly

class ClienteListCreateView(generics.ListCreateAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAdminGroupOrReadOnly]

class ClienteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAdminGroupOrReadOnly]
