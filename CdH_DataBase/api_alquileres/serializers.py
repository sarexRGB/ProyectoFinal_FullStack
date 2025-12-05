from .models import (
    Alquiler,
    DetalleAlquiler,
    Devolucion,
    Entrega
)
from rest_framework import serializers

# Alquiler
class AlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alquiler
        fields = [
            'id',
            'cliente',
            'fecha_inicio',
            'fecha_fin',
            'total',
            'estado',
            'contrato'
        ]

# Detalle del alquiler
class DetalleAlquilerSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    class Meta:

        model = DetalleAlquiler
        fields = [
            'id',
            'alquiler',
            'producto',
            'producto_nombre',
            'cantidad',
            'precio_diario'
        ]

# Devolución del alquiler
class DevolucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devolucion
        fields = [
            'id',
            'alquiler',
            'fecha',
            'estado',
            'observaciones'
        ]

# Entregas
class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = [
            'id',
            'chofer',
            'alquiler',
            'vehiculo',
            'fecha_salida',
            'fecha_retorno',
            'estado'
        ]