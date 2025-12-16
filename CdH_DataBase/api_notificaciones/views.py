from .models import Notificacion
from .serializers import NotificacionSerializer
from rest_framework import generics

class NotificacionListCreateView(generics.ListCreateAPIView):
    serializer_class = NotificacionSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Notificacion.objects.filter(usuario=self.request.user)
        return Notificacion.objects.none()

class NotificacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer