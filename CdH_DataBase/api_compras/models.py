from django.db import models

class OrdenCompra(models.Model):
    class EstadoOrden(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente'
        APROBADO = 'APROBADO', 'Aporbado'
        RECIBIDO = 'RECIBIDO', 'Recibido'
        CANCELADO = 'CANCELADO', 'Cancelado'

    proveedor = models.ForeignKey('api_inventario.Proveedor', on_delete=models.CASCADE)
    fecha = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(
        max_length=10,
        choices=EstadoOrden.choices,
        default=EstadoOrden.PENDIENTE
    )

    class Meta:
        verbose_name = 'Orden de compra'
        verbose_name_plural = 'Ordenes de compra'

    def __str__(self):
        return self.estado

class DetalleCompra(models.Model):
    orden_compra = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE)
    producto = models.ForeignKey('api_productos.Producto', on_delete=models.CASCADE, null=True, blank=True)
    pieza = models.ForeignKey('api_inventario.Pieza', on_delete=models.CASCADE, null=True, blank=True)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)