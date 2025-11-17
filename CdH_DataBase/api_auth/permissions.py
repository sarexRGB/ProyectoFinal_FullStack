from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    """
    Permite acceso solo si el usuario pertenece al grupo 'Administrador'
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.groups.filter(name="Administrador").exists()
