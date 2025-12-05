from .models import (
    TipoMantenimiento,
    MantenimientoProducto,
    MantenimientoVehiculo,
    MantenimientoPieza
)
from rest_framework import serializers


# Tipo de mantenimiento
class TipoMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMantenimiento
        fields = [
            'id',
            'nombre',
            'descripcion'
        ]


# Mantenimiento del producto
class MantenimientoProductoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoProducto
        fields = [
            'id',
            'producto',
            'fecha',
            'costo'
        ]

class MantenimientoProductoDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoProducto
        fields = [
            'id',
            'producto',
            'tipo',
            'mecanico',
            'fecha',
            'costo',
            'descripcion'
        ]


# Mantenimiento del vehículo
class MantenimientoVehiculoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoVehiculo
        fields = [
            'id',
            'vehiculo',
            'fecha',
            'costo'
        ]

class MantenimientoVehiculoDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoVehiculo
        fields = [
            'id',
            'vehiculo',
            'tipo',
            'fecha',
            'costo',
            'descripcion'
        ]


# Repuestos usados en reparación
class MantenimientoPiezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoPieza
        fields = [
            'id',
            'mantenimiento_producto',
            'mantenimiento_vehiculo',
            'pieza',
            'cantidad'
        ]