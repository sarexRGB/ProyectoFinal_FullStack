from .models import Pago
from rest_framework import serializers

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = [
            'id',
            'tipo_compra',
            'metodo_pago',
            'monto',
            'fecha_pago',
            'venta',
            'alquiler',
            'orden_compra'
        ]
