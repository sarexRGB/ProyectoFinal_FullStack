from django.db.models.signals import post_save
from django.dispatch import receiver
from api_alquileres.models import Entrega, RetiroCliente, Alquiler
from api_mantenimiento.models import MantenimientoProducto
from .models import Notificacion

@receiver(post_save, sender=Entrega)
def crear_notificacion_entrega(sender, instance, created, **kwargs):
    if created:
        Notificacion.objects.create(
            usuario=instance.chofer,
            mensaje=f"Nueva entrega asignada: {instance}",
            entrega=instance
        )

@receiver(post_save, sender=MantenimientoProducto)
def crear_notificacion_mantenimiento(sender, instance, created, **kwargs):
    if created:
        Notificacion.objects.create(
            usuario=instance.mecanico,
            mensaje=f"Nuevo mantenimiento asignado: {instance}",
            mantenimiento_producto=instance
        )

@receiver(post_save, sender=RetiroCliente)
def crear_notificacion_retiro(sender, instance, created, **kwargs):
    if created and instance.empleado:
        Notificacion.objects.create(
            usuario=instance.empleado,
            mensaje=f"Nuevo retiro de cliente asignado: {instance}",
            retiro_cliente=instance
        )

@receiver(post_save, sender=Notificacion)
def completar_tarea_entrega(sender, instance, created, **kwargs):
    """
    Sincronizar finalización de tarea con el estado de la entrega.
    Si la tarea se marca como completada, la entrega pasa a COMPLETADA.
    """
    if instance.completada and instance.entrega:
        if instance.entrega.estado != 'COMPLETADA':
            instance.entrega.estado = 'COMPLETADA'
            from django.utils import timezone
            instance.entrega.fecha_salida = timezone.now() 
            instance.entrega.save()

        alquiler = instance.entrega.alquiler
        
        if alquiler and str(alquiler.estado).upper() == 'PENDIENTE':
            alquiler.estado = 'ACTIVO'
            alquiler.save()


