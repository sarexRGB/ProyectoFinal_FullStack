from rest_framework.permissions import BasePermission

class IsAdminGroup(BasePermission):
    # Permite acceso total solo a los usuarios del grupo 'Administrador'
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.groups.filter(name='Administrador').exists()
        )


class IsOwnerOrReadOnly(BasePermission):
    """
    Permite a chofer, mecánico o despacho ver y editar su propio perfil,
    pero no el de otros usuarios.
    """
    def has_object_permission(self, request, view, obj):
        # Solo autenticados pueden entrar aquí
        if not request.user.is_authenticated:
            return False

        # Si es admin, tiene acceso total
        if request.user.groups.filter(name='Administrador').exists():
            return True

        # Si el objeto pertenece al usuario (su propio perfil)
        return obj == request.user
