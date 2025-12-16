from .models import Usuario, RolesEmpleado, ChoferDatos, MecanicoDatos, DespachoDatos, Asistencia
from .permissions import IsAdminGroup
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import (
    UsuarioSerializer,
    RolesEmpleadoSerializer,
    ChoferDatosSerializer,
    MecanicoDatosSerializer,
    DespachoDatosSerializer,
    AsistenciaSerializer,
)

# Usuarios

class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UsuarioSerializer


class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_update_view(request):
    serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()   
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_password_view(request, pk):
    try:
        user = Usuario.objects.get(pk=pk)
        user.set_password("central2025")
        user.save()
        return Response({"message": "Contraseña restablecida exitosamente a 'central2025'"})
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=404)


# Roles de empleados
class RolesEmpleadoListCreateView(generics.ListCreateAPIView):
    queryset = RolesEmpleado.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = RolesEmpleadoSerializer


class RolesEmpleadoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RolesEmpleado.objects.all()
    serializer_class = RolesEmpleadoSerializer
    permission_classes = [IsAuthenticated]


# Choferes
class ChoferDatosListCreateView(generics.ListCreateAPIView):
    queryset = ChoferDatos.objects.select_related("empleado").all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChoferDatosSerializer


class ChoferDatosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChoferDatos.objects.select_related("empleado").all()
    serializer_class = ChoferDatosSerializer
    permission_classes = [IsAuthenticated]


# Mecánicos
class MecanicoDatosListCreateView(generics.ListCreateAPIView):
    queryset = MecanicoDatos.objects.select_related("empleado").all()
    permission_classes = [IsAuthenticated]
    serializer_class = MecanicoDatosSerializer


class MecanicoDatosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MecanicoDatos.objects.select_related("empleado").all()
    serializer_class = MecanicoDatosSerializer
    permission_classes = [IsAuthenticated]


# Despachadores
class DespachoDatosListCreateView(generics.ListCreateAPIView):
    queryset = DespachoDatos.objects.select_related("empleado").all()
    permission_classes = [IsAuthenticated]
    serializer_class = DespachoDatosSerializer

class DespachoDatosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DespachoDatos.objects.select_related("empleado").all()
    serializer_class = DespachoDatosSerializer
    permission_classes = [IsAuthenticated]


# Asistencias
class AsistenciaListCreateView(generics.ListCreateAPIView):
    queryset = Asistencia.objects.select_related("empleado").all()
    serializer_class = AsistenciaSerializer
    permission_classes = [IsAuthenticated]

class AsistenciaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Asistencia.objects.select_related("empleado").all()
    serializer_class = AsistenciaSerializer
    permission_classes = [IsAuthenticated]


# Empleados
class EmpleadoListView(generics.ListAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Usuario.objects.filter(groups__name__in=['Mecánico', 'Chofer', 'Despacho']).distinct()