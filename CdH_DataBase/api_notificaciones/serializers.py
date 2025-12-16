from .models import Notificacion
from rest_framework import serializers

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = [
            'id',
            'usuario',
            'mensaje',
            'fecha',
            'completada',
            'fecha_realizacion'
        ]