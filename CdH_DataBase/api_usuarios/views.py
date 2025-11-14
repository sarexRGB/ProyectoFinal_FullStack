from .models import Usuario, RolesEmpleado, ChoferDatos, MecanicoDatos, DespachoDatos, Asistencia
from .permissions import IsAdminGroup, IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers_token import CustomTokenObtainPairSerializer
from .serializers import (UsuarioListSerializer, UsuarioDetailSerializer,
                        RolesEmpleadoListSerializer, RolesEmpleadoDetailSerializer,
                        ChoferDatosListSerializer, ChoferDatosDetailSerializer,
                        MecanicoDatosListSerializer, MecanicoDatosDetailSerializer,
                        DespachoDatosListSerializer, DespachoDatosDetailSerializer,
                        AsistenciaListSerializer, AsistenciaDetailSerializer)

# Usuarios
class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = [IsAuthenticated, IsAdminGroup]


    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UsuarioListSerializer
        return UsuarioDetailSerializer

class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminGroup]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UsuarioDetailSerializer(request.user)
    return Response(serializer.data)


# Roles de empleados
class RolesEmpleadoListCreateView(generics.ListCreateAPIView):
    queryset = RolesEmpleado.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RolesEmpleadoListSerializer
        return RolesEmpleadoDetailSerializer


class RolesEmpleadoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RolesEmpleado.objects.all()
    serializer_class = RolesEmpleadoDetailSerializer
    permission_classes = [IsAuthenticated]


# Choferes
class ChoferDatosListCreateView(generics.ListCreateAPIView):
    queryset = ChoferDatos.objects.select_related("empleado").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ChoferDatosListSerializer
        return ChoferDatosDetailSerializer


class ChoferDatosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChoferDatos.objects.select_related("empleado").all()
    serializer_class = ChoferDatosDetailSerializer
    permission_classes = [IsAuthenticated]


# Mecánicos
class MecanicoDatosListCreateView(generics.ListCreateAPIView):
    queryset = MecanicoDatos.objects.select_related("empleado").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return MecanicoDatosListSerializer
        return MecanicoDatosDetailSerializer


class MecanicoDatosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MecanicoDatos.objects.select_related("empleado").all()
    serializer_class = MecanicoDatosDetailSerializer
    permission_classes = [IsAuthenticated]


# Despachadores
class DespachoDatosListCreateView(generics.ListCreateAPIView):
    queryset = DespachoDatos.objects.select_related("empleado").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DespachoDatosListSerializer
        return DespachoDatosDetailSerializer


class DespachoDatosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DespachoDatos.objects.select_related("empleado").all()
    serializer_class = DespachoDatosDetailSerializer
    permission_classes = [IsAuthenticated]


# Asistencias
class AsistenciaListCreateView(generics.ListCreateAPIView):
    queryset = Asistencia.objects.select_related("empleado").all()
    permission_classes = [IsAuthenticated]
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AsistenciaListSerializer
        return AsistenciaDetailSerializer


class AsistenciaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Asistencia.objects.select_related("empleado").all()
    serializer_class = AsistenciaDetailSerializer
    permission_classes = [IsAuthenticated]


# Token
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer