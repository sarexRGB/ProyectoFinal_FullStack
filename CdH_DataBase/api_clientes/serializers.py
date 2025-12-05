from .models import Cliente
from rest_framework import serializers

class ClienteSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = [
            'id',
            'nombre',
            'primer_apellido',
            'segundo_apellido',
            'nombre_completo',
            'telefono',
            'email'
        ]

    def get_nombre_completo(self, obj):
        return f"{obj.nombre} {obj.primer_apellido} {obj.segundo_apellido or ''}".strip()