import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
    createMantenimientoProducto,
    createMantenimientoVehiculo,
    getTiposMantenimiento
} from '@/services/MantenimientoServices'
import { getProductos } from '@/services/ProductosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { getMecanicos } from '@/services/UsuariosServices'

function AddMantenimientoModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [tipoItem, setTipoItem] = useState('vehiculo')

    const [vehiculos, setVehiculos] = useState([])
    const [productos, setProductos] = useState([])
    const [mecanicos, setMecanicos] = useState([])
    const [tiposMantenimiento, setTiposMantenimiento] = useState([])

    const [formData, setFormData] = useState({
        item_id: '',
        tipo_mantenimiento: '',
        mecanico: '',
        fecha: new Date().toISOString().split('T')[0],
        costo: '',
        descripcion: ''
    })

    useEffect(() => {
        if (isOpen) {
            fetchDependencyData()
            // Reset form on open
            setFormData({
                item_id: '',
                tipo_mantenimiento: '',
                mecanico: '',
                fecha: new Date().toISOString().split('T')[0],
                costo: '',
                descripcion: ''
            })
        }
    }, [isOpen])

    const fetchDependencyData = async () => {
        setLoading(true)
        try {
            const [vehRes, prodRes, mecRes, tiposRes] = await Promise.all([
                getVehiculos(),
                getProductos(),
                getMecanicos(),
                getTiposMantenimiento()
            ])
            setVehiculos(vehRes.data)
            setProductos(prodRes.data)
            setMecanicos(mecRes.data)
            setTiposMantenimiento(tiposRes.data)
        } catch (error) {
            console.error("Error loading dependencies", error)
            toast.error("Error al cargar datos necesarios")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const payload = {
                tipo: formData.tipo_mantenimiento,
                fecha: formData.fecha,
                costo: formData.costo,
                descripcion: formData.descripcion
            }

            if (tipoItem === 'vehiculo') {
                payload.vehiculo = formData.item_id

                await createMantenimientoVehiculo(payload)
            } else {
                payload.producto = formData.item_id
                payload.mecanico = formData.mecanico
                await createMantenimientoProducto(payload)
            }

            toast.success("Mantenimiento registrado correctamente")
            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error registering maintenance", error)
            toast.error("Error al registrar el mantenimiento. Verifique los datos.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Registrar Mantenimiento</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para registrar un nuevo mantenimiento.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo de Item</Label>
                                <Select value={tipoItem} onValueChange={(val) => {
                                    setTipoItem(val)
                                    setFormData(prev => ({ ...prev, item_id: '' }))
                                }}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vehiculo">Vehículo</SelectItem>
                                        <SelectItem value="producto">Producto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>{tipoItem === 'vehiculo' ? 'Vehículo' : 'Producto'}</Label>
                                <Select
                                    value={formData.item_id}
                                    onValueChange={(val) => handleChange('item_id', val)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Seleccione ${tipoItem}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tipoItem === 'vehiculo' ? (
                                            vehiculos.map(v => (
                                                <SelectItem key={v.id} value={String(v.id)}>
                                                    {v.marca} {v.modelo} ({v.placa})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            productos.filter(p => p.estado !== 'INACTIVO').map(p => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.nombre} ({p.codigo || 'S/C'})
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo Mantenimiento</Label>
                                <Select
                                    value={formData.tipo_mantenimiento}
                                    onValueChange={(val) => handleChange('tipo_mantenimiento', val)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tiposMantenimiento.map(t => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                                {t.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Fecha</Label>
                                <Input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => handleChange('fecha', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mecanico field is required only for Products based on the model inspection */}
                        {tipoItem === 'producto' && (
                            <div className="space-y-2">
                                <Label>Mecánico Encargado</Label>
                                <Select
                                    value={formData.mecanico}
                                    onValueChange={(val) => handleChange('mecanico', val)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione mecánico" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mecanicos.map(m => (
                                            <SelectItem key={m.empleado} value={String(m.empleado)}>
                                                {m.empleado_nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Costo Aproximado (₡)</Label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.costo}
                                onChange={(e) => handleChange('costo', e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Descripción / Observaciones</Label>
                            <Textarea
                                value={formData.descripcion}
                                onChange={(e) => handleChange('descripcion', e.target.value)}
                                placeholder="Detalles del trabajo a realizar..."
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Registrar
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AddMantenimientoModal
