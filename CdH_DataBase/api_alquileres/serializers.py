from .models import (
    Alquiler,
    DetalleAlquiler,
    Devolucion,
    Entrega,
    RetiroCliente
)
from api_inventario.models import Inventario
from rest_framework import serializers

# Alquiler
class AlquilerSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    
    class Meta:
        model = Alquiler
        fields = [
            'id',
            'cliente',
            'cliente_nombre',
            'fecha_inicio',
            'fecha_fin',
            'total',
            'estado',
            'contrato',
            'descuento_tipo',
            'descuento_valor'
        ]



    def update(self, instance, validated_data):
        new_status = validated_data.get('estado', instance.estado)
        old_status = instance.estado

        instance = super().update(instance, validated_data)

        if old_status != new_status:
            detalles = instance.detallealquiler_set.all()
            for detalle in detalles:
                inventario_items = Inventario.objects.filter(producto=detalle.producto)
                
                if inventario_items.exists():
                    if new_status == 'ACTIVO' and old_status == 'PENDIENTE':
                        inv = inventario_items.filter(stock_disponible__gte=detalle.cantidad).first()
                        if not inv:
                            inv = inventario_items.first()
                        
                        inv.stock_disponible -= detalle.cantidad
                        inv.stock_alquilado += detalle.cantidad
                        inv.save()

                    elif old_status == 'ACTIVO' and (new_status == 'FINALIZADO' or new_status == 'CANCELADO'):
                        inv = inventario_items.first()
                        inv.stock_alquilado -= detalle.cantidad
                        inv.stock_disponible += detalle.cantidad
                        inv.save()
        
        return instance

class DetalleAlquilerSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:

        model = DetalleAlquiler
        fields = [
            'id',
            'alquiler',
            'producto',
            'producto_nombre',
            'cantidad',
            'precio_diario',
            'descuento_tipo',
            'descuento_valor',
            'subtotal'
        ]
    
    def get_subtotal(self, obj):
        """Calcular subtotal como precio_diario * cantidad * días_alquilados"""
        alquiler = obj.alquiler
        if alquiler and alquiler.fecha_inicio and alquiler.fecha_fin:
            from datetime import datetime
            fecha_inicio = alquiler.fecha_inicio
            fecha_fin = alquiler.fecha_fin
            
            # Calculate days
            if isinstance(fecha_inicio, str):
                fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
            if isinstance(fecha_fin, str):
                fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
            
            dias = (fecha_fin - fecha_inicio).days + 1
            subtotal = float(obj.precio_diario * obj.cantidad * dias)
            
            # Apply per-product discount if exists
            if obj.descuento_tipo and obj.descuento_valor:
                if obj.descuento_tipo == 'PORCENTAJE':
                    subtotal = subtotal * (1 - float(obj.descuento_valor) / 100)
                elif obj.descuento_tipo == 'FIJO':
                    subtotal = subtotal - float(obj.descuento_valor)
            
            return max(0, subtotal)  # Ensure subtotal is never negative
        return 0

# Devolución del alquiler
class DevolucionSerializer(serializers.ModelSerializer):
    chofer_nombre = serializers.CharField(source='chofer.nombre', read_only=True)
    vehiculo_info = serializers.CharField(source='vehiculo.modelo', read_only=True)
    entrega_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Devolucion
        fields = [
            'id',
            'alquiler',
            'entrega',
            'entrega_info',
            'fecha',
            'chofer',
            'chofer_nombre',
            'vehiculo',
            'vehiculo_info',
            'estado',
            'observaciones'
        ]
    
    def get_entrega_info(self, obj):
        entrega = obj.entrega
        if entrega:
            return {
                'id': entrega.id,
                'fecha_salida': entrega.fecha_salida,
                'fecha_retorno': entrega.fecha_retorno,
                'estado': entrega.estado
            }
        return None

# Entregas
class EntregaSerializer(serializers.ModelSerializer):
    chofer_nombre = serializers.CharField(source='chofer.nombre', read_only=True)
    vehiculo_info = serializers.CharField(source='vehiculo.modelo', read_only=True)
    class Meta:
        model = Entrega
        fields = [
            'id',
            'chofer',
            'chofer_nombre',
            'alquiler',
            'vehiculo',
            'vehiculo_info',
            'fecha_salida',
            'fecha_retorno',
            'estado'
        ]
# Retiro Cliente Serializer
class RetiroClienteSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_apellido = serializers.CharField(source='cliente.apellido', read_only=True)
    empleado_nombre = serializers.CharField(source='empleado.nombre', read_only=True)
    empleado_apellido = serializers.CharField(source='empleado.apellido', read_only=True)
    
    class Meta:
        model = RetiroCliente
        fields = [
            'id',
            'alquiler',
            'venta',
            'cliente',
            'cliente_nombre',
            'cliente_apellido',
            'empleado',
            'empleado_nombre',
            'empleado_apellido',
            'fecha_retiro'
        ]

