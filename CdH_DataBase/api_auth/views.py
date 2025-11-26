from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group

from api_usuarios.models import Usuario
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

        if Usuario.objects.filter(username=username).exists():
            return Response({"error": "Ese usuario ya existe"}, status=400)

        nuevo = Usuario.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        # Assign multiple groups if provided
        if group_ids:
            # Validate that all group IDs exist
            groups = Group.objects.filter(id__in=group_ids)
            if groups.count() != len(group_ids):
                nuevo.delete()  # Rollback user creation
                return Response({"error": "Uno o más grupos no son válidos"}, status=400)
            
            nuevo.groups.set(groups)

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
