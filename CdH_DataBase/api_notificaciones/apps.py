from django.apps import AppConfig


class ApiNotificacionesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_notificaciones'

    def ready(self):
        import api_notificaciones.signals
