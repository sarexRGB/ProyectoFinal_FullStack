from django.db import models

class Pago(models.Model):
    class TipoCompra(models.TextChoices):
        VENTA = 'VENTA', 'Venta'
        ALQUILER = 'ALQUILER', 'Alquiler'

    class MetodoPago(models.TextChoices):
        EFECTIVO = 'EFECTIVO', 'Efectivo'
        TARJETA = 'TARJETA CREDITO', 'Tarjeta de crédito'
        TRANSFERENCIA = 'TRANSFERENCIA BANCARIA', 'Transferencia bancaria'
        SINPE = 'SINPE', 'Sinpe'
        CHEQUE = 'CHEQUE', 'Cheque'

    tipo_compra = models.CharField(
        max_length=12,
        choices=TipoCompra.choices,
        default=TipoCompra.VENTA
    )
    metodo_pago = models.CharField(
        max_length=22,
        choices=MetodoPago.choices,
        default=MetodoPago.EFECTIVO
    )
    monto = models.DecimalField(max_digits=9, decimal_places=2)
    fecha_pago = models.DateField()
    venta = models.ForeignKey('api_ventas.Venta', on_delete=models.CASCADE, null=True)
    alquiler = models.ForeignKey('api_alquileres.Alquiler', on_delete=models.CASCADE, null=True)
