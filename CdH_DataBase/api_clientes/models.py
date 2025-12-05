from django.db import models

class Cliente(models.Model):
    nombre = models.CharField(max_length=50)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50, blank=True, null=True)
    telefono = models.CharField(max_length=20)
    email = models.EmailField(unique=True, blank=True, null=True)

    def __str__(self):
        return f'{self.nombre} {self.primer_apellido} {self.segundo_apellido or ""}'.strip()

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"