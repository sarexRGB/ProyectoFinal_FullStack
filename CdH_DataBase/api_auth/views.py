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
        group_name = request.data.get("group", "Empleado")

        if Usuario.objects.filter(username=username).exists():
            return Response({"error": "Ese usuario ya existe"}, status=400)

        nuevo = Usuario.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        group = Group.objects.filter(name=group_name).first()
        if group:
            nuevo.groups.add(group)

        return Response({"message": "Usuario creado correctamente"}, status=201)


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
