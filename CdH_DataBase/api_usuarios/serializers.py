from .models import (
    Usuario,
    RolesEmpleado,
    ChoferDatos,
    MecanicoDatos,
    DespachoDatos,
    Asistencia,
)
from rest_framework import serializers

# ------------------- Roles de empleado -------------------
class RolesEmpleadoListSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = RolesEmpleado
        fields = [
            'id',
            'group_name',
            'area_asignada',
        ]

class RolesEmpleadoDetailSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = RolesEmpleado
        fields = [
            'id',
            'group_name',
            'descripcion',
            'requiere_licencia',
            'area_asignada',
        ]

# ------------------- Choferes -------------------
class ChoferDatosListSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)

    class Meta:
        model = ChoferDatos
        fields = [
            'id',
            'empleado_nombre',
            'licencia_tipo',
            'activo',
        ]

class ChoferDatosDetailSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)
    email = serializers.EmailField(source='empleado.email', read_only=True)
    telefono = serializers.CharField(source='empleado.telefono', read_only=True)

    class Meta:
        model = ChoferDatos
        fields = [
            'id',
            'empleado_nombre',
            'email',
            'telefono',
            'licencia_numero',
            'licencia_tipo',
            'fecha_vencimiento',
            'experiencia_anios',
            'observaciones',
            'fecha_registro',
            'activo',
        ]

# ------------------- Mecánicos -------------------
class MecanicoDatosListSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)

    class Meta:
        model = MecanicoDatos
        fields = [
            'id',
            'empleado_nombre',
            'especialidad',
            'experiencia_anios',
            'activo',
        ]

class MecanicoDatosDetailSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)
    email = serializers.EmailField(source='empleado.email', read_only=True)
    telefono = serializers.CharField(source='empleado.telefono', read_only=True)

    class Meta:
        model = MecanicoDatos
        fields = [
            'id',
            'empleado_nombre',
            'email',
            'telefono',
            'especialidad',
            'certificaciones',
            'experiencia_anios',
            'disponibilidad',
            'observaciones',
            'fecha_registro',
            'activo',
        ]

# ------------------- Despachadores -------------------
class DespachoDatosListSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)

    class Meta:
        model = DespachoDatos
        fields = [
            'id',
            'empleado_nombre',
            'activo',
        ]

class DespachoDatosDetailSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)
    email = serializers.EmailField(source='empleado.email', read_only=True)
    telefono = serializers.CharField(source='empleado.telefono', read_only=True)

    class Meta:
        model = DespachoDatos
        fields = [
            'id',
            'empleado_nombre',
            'email',
            'telefono',
            'observaciones',
            'fecha_registro',
            'activo',
        ]

# ------------------- Asistencias -------------------
class AsistenciaListSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)

    class Meta:
        model = Asistencia
        fields = [
            'id',
            'empleado_nombre',
            'estado',
            'fecha',
        ]

class AsistenciaDetailSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)
    email = serializers.EmailField(source='empleado.email', read_only=True)

    class Meta:
        model = Asistencia
        fields = [
            'id',
            'empleado_nombre',
            'email',
            'fecha',
            'hora_entrada',
            'hora_salida',
            'estado',
        ]

# ------------------- Usuarios -------------------
class UsuarioListSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id',
            'first_name',
            'last_name',
            'nombre_completo',
            'email',
            'telefono',
            'roles',
        ]

    def get_nombre_completo(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_roles(self, obj):
        return [group.name for group in obj.groups.all()]

class UsuarioDetailSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
    role_data = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id',
            'first_name',
            'last_name',
            'nombre_completo',
            'email',
            'telefono',
            'username',
            'is_active',
            'is_staff',
            'date_joined',
            'roles',
            'groups',
            'role_data',
        ]

    def get_roles(self, obj):
        return [group.name for group in obj.groups.all()]

    def get_nombre_completo(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_groups(self, obj):
        return [{'id': g.id, 'name': g.name} for g in obj.groups.all()]

    def get_role_data(self, obj):
        data = {}
        for group in obj.groups.all():
            if 'Chofer' in group.name:
                try:
                    chofer_data = ChoferDatos.objects.get(empleado=obj)
                    data[group.id] = ChoferDatosDetailSerializer(chofer_data).data
                except ChoferDatos.DoesNotExist:
                    pass
            elif 'Mecánico' in group.name:
                try:
                    mecanico_data = MecanicoDatos.objects.get(empleado=obj)
                    data[group.id] = MecanicoDatosDetailSerializer(mecanico_data).data
                except MecanicoDatos.DoesNotExist:
                    pass
            elif 'Despacho' in group.name:
                try:
                    despacho_data = DespachoDatos.objects.get(empleado=obj)
                    data[group.id] = DespachoDatosDetailSerializer(despacho_data).data
                except DespachoDatos.DoesNotExist:
                    pass
        return data