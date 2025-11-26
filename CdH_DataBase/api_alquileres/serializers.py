from .models import (
    Alquiler,
    DetalleAlquiler,
    Devolucion,
    Entrega
)
from rest_framework import serializers

# Alquiler
class AlquilerListSerializer(serializers.ModelSerializer):
    class Meta:
        models = Alquiler
        fields = [
            'id',
            'cliente',
            'total',
            'estado'
        ]

class AlquilerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        models = Alquiler
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
    class Meta:
        models = DetalleAlquiler
        fields = [
            'id',
            'alquiler',
            'producto',
            'cantidad',
            'precio_diario'
        ]

# Devolución del alquiler
class DevolucionListSerializer(serializers.ModelSerializer):
    class Meta:
        models = Devolucion
        fields = [
            'id',
            'alquiler',
            'fecha'
        ]

class DevolucionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        models = Devolucion
        fields = [
            'id',
            'alquiler',
            'fecha',
            'estado',
            'observaciones'
        ]

# Entregas
class EntregaListSerializer(serializers.ModelSerializer):
    class Meta:
        models = Entrega
        fields = [
            'id',
            'chofer',
            'alquiler',
            'estado'
        ]

class EntregaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        models = Entrega
        fields = [
            'id',
            'chofer',
            'alquiler',
            'vehiculo',
            'fecha_salida',
            'fecha_retorno',
            'estado'
        ]