from django.db import models

class Vehiculo(models.Model):
    class EstadoVehiculo(models.TextChoices):
        DISPONIBLE = 'DISPONIBLE', 'Disponible'
        USO = 'USO', 'En uso'
        MANTENIMIENTO = 'MANTENIMIENTO', 'En mantenimiento'
        FUERA = 'FUERA', 'Fuera de servicio'

    placa = models.CharField(max_length=10)
    modelo = models.CharField(max_length=100)
    estado = models.CharField(
        max_length=15,
        choices=EstadoVehiculo.choices,
        default=EstadoVehiculo.DISPONIBLE
    )

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return f"El vehiculo placa {self.placa} se encuentra {self.estado}"
