from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.db.models.signals import post_save
from django.dispatch import receiver

# Usuarios
class Usuario(AbstractUser):
    telefono = models.CharField(max_length=15, blank=True, null=True)
    fecha_ingreso = models.DateField(blank=True, null=True)
    segundo_apellido = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return self.username

# Roles de empleados
class RolesEmpleado(models.Model):
    class Responsabilidad(models.IntegerChoices):
        BAJO = 1, 'Bajo'
        MEDIO = 2, 'Medio'
        ALTO = 3, 'Alto'

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='rol_detail')
    descripcion = models.TextField(blank=True, null=True)
    nivel_responsabilidad = models.IntegerField(choices=Responsabilidad.choices, default=Responsabilidad.BAJO)
    requiere_licencia = models.BooleanField(default=False)
    area_asignada = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.group.name} ({self.area_asignada or 'Sin área'})"

    class Meta:
        verbose_name = "Rol de Empleado"
        verbose_name_plural = "Roles de Empleados"

@receiver(post_save, sender=Group)
def crear_rol_empleado(sender, instance, created, **kwargs):
    if created:
        RolesEmpleado.objects.get_or_create(group=instance)


# Choferes
class ChoferDatos(models.Model):
    class Tipo_licencia(models.TextChoices):
        A1 = 'A1', 'Motocicleta hasta 125cc'
        A2 = 'A2', 'Motocicleta de 126cc hasta 500cc'
        B1 = 'B1', 'Vehículos liviano hasta 4000kg'
        B2 = 'B2', 'Vehículos carga mediana (4000-8000kg)'
        B3 = 'B3', 'Vehículos carga pesada (más de 8000kg)'
        D1 = 'D1', 'Maquinaria liviana'
        D2 = 'D2', 'Maquinaria mediana'
        D3 = 'D3', 'Maquinaria pesada'
    empleado = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    licencia_numero = models.CharField(max_length=20)
    licencia_tipo = models.CharField(max_length=3, choices=Tipo_licencia.choices, default=Tipo_licencia.A1)
    fecha_vencimiento = models.DateField()
    experiencia_anios = models.IntegerField()
    observaciones = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.empleado.username

    class Meta:
        verbose_name ="Datos de chofer"
        verbose_name_plural = "Datos de choferes"

# Mecánicos
class MecanicoDatos(models.Model):
    empleado = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100)
    certificaciones = models.TextField(blank=True, null=True)
    experiencia_anios = models.IntegerField()
    disponibilidad = models.BooleanField(default=True)
    observaciones = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.empleado.username

    class Meta:
        verbose_name = "Datos de mecanico"
        verbose_name_plural = "Datos de mecanicos"

# Despachadores
class DespachoDatos(models.Model):
    empleado = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    observaciones = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.empleado.username

    class Meta:
        verbose_name = "Datos de despachador"
        verbose_name_plural = "Datos de despachadores"

# Asistencias
class Asistencia(models.Model):
    class Estado(models.TextChoices):
        PRESENTE = 'Presente', 'El empleado asistió normalmente a su jornada laboral.'
        TARDE = 'Tarde', 'El empleado asistió pero llegó tarde.'
        AUSENTE = 'Ausente', 'El empleado no asistió y no presentó justificación válida.'
        JUSTIFICADO = 'Justificado', 'El empleado no asistió, pero presentó una justificación(cita médica, incapacidad, permiso especial).'
        VACACIONES = 'Vacaciones', 'El empleado se encuentra en periodo de vacaciones autorizado'
        PERMISO = 'Permiso', 'El empleado no asistió debido a un permiso aprobado(asuntos personales o familiares).'

    empleado = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora_entrada = models.TimeField(blank=True, null=True)
    hora_salida = models.TimeField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PRESENTE)

    def __str__(self):
        return f'{self.empleado.username} estuvo {self.estado} el dia {self.fecha}.'

    class Meta:
        verbose_name = "Asistencia registrada"
        verbose_name_plural = "Asistencias registradas"