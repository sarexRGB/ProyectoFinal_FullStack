from django.core.management.base import BaseCommand
from django.utils import timezone
from api_alquileres.models import Alquiler, Entrega
from api_notificaciones.models import Notificacion

class Command(BaseCommand):
    help = 'Verifica alquileres que vencen hoy y notifica a los choferes para el retiro'

    def handle(self, *args, **options):
        hoy = timezone.now().date()
        self.stdout.write(f'Verificando devoluciones para: {hoy}')

        # Buscar alquileres activos que vencen hoy o antes
        alquileres_vencidos = Alquiler.objects.filter(
            estado='ACTIVO',
            fecha_fin__lte=hoy
        )

        count = 0
        for alquiler in alquileres_vencidos:
            # Buscar la entrega asociada para obtener el chofer
            # Asumimos que la entrega activa es la última asociada
            entrega = Entrega.objects.filter(alquiler=alquiler).last()
            
            if not entrega or not entrega.chofer:
                self.stdout.write(self.style.WARNING(f'Alquiler {alquiler.id} no tiene entrega/chofer asignado'))
                continue

            chofer = entrega.chofer
            mensaje = f"RECORDATORIO: Retirar equipo del alquiler #{alquiler.id} - Cliente: {alquiler.cliente}. Vence: {alquiler.fecha_fin}"

            # Verificar si ya existe notificación para hoy para evitar spam
            existe = Notificacion.objects.filter(
                usuario=chofer,
                mensaje__startswith=f"RECORDATORIO: Retirar equipo del alquiler #{alquiler.id}",
                fecha__date=hoy
            ).exists()

            if not existe:
                Notificacion.objects.create(
                    usuario=chofer,
                    mensaje=mensaje,
                    # No asignamos entrega específica aquí para no confundir con "entrega de ida", 
                    # pero podríamos asignar 'entrega' si el modelo lo permite para linkear.
                    # Dejaremos entrega null o podríamos apuntar a la misma entrega para referencia.
                    entrega=entrega 
                )
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Notificación enviada a {chofer} para alquiler {alquiler.id}'))
            else:
                self.stdout.write(f'Ya existe notificación para alquiler {alquiler.id}')

        self.stdout.write(self.style.SUCCESS(f'Proceso completado. {count} notificaciones creadas.'))
