from django.db import models

class Notificacion(models.Model):
    usuario = models.ForeignKey('api_usuarios.usuario', on_delete=models.CASCADE)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now=True)