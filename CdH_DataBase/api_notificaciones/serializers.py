from .models import Notificacion
from rest_framework import serializers

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        models = Notificacion
        fields = [
            'id',
            'usuario',
            'mensaje',
            'fecha'
        ]