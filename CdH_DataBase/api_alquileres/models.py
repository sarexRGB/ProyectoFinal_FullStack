from django.db import models

# Alquiler
class Alquiler(models.Model):
    class EstadoAlquiler(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente'
        ACTIVO = 'ACTIVO', 'Activo'
        FINALIZADO = 'FINALIZADO', 'Finalizado'
        CANCELADO = 'CANCELADO', 'Cancelado'

    cliente = models.ForeignKey('api_clientes.Cliente', on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(
        max_length=15,
        choices=EstadoAlquiler.choices,
        default=EstadoAlquiler.PENDIENTE
    )
    contrato = models.URLField(max_length=500, blank=True, null=True)
    descuento_tipo = models.CharField(
        max_length=15,
        choices=[('NINGUNO', 'Sin descuento'), ('PORCENTAJE', 'Porcentaje'), ('FIJO', 'Monto fijo')],
        default='NINGUNO',
        blank=True,
        null=True
    )
    descuento_valor = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True, null=True)

    class Meta:
        verbose_name = 'Alquiler'
        verbose_name_plural = 'Alquileres'

    def __str__(self):
        return f"El cliente {self.cliente} tiene un alquiler {self.estado}"

# Detalle del alquiler
class DetalleAlquiler(models.Model):
    alquiler = models.ForeignKey(Alquiler, on_delete=models.CASCADE)
    producto = models.ForeignKey('api_productos.Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_diario = models.DecimalField(max_digits=10, decimal_places=2)
    descuento_tipo = models.CharField(
        max_length=15,
        choices=[('NINGUNO', 'Sin descuento'), ('PORCENTAJE', 'Porcentaje'), ('FIJO', 'Monto fijo')],
        default='NINGUNO',
        blank=True,
        null=True
    )
    descuento_valor = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True, null=True)

    class Meta:
        verbose_name = 'Detalle de la alquiler'
        verbose_name_plural = 'Detalles de las alquileres'

    def __str__(self):
        return f"El alquiler {self.venta} lleva {self.producto}"

# Devolución del alquiler
class Devolucion(models.Model):
    class EstadoDevolucion(models.TextChoices):
        BUENO = 'BUENO', 'Bueno'
        DAÑADO = 'DAÑADO', 'Dañado'
        REPARAR = 'REPARAR', 'Requiere reparación'

    alquiler = models.ForeignKey(Alquiler, on_delete=models.CASCADE)
    entrega = models.ForeignKey('Entrega', on_delete=models.CASCADE, null=True, blank=True, related_name='devoluciones')
    fecha = models.DateTimeField()
    chofer = models.ForeignKey('api_usuarios.Usuario', on_delete=models.SET_NULL, null=True, blank=True)
    vehiculo = models.ForeignKey('api_vehiculos.Vehiculo', on_delete=models.SET_NULL, null=True, blank=True)
    estado = models.CharField(
        max_length=10,
        choices=EstadoDevolucion.choices,
        default=EstadoDevolucion.BUENO
    )
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Devoluvión'
        verbose_name_plural = 'Devoluciones'

    def __str__(self):
        return f"se hizo la devolución del alquiler {self.alquiler} en estado {self.estado}"

# Entrega
class Entrega(models.Model):
    class EstadoEntrega(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente'
        RUTA = 'RUTA', 'En ruta'
        COMPLETADA = 'COMPLETADA', 'Completada'
        DEVUELTA = 'DEVUELTA', 'Devuelta'
        CANCELADA = 'CANCELADA', 'Cancelada'

    chofer = models.ForeignKey('api_usuarios.Usuario', on_delete=models.CASCADE)
    alquiler = models.ForeignKey(Alquiler, on_delete=models.CASCADE)
    vehiculo = models.ForeignKey('api_vehiculos.Vehiculo', on_delete=models.CASCADE)
    fecha_salida = models.DateTimeField()
    fecha_retorno = models.DateTimeField()
    estado = models.CharField(
        max_length=15,
        choices=EstadoEntrega.choices,
        default=EstadoEntrega.PENDIENTE
    )

    class Meta:
        verbose_name = 'Entrega'
        verbose_name_plural = 'Entregas'

    def __str__(self):
        return f"Entrega para el alquiler {self.alquiler} realizada por {self.chofer}"

# Retiro por Cliente
class RetiroCliente(models.Model):
    alquiler = models.ForeignKey(Alquiler, on_delete=models.CASCADE, null=True, blank=True, related_name='retiros')
    venta = models.ForeignKey('api_ventas.Venta', on_delete=models.CASCADE, null=True, blank=True, related_name='retiros')
    cliente = models.ForeignKey('api_clientes.Cliente', on_delete=models.CASCADE)
    empleado = models.ForeignKey('api_usuarios.Usuario', on_delete=models.SET_NULL, null=True, blank=True)
    fecha_retiro = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Retiro de Cliente'
        verbose_name_plural = 'Retiros de Clientes'

    def __str__(self):
        tipo = "alquiler" if self.alquiler else "venta"
        return f"Retiro de cliente para {tipo} - {self.cliente}"
