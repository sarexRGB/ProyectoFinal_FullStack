from .models import Vehiculo
from rest_framework import serializers

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        models = Vehiculo
        fields = [
            'id',
            'placa',
            'modelo',
            'estado'
        ]