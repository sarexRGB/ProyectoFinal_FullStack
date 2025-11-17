from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('api_auth.urls')),
    path('usuarios/', include('api_usuarios.urls')),
    path('clientes/', include('api_clientes.urls')),
    path('productos/', include('api_productos.urls')),
    path('compras/', include('api_compras.urls')),
    path('finanzas/', include('api_finanzas.urls')),
    path('vehiculos/', include('api_vehiculos.urls')),
    path('mantenimiento/', include('api_mantenimiento.urls')),
    path('ventas/', include('api_ventas.urls')),
    path('alquileres/', include('api_alquileres.urls')),
    path('notificaciones/', include('api_notificaciones.urls')),

]
