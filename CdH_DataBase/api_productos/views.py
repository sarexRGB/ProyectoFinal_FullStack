from .models import (
    Categoria,
    Modalidad,
    Producto,
    ProductoModalidad
)
from rest_framework import generics, status
from .serializers import (
    CategoriaListSerializer, CategoriaDetailSerializer,
    ModalidadSerializer,ProductoModalidadSerializer,
    ProductoSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
import cloudinary
import cloudinary.uploader
from django.conf import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
    api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
)


# Cargar imagen
class UploadArchivo(APIView):
    def post(self, request):
        try:
            archivo = request.FILES.get("file")

            if not archivo:
                return Response(
                    {"error": "No se proporcionó ningún archivo"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validar tipo de archivo
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            if archivo.content_type not in allowed_types:
                return Response(
                    {"error": f"Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validar tamaño (máximo 10MB)
            max_size = 10 * 1024 * 1024  # 10MB en bytes
            if archivo.size > max_size:
                return Response(
                    {"error": "El archivo es demasiado grande. Tamaño máximo: 10MB"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Subir a Cloudinary
            result = cloudinary.uploader.upload(
                archivo, 
                resource_type="auto",
                folder="productos"
            )

            url = result.get("secure_url")
            public_id = result.get("public_id")

            return Response({
                "url": url,
                "public_id": public_id,
                "message": "Imagen subida exitosamente"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Error al subir la imagen: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Categorías
class CategoriaListCreateView(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CategoriaListSerializer
        return CategoriaDetailSerializer

class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaDetailSerializer


# Modalidad
class ModalidadListCreateView(generics.ListCreateAPIView):
    queryset = Modalidad.objects.all()
    serializer_class = ModalidadSerializer

class ModalidadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Modalidad.objects.all()
    serializer_class = ModalidadSerializer


# Productos
class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class ProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


# Modalidades de Productos
class ProductoModalidadListCreateView(generics.ListCreateAPIView):
    queryset = ProductoModalidad.objects.all()
    serializer_class = ProductoModalidadSerializer

class ProductoModalidadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductoModalidad.objects.all()
    serializer_class = ProductoModalidadSerializer