from .models import Venta, DetalleVenta
from rest_framework import serializers

# Venta
class VentaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    class Meta:
        model = Venta
        fields = [
            'id',
            'cliente',
            'cliente_nombre',
            'fecha',
            'total',
            'descuento_tipo',
            'descuento_valor'
        ]


# Detalles de venta
class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    class Meta:
        model = DetalleVenta
        fields = [
            'id',
            'venta',
            'producto',
            'producto_nombre',
            'cantidad',
            'precio_unitario',
            'descuento_tipo',
            'descuento_valor'
        ]