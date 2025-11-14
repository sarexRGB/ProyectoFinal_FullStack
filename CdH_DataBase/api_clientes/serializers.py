from .models import Cliente
from rest_framework import serializers

class ClienteSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = [
            'id',
            'nombre',
            'apellido',
            'nombre_completo',
            'telefono',
            'correo'
        ]

    def get_nombre_completo(self, obj):
        return f"{obj.nombre} {obj.apellido}".strip()