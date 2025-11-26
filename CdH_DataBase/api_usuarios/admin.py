from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, RolesEmpleado, ChoferDatos, MecanicoDatos, DespachoDatos, Asistencia
from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin

# Inlines
class RolesEmpleadoInline(admin.StackedInline):
    model = RolesEmpleado
    can_delete = False
    extra = 0

class ChoferDatosInline(admin.StackedInline):
    model = ChoferDatos
    extra = 0
    can_delete = True

class MecanicoDatosInline(admin.StackedInline):
    model = MecanicoDatos
    extra = 0
    can_delete = True

class DespachoDatosInline(admin.StackedInline):
    model = DespachoDatos
    extra = 0
    can_delete = True

class AsistenciaInline(admin.TabularInline):
    model = Asistencia
    extra = 1
    can_delete = True

# Admin personalizado del usuario
@admin.register(Usuario)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'fecha_ingreso',)
    search_fields = ('username', 'email', 'first_name', 'last_name',)

    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('telefono', 'fecha_ingreso',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {'fields': ('telefono', 'fecha_ingreso',)}),
    )

    def get_inlines(self, request, obj=None):
        if not obj:
            return []

        inlines = [AsistenciaInline]

        grupos = list(obj.groups.values_list('name', flat=True))

        if 'Chofer' in grupos:
            inlines.append(ChoferDatosInline)
        if 'Mecánico' in grupos:
            inlines.append(MecanicoDatosInline)
        if 'Despacho' in grupos:
            inlines.append(DespachoDatosInline)

        return inlines


# Admin personalizado de Group
class CustomGroupAdmin(admin.ModelAdmin):
    inlines = [RolesEmpleadoInline]
    list_display = ('name', 'get_area', 'get_nivel', 'get_licencia',)

    def get_area(self, obj):
        detalle = getattr(obj, 'rolesempleado', None)
        return detalle.area_asignada if detalle else '—'
    get_area.short_description = 'Área asignada'

    def get_nivel(self, obj):
        detalle = getattr(obj, 'rolesempleado', None)
        return detalle.get_nivel_responsabilidad_display() if detalle else '—'
    get_nivel.short_description = 'Nivel de responsabilidad'

    def get_licencia(self, obj):
        detalle = getattr(obj, 'rolesempleado', None)
        return 'Sí' if detalle and detalle.requiere_licencia else 'No'
    get_licencia.short_description = 'Requiere licencia'



# Registros restantes
@admin.register(ChoferDatos)
class ChoferDatosAdmin(admin.ModelAdmin):
    list_display = ('empleado_nombre', 'licencia_numero', 'licencia_tipo', 'activo')
    list_filter = ('activo', 'licencia_tipo')
    search_fields = ('empleado__first_name', 'empleado__last_name', 'licencia_numero')
    def empleado_nombre(self, obj):
        return obj.empleado.get_full_name()
    empleado_nombre.short_description = 'Nombre del empleado'

@admin.register(MecanicoDatos)
class MecanicoDatosAdmin(admin.ModelAdmin):
    list_display = ('empleado_nombre', 'especialidad', 'experiencia_anios', 'disponibilidad', 'activo')
    list_filter = ('disponibilidad', 'activo')
    search_fields = ('empleado__first_name', 'empleado__last_name', 'especialidad')

    def empleado_nombre(self, obj):
        return obj.empleado.get_full_name()
    empleado_nombre.short_description = 'empleado'

@admin.register(DespachoDatos)
class DespachoDatosAdmin(admin.ModelAdmin):
    list_display = ('empleado_nombre', 'activo')
    list_filter = ('activo',)
    search_fields = ('empleado__first_name', 'empleado__last_name')

    def empleado_nombre(self, obj):
        return obj.empleado.get_full_name()
    empleado_nombre.short_description = 'Empleado'

@admin.register(Asistencia)
class AsistenciaAdmin(admin.ModelAdmin):
    list_display = ('empleado_nombre', 'fecha', 'estado', 'hora_entrada', 'hora_salida')
    list_filter = ('estado', 'fecha')
    search_fields = ('empleado__first_name', 'empleado__last_name')

    def empleado_nombre(self, obj):
        return obj.empleado.get_full_name()
    empleado_nombre.short_description = 'Empleado'

# Registro del grupo personalizado
admin.site.unregister(Group)
admin.site.register(Group, CustomGroupAdmin)