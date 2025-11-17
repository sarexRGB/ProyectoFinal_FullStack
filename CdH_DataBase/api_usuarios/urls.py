from django.urls import path
from .views import (
    UsuarioListCreateView, UsuarioDetailView,
    RolesEmpleadoListCreateView, RolesEmpleadoDetailView,
    ChoferDatosListCreateView, ChoferDatosDetailView,
    MecanicoDatosListCreateView, MecanicoDatosDetailView,
    DespachoDatosListCreateView, DespachoDatosDetailView,
    AsistenciaListCreateView, AsistenciaDetailView,
    profile_view
)

urlpatterns = [
    # Usuarios
    path('', UsuarioListCreateView.as_view(), name='usuarios-list'),
    path('<int:pk>/', UsuarioDetailView.as_view(), name='usuarios-detail'),

    path('profile/', profile_view, name='user-profile'),

    # Roles de empleados
    path('roles/', RolesEmpleadoListCreateView.as_view(), name='roles-list'),
    path('roles/<int:pk>/', RolesEmpleadoDetailView.as_view(), name='roles-detail'),

    # Choferes
    path('chofer/', ChoferDatosListCreateView.as_view(), name='chofer-list'),
    path('chofer/<int:pk>/', ChoferDatosDetailView.as_view(), name='chofer-detail'),

    # Mecánicos
    path('mecanico/', MecanicoDatosListCreateView.as_view(), name='mecanico-list'),
    path('mecanico/<int:pk>/', MecanicoDatosDetailView.as_view(),
        name='mecanico-detaiñ'),

    # Despachadores
    path('despacho/', DespachoDatosListCreateView.as_view(), name='despacho-list'),
    path('despacho/<int:pk>/', DespachoDatosDetailView.as_view(),
        name='despacho-detail'),

    # Asistencias
    path('asistencia/', AsistenciaListCreateView.as_view(), name='asistencia-list'),
    path('asistencia/<int:pk>/', AsistenciaDetailView.as_view(),
        name='asistencia-detail'),
]
