from .models import Venta, DetalleVenta
from rest_framework import serializers

# Venta
class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = [
            'id',
            'cliente',
            'fecha',
            'total'
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
            'precio_unitario'
        ]