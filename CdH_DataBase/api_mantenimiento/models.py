from django.db import models

class TipoMantenimiento(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField

    class Meta:
        verbose_name = 'Tipo de mantenimiento'
        verbose_name_plural = 'Tipos de mantenimiento'

    def __str__(self):
        return self.nombre

class MantenimientoProducto(models.Model):
    producto = models.ForeignKey('api_productos.Producto', on_delete=models.CASCADE)
    tipo = models.ForeignKey(TipoMantenimiento, on_delete=models.CASCADE)
    mecanico = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE)
    fecha = models.DateField()
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()

    class Meta:
        verbose_name = 'Mantenimiento del producto'
        verbose_name_plural = 'Mantenimiento de los productos'

    def __str__(self):
        return self.producto

class MantenimientoVehiculo(models.Model):
    vehiculo = models.ForeignKey('api_vehiculos.Vehiculo', on_delete=models.CASCADE)
    tipo = models.ForeignKey(TipoMantenimiento, on_delete=models.CASCADE)
    fecha = models.DateField()
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()

    class Meta:
        verbose_name = 'Mantenimiento del vehículo'
        verbose_name_plural = 'Mantenimiento de los vehículos'

    def __str__(self):
        return self.vehiculo

class MantenimientoPieza(models.Model):
    mantenimiento_producto = models.ForeignKey(MantenimientoProducto, on_delete=models.CASCADE, null=True)
    mantenimiento_vehiculo = models.ForeignKey(MantenimientoVehiculo, on_delete=models.CASCADE, null=True)
    pieza = models.ForeignKey('api_inventario.Pieza', on_delete=models.CASCADE)
    cantidad = models.IntegerField()

    class Meta:
        verbose_name = 'Repuesto usado'
        verbose_name_plural = 'Repuestos usados'

    def __str__(self):
        return f"Se utilizaron {self.cantidad} de {self.pieza} en {self.mantenimiento_producto}"

    def __str__(self):
        return f"Se utilizaron {self.cantidad} de {self.pieza} en {self.mantenimiento_vehiculo}"