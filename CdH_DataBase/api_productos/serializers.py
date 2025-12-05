from .models import (
    Categoria,
    Modalidad,
    Producto,
    ProductoModalidad
)
from rest_framework import serializers

# Categorias
class CategoriaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id','nombre']

class CategoriaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id','nombre', 'descripcion']


# Modalidades
class ModalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modalidad
        fields = ['id','nombre']


# Productos
class ProductoSerializer(serializers.ModelSerializer):
    categoria_name = serializers.CharField(source= 'categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'descripcion',
            'precio_venta',
            'precio_alquiler',
            'categoria',
            'categoria_name',
            'estado',
            'imagen'
        ]


# Modalidad del Producto
class ProductoModalidadSerializer(serializers.ModelSerializer):
    producto_name = serializers.CharField(source= 'producto.nombre', read_only=True)
    modalidad_name = serializers.CharField(source= 'modalidad.nombre', read_only=True)

    class Meta:
        model = ProductoModalidad
        fields = [
            'id',
            'producto',
            'producto_name',
            'modalidad',
            'modalidad_name'
        ]