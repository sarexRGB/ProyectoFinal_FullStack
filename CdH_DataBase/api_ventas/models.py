from django.db import models

class Venta(models.Model):
    cliente = models.ForeignKey('api_clientes.Cliente', on_delete=models.CASCADE)
    fecha = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'

    def __str__(self):
        return f"El cliente {self.cliente} hizo una compra de {self.total} el día {self.fecha}"

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey('api_productos.Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Detalle de la venta'
        verbose_name_plural = 'Detalles de las ventas'

    def __str__(self):
        return f"La venta {self.venta} llevaba {self.producto}"
