from .models import Venta, DetalleVenta
from rest_framework import serializers

# Venta
class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        models = Venta
        fields = [
            'id',
            'cliente',
            'fecha',
            'total'
        ]


# Detalles de venta
class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        models = DetalleVenta
        fields = [
            'id',
            'venta',
            'producto',
            'cantidad',
            'precio_unitario'
        ]