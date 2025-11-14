from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminGroupOrReadOnly(BasePermission):
    """
    Permite solo lectura a usuarios autenticados.
    Solamente los del grupo 'Administrador' pueden crear, editar o eliminar.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return (
            request.user.is_autenticated and
            request.user.group.filter(name='Administrador').exists()
        )