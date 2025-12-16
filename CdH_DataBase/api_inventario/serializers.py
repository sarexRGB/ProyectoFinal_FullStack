from .models import (
    Bodega,
    Pieza,
    Proveedor,
    Inventario,
    InventarioPieza,
    MovimientoInventario
)
from rest_framework import serializers

# Bodegas
class BodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bodega
        fields = ['id', 'nombre']


# Piezas de repuesto
class PiezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pieza
        fields = ['id', 'nombre', 'descripcion']


# Proveedor
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'telefono', 'email']


# Inventario
class InventarioSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    class Meta:
        model = Inventario
        fields = [
            'id',
            'producto',
            'bodega',
            'producto_nombre',
            'bodega_nombre',
            'stock_disponible',
            'stock_alquilado',
            'minimo_stock',
            'activo',
            'fecha_actualizacion'
        ]

# Inventario de piezas de repuesto
class InventarioPiezaSerializer(serializers.ModelSerializer):
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    pieza_nombre = serializers.CharField(source='pieza.nombre', read_only=True)
    class Meta:
        model = InventarioPieza
        fields = [
            'id',
            'pieza',
            'pieza_nombre',
            'origen',
            'proveedor',
            'bodega',
            'bodega_nombre',
            'ubicacion',
            'stock',
            'fecha_actualizacion',
            'minimo_stock',
            'activo'
        ]


# Movimientos de los inventarios
class MovimientoInventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoInventario
        fields = [
            'id',
            'producto',
            'tipo',
            'cantidad',
            'fecha',
            'despachador'
        ]