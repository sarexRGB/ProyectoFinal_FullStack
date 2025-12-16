from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group

from api_usuarios.models import Usuario, ChoferDatos, MecanicoDatos, DespachoDatos
from .permissions import IsAdminRole
from .token_serializers import MyTokenObtainPairSerializer


class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        group_ids = request.data.get("groups", [])
        role_data = request.data.get("role_data", {})
        
        # Additional fields
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        segundo_apellido = request.data.get("segundo_apellido", "")
        telefono = request.data.get("telefono", "")
        fecha_ingreso = request.data.get("fecha_ingreso")

        if Usuario.objects.filter(username=username).exists():
            return Response({"error": "Ese usuario ya existe"}, status=400)

        nuevo = Usuario.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        
        # Save additional fields manually since create_user doesn't handle all of them
        nuevo.segundo_apellido = segundo_apellido
        nuevo.telefono = telefono
        if fecha_ingreso:
            nuevo.fecha_ingreso = fecha_ingreso
        nuevo.save()

        # Assign multiple groups if provided
        if group_ids:
            # Validate that all group IDs exist
            groups = Group.objects.filter(id__in=group_ids)
            if groups.count() != len(group_ids):
                nuevo.delete()  # Rollback user creation
                return Response({"error": "Uno o más grupos no son válidos"}, status=400)
            
            nuevo.groups.set(groups)
            
            # Handle role specific data
            for group in groups:
                 group_data = role_data.get(str(group.id), {})
                 
                 if 'Chofer' in group.name:
                     ChoferDatos.objects.create(
                         empleado=nuevo,
                         licencia_numero=group_data.get('licencia_numero', ''),
                         licencia_tipo=group_data.get('licencia_tipo', 'A1'),
                         fecha_vencimiento=group_data.get('fecha_vencimiento', '2030-01-01'), # Default date if missing
                         experiencia_anios=group_data.get('experiencia_anios', 0),
                         observaciones=group_data.get('observaciones', '')
                     )
                 elif 'Mecánico' in group.name:
                     MecanicoDatos.objects.create(
                         empleado=nuevo,
                         especialidad=group_data.get('especialidad', ''),
                         certificaciones=group_data.get('certificaciones', ''),
                         experiencia_anios=group_data.get('experiencia_anios', 0),
                         observaciones=group_data.get('observaciones', '')
                     )
                 elif 'Despacho' in group.name:
                     DespachoDatos.objects.create(
                         empleado=nuevo,
                         observaciones=group_data.get('observaciones', '')
                     )

        # Return user data with ID and assigned groups
        return Response({
            "message": "Usuario creado correctamente",
            "id": nuevo.id,
            "username": nuevo.username,
            "email": nuevo.email,
            "groups": [{"id": g.id, "name": g.name} for g in nuevo.groups.all()]
        }, status=201)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout exitoso"})
        except Exception:
            return Response({"error": "Token inválido"}, status=400)
