from .models import (
    Alquiler,
    DetalleAlquiler,
    Devolucion,
    Entrega
)
from .serializers import (
    AlquilerListSerializer, AlquilerDetailSerializer,
    DevolucionListSerializer, DevolucionDetailSerializer,
    EntregaListSerializer, EntregaDetailSerializer,
    DetalleAlquilerSerializer
)
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
import cloudinary.uploader


# Cargar archivo
class UploadArchivo(APIView):
    def post(self, request):
        archivo = request.FILES.get("file")

        if not archivo:
            return Response({"error": "No file uploaded"}, status=400)

        result = cloudinary.uploader.upload(archivo, resource_type="auto")

        url = result.get("secure_url")

        return Response({"url": url})


# Alquiler
class AlquilerListCreateView(generics.ListCreateAPIView):
    queryset = Alquiler.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AlquilerListSerializer
        return AlquilerDetailSerializer

class AlquilerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerDetailSerializer

# Detalle del alquiler
class DetalleAlquilerListCreateView(generics.ListCreateAPIView):
    queryset = DetalleAlquiler
    serializer_class = DetalleAlquilerSerializer

class DetalleAlquilerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DetalleAlquiler
    serializer_class = DetalleAlquilerSerializer

# Devolución del alquiler
class DevolucionListCreateView(generics.ListCreateAPIView):
    queryset = Devolucion.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DevolucionListSerializer
        return DevolucionDetailSerializer

class DevolucionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Devolucion.objects.all()
    serializer_class = DevolucionDetailSerializer

# Entregas
class EntregaListCreateView(generics.ListCreateAPIView):
    queryset = Entrega.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EntregaListSerializer
        return EntregaDetailSerializer

class EntregaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrega.objects.all()
    serializer_class = EntregaDetailSerializer
