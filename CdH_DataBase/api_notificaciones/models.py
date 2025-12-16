from django.db import models

class Notificacion(models.Model):
    usuario = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    completada = models.BooleanField(default=False)
    fecha_realizacion = models.DateTimeField(null=True, blank=True)
    entrega = models.ForeignKey('api_alquileres.Entrega', on_delete=models.CASCADE, null=True, blank=True)
    retiro_cliente = models.ForeignKey('api_alquileres.RetiroCliente', on_delete=models.CASCADE, null=True, blank=True)
    mantenimiento_producto = models.ForeignKey('api_mantenimiento.MantenimientoProducto', on_delete=models.CASCADE, null=True, blank=True)