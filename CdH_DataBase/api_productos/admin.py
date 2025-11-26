from django.contrib import admin
from .models import (
    Categoria,
    Modalidad,
    Producto,
    ProductoModalidad,
)

admin.site.register(Categoria)
admin.site.register(Modalidad)
admin.site.register(Producto)
admin.site.register(ProductoModalidad)

# Register your models here.
