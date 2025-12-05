from .models import (
    Alquiler,
    DetalleAlquiler,
    Devolucion,
    Entrega
)
from .serializers import (
    AlquilerSerializer,
    DevolucionSerializer,
    EntregaSerializer,
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
    serializer_class = AlquilerSerializer

class AlquilerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer

# Detalle del alquiler
class DetalleAlquilerListCreateView(generics.ListCreateAPIView):
    queryset = DetalleAlquiler.objects.all()
    serializer_class = DetalleAlquilerSerializer

class DetalleAlquilerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DetalleAlquiler.objects.all()
    serializer_class = DetalleAlquilerSerializer

# Devolución del alquiler
class DevolucionListCreateView(generics.ListCreateAPIView):
    queryset = Devolucion.objects.all()
    serializer_class = DevolucionSerializer

class DevolucionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Devolucion.objects.all()
    serializer_class = DevolucionSerializer

# Entregas
class EntregaListCreateView(generics.ListCreateAPIView):
    queryset = Entrega.objects.all()
    serializer_class = EntregaSerializer

class EntregaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrega.objects.all()
    serializer_class = EntregaSerializer
