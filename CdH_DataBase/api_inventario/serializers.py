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


# Piezas de repuestofrom
class PiezaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pieza
        fields = ['id', 'nombre']

class PiezaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pieza
        fields = ['id', 'nombre', 'descripcion']


# Proveedor
class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'telefono', 'email']


# Inventario
class InventarioListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = [
            'id',
            'producto',
            'bodega',
            'stock',
            'fecha_actualizacion'
        ]

class InventarioDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = [
            'id',
            'producto',
            'bodega',
            'ubicacion',
            'stock',
            'minimo_stock',
            'activo',
            'fecha_actualizacion'
        ]


# Inventario de piezas de repuesto
class InventarioPiezaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventarioPieza
        fields = [
            'id',
            'pieza',
            'bodega',
            'stock',
            'fecha_actualizacion'
        ]

class InventarioPiezaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventarioPieza
        fields = [
            'id',
            'pieza',
            'origen',
            'proveedor',
            'bodega',
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