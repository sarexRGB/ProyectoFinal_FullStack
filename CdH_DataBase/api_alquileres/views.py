from .models import (
    Alquiler,
    DetalleAlquiler,
    Devolucion,
    Entrega,
    RetiroCliente
)
from .serializers import (
    AlquilerSerializer,
    DevolucionSerializer,
    EntregaSerializer,
    DetalleAlquilerSerializer,
    RetiroClienteSerializer
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
    serializer_class = DetalleAlquilerSerializer

    def get_queryset(self):
        queryset = DetalleAlquiler.objects.all()
        alquiler_id = self.request.query_params.get('alquiler_id')
        if alquiler_id:
            queryset = queryset.filter(alquiler_id=alquiler_id)
        return queryset

class DetalleAlquilerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DetalleAlquiler.objects.all()
    serializer_class = DetalleAlquilerSerializer

# Devolución del alquiler
class DevolucionListCreateView(generics.ListCreateAPIView):
    serializer_class = DevolucionSerializer

    def get_queryset(self):
        queryset = Devolucion.objects.all()
        alquiler_id = self.request.query_params.get('alquiler_id')
        if alquiler_id:
            queryset = queryset.filter(alquiler_id=alquiler_id)
        return queryset

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

# Retiros de Cliente
class RetiroClienteListCreateView(generics.ListCreateAPIView):
    queryset = RetiroCliente.objects.all()
    serializer_class = RetiroClienteSerializer

class RetiroClienteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RetiroCliente.objects.all()
    serializer_class = RetiroClienteSerializer
