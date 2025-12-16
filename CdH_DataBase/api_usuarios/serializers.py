from .models import (
    Usuario,
    RolesEmpleado,
    ChoferDatos,
    MecanicoDatos,
    DespachoDatos,
    Asistencia,
)
from django.contrib.auth.models import Group
from rest_framework import serializers

# ------------------- Roles de empleado -------------------
class RolesEmpleadoSerializer(serializers.ModelSerializer):
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
class ChoferDatosSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)
    email = serializers.EmailField(source='empleado.email', read_only=True)
    telefono = serializers.CharField(source='empleado.telefono', read_only=True)

    class Meta:
        model = ChoferDatos
        fields = [
            'id',
            'empleado',
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
class MecanicoDatosSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)
    email = serializers.EmailField(source='empleado.email', read_only=True)
    telefono = serializers.CharField(source='empleado.telefono', read_only=True)

    class Meta:
        model = MecanicoDatos
        fields = [
            'id',
            'empleado',
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
class DespachoDatosSerializer(serializers.ModelSerializer):
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
class AsistenciaSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.get_full_name', read_only=True)
    email = serializers.EmailField(source='empleado.email', read_only=True)

    class Meta:
        model = Asistencia
        fields = [
            'id',
            'empleado',
            'empleado_nombre',
            'email',
            'fecha',
            'hora_entrada',
            'hora_salida',
            'estado',
        ]

# ------------------- Usuarios -------------------
class UsuarioSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)
    role_data = serializers.DictField(write_only=True, required=False)
    role_data_response = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id',
            'first_name',
            'last_name',
            'segundo_apellido',
            'nombre_completo',
            'email',
            'telefono',
            'username',
            'is_active',
            'is_staff',
            'date_joined',
            'fecha_ingreso',
            'roles',
            'groups',
            'role_data',
            'role_data_response',
        ]

    def get_roles(self, obj):
        return [group.name for group in obj.groups.all()]

    def get_nombre_completo(self, obj):
        return f"{obj.first_name} {obj.last_name} {obj.segundo_apellido}".strip()

    def get_role_data_response(self, obj):
        data = {}
        for group in obj.groups.all():
            if 'Chofer' in group.name:
                try:
                    chofer_data = ChoferDatos.objects.get(empleado=obj)
                    data[group.id] = ChoferDatosSerializer(chofer_data).data
                except ChoferDatos.DoesNotExist:
                    pass
            elif 'Mecánico' in group.name:
                try:
                    mecanico_data = MecanicoDatos.objects.get(empleado=obj)
                    data[group.id] = MecanicoDatosSerializer(mecanico_data).data
                except MecanicoDatos.DoesNotExist:
                    pass
            elif 'Despacho' in group.name:
                try:
                    despacho_data = DespachoDatos.objects.get(empleado=obj)
                    data[group.id] = DespachoDatosSerializer(despacho_data).data
                except DespachoDatos.DoesNotExist:
                    pass
        return data
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['role_data'] = ret.pop('role_data_response', {})
        ret['groups'] = [{'id': g.id, 'name': g.name} for g in instance.groups.all()]
        return ret

    def update(self, instance, validated_data):
        groups = validated_data.pop('groups', None)
        role_data = validated_data.pop('role_data', {})
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if groups is not None:
             instance.groups.set(groups)
             
             for group in groups:
                 group_data = role_data.get(str(group.id), {})
                 
                 if 'Chofer' in group.name:
                     ChoferDatos.objects.update_or_create(
                         empleado=instance,
                         defaults={
                             'licencia_numero': group_data.get('licencia_numero', ''),
                             'licencia_tipo': group_data.get('licencia_tipo', 'A1'),
                             'fecha_vencimiento': group_data.get('fecha_vencimiento', '2030-01-01'),
                             'experiencia_anios': group_data.get('experiencia_anios', 0),
                             'observaciones': group_data.get('observaciones', '')
                         }
                     )
                 elif 'Mecánico' in group.name:
                     MecanicoDatos.objects.update_or_create(
                         empleado=instance,
                         defaults={
                             'especialidad': group_data.get('especialidad', ''),
                             'certificaciones': group_data.get('certificaciones', ''),
                             'experiencia_anios': group_data.get('experiencia_anios', 0),
                             'observaciones': group_data.get('observaciones', '')
                         }
                     )
                 elif 'Despacho' in group.name:
                     DespachoDatos.objects.update_or_create(
                         empleado=instance,
                         defaults={
                             'observaciones': group_data.get('observaciones', '')
                         }
                     )
                     
        return instance