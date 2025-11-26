from .models import OrdenCompra, DetalleCompra
from rest_framework import serializers

class OrdenCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenCompra
        fields = [
            'id',
            'proveedor',
            'fecha',
            'total',
            'estado'
        ]

class DetalleCompraSerializer(serializers.ModelSerializer):
    class Meta:
        models = DetalleCompra
        fields = [
            'id',
            'orden_compra',
            'producto',
            'pieza',
            'cantidad',
            'precio_unitario',
            'subtotal'
        ]