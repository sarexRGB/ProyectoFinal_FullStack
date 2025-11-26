from django.db import models

class Bodega(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Bodega'
        verbose_name_plural = 'Bodegas'

    def __str__(self):
        return self.nombre

class Pieza(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Pieza'
        verbose_name_plural = 'Piezas'

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    nombre = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    email = models.EmailField(unique=True, blank=True, null=True)

    class Meta:
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'

    def __str__(self):
        return self.nombre

class Inventario(models.Model):
    producto = models.ForeignKey('api_productos.Producto', on_delete=models.CASCADE, related_name='Inventario')
    bodega = models.ForeignKey(Bodega, on_delete=models.CASCADE)
    ubicacion = models.CharField(max_length=100)
    stock = models.IntegerField()
    minimo_stock = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    fecha_actualizacion = models.DateTimeField()

    class Meta:
        verbose_name = 'Inventario'
        verbose_name_plural = 'Inventarios'

    def __str__(self):
        return f"{self.producto} se encuentra en {self.bodega.nombre}"

class InventarioPieza(models.Model):
    class Origen(models.TextChoices):
        PROVEEDOR = "PROVEEDOR", "Proveedor"
        RECUPERADO = "RECUPERADO", "Recuperado"
        OTRO = "OTRO", "Otro"

    pieza = models.ForeignKey(Pieza, on_delete=models.CASCADE)
    origen = models.CharField(
        max_length=15,
        choices=Origen.choices,
        default=Origen.PROVEEDOR
    )
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, null=True)
    bodega = models.ForeignKey(Bodega, on_delete=models.CASCADE)
    ubicacion = models.CharField(max_length=100)
    stock = models.IntegerField()
    fecha_actualizacion = models.DateTimeField()
    minimo_stock = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Inventario de pieza'
        verbose_name_plural = 'Inventario de piezas'

    def __str__(self):
        return f"{self.pieza.nombre} se encuentra en {self.bodega.nombre}"

class MovimientoInventario(models.Model):
    class TipoMovimiento(models.TextChoices):
        ENTRADA = "ENTRADA", "Entrada"
        SALIDA = "SALIDA", "Salida"
        AJUSTE = "AJUSTE", "Ajuste"

    producto = models.ForeignKey('api_productos.Producto', on_delete=models.CASCADE, related_name='MovimientoInventario')
    tipo = models.CharField(
        max_length=10,
        choices=TipoMovimiento,
        default=TipoMovimiento.ENTRADA
    )
    cantidad = models.IntegerField()
    fecha = models.DateTimeField()
    despachador = models.ForeignKey('api_usuarios.usuario', on_delete=models.CASCADE, related_name='MovimientoInventario')

