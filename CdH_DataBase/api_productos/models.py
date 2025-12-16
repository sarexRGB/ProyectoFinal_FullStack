from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.nombre

class Modalidad(models.Model):
    nombre = models.CharField(max_length=15)

    class Meta:
        verbose_name = 'Modalidad de producto'
        verbose_name_plural = 'Modalidades de productos'

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    class EstadoProducto(models.TextChoices):
        DISPONIBLE = 'DISPONIBLE', 'Disponible'
        ALQUILADO = 'ALQUILADO', 'En alquiler'
        REPARACION = 'REPARACIÓN', 'En reparación'
        INACTIVO = 'INACTIVO', 'Inactivo'

    nombre = models.CharField(max_length=150)
    codigo = models.CharField(max_length=50, unique=True, null=True, blank=True)
    descripcion = models.TextField()
    precio_venta = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    precio_alquiler = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    estado = models.CharField(
        max_length=15,
        choices=EstadoProducto.choices,
        default=EstadoProducto.DISPONIBLE
    )
    imagen = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.upper()
        super(Producto, self).save(*args, **kwargs)

class ProductoModalidad(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    modalidad = models.ForeignKey(Modalidad, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('producto', 'modalidad')
        verbose_name = 'Producto por Modalidad'
        verbose_name_plural = 'Productos por Modalidad'

    def __str__(self):
        return f"{self.producto} - {self.modalidad}"