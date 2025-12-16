import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { updateEntrega } from '@/services/AlquilerServices'
import { getChoferes } from '@/services/UsuariosServices'
import { getVehiculos } from '@/services/VehiculoServices'

function EditEntrega({ entrega, onClose, onSuccess }) {
    const [choferes, setChoferes] = useState([])
    const [vehiculos, setVehiculos] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        chofer: '',
        vehiculo: '',
        fecha_entrega: '',
        hora_entrega: '',
        fecha_devolucion: '',
        hora_devolucion: '',
        estado: 'PENDIENTE'
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const [choferesRes, vehiculosRes] = await Promise.all([
                    getChoferes(),
                    getVehiculos()
                ])

                setChoferes(choferesRes.data)
                setVehiculos(vehiculosRes.data)

                if (entrega) {
                    const [fechaSalidaStr, horaSalidaStr] = entrega.fecha_salida.split('T')
                    const [fechaRetornoStr, horaRetornoStr] = entrega.fecha_retorno.split('T')

                    setFormData({
                        chofer: entrega.chofer?.toString() || '',
                        vehiculo: entrega.vehiculo?.toString() || '',
                        fecha_entrega: fechaSalidaStr,
                        hora_entrega: horaSalidaStr ? horaSalidaStr.slice(0, 5) : '',
                        fecha_devolucion: fechaRetornoStr,
                        hora_devolucion: horaRetornoStr ? horaRetornoStr.slice(0, 5) : '',
                        estado: entrega.estado || 'PENDIENTE'
                    })
                }
            } catch (error) {
                console.error('Error al cargar datos:', error)
                toast.error('Error al cargar datos')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [entrega])

    const choferNombre = (id) => {
        const chofer = choferes.find((c) => c.id === id || c.empleado === id)
        return chofer ? chofer.empleado_nombre : ''
    }

    const vehiculoNombre = (id) => {
        const vehiculo = vehiculos.find((v) => v.id === id)
        return vehiculo ? `${vehiculo.modelo} ${vehiculo.placa}` : ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.chofer) {
            toast.error('Por favor, seleccione un chofer')
            return
        }

        if (!formData.vehiculo) {
            toast.error('Por favor, seleccione un vehículo')
            return
        }

        if (!formData.hora_entrega) {
            toast.error('Por favor, ingrese la hora de entrega')
            return
        }

        if (!formData.hora_devolucion) {
            toast.error('Por favor, ingrese la hora de devolución')
            return
        }

        try {
            const entregaData = {
                alquiler: entrega.alquiler,
                chofer: parseInt(formData.chofer),
                vehiculo: parseInt(formData.vehiculo),
                fecha_salida: `${formData.fecha_entrega}T${formData.hora_entrega}:00`,
                fecha_retorno: `${formData.fecha_devolucion}T${formData.hora_devolucion}:00`,
                estado: formData.estado
            }

            await updateEntrega(entrega.id, entregaData)
            toast.success('Entrega actualizada correctamente')
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error al actualizar entrega:', error)
            toast.error('Error al actualizar la entrega')
        }
    }

    if (loading) {
        return <div className="p-4 text-center">Cargando datos...</div>
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <Label>Chofer</Label>
                <Select
                    value={formData.chofer}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, chofer: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Seleccionar chofer' />
                    </SelectTrigger>
                    <SelectContent>
                        {choferes.map((chofer) => (
                            <SelectItem
                                key={chofer.id}
                                value={chofer.empleado.toString()}
                            >
                                {choferNombre(chofer.empleado)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Vehículo</Label>
                <Select
                    value={formData.vehiculo}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehiculo: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Seleccionar vehículo' />
                    </SelectTrigger>
                    <SelectContent>
                        {vehiculos.map((vehiculo) => (
                            <SelectItem
                                key={vehiculo.id}
                                value={vehiculo.id.toString()}
                            >
                                {vehiculoNombre(vehiculo.id)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label>Fecha entrega</Label>
                    <Input
                        type='date'
                        value={formData.fecha_entrega}
                        onChange={(e) => setFormData(prev => ({ ...prev, fecha_entrega: e.target.value }))}
                    />
                </div>
                <div>
                    <Label>Hora de entrega</Label>
                    <Input
                        type='time'
                        value={formData.hora_entrega}
                        onChange={(e) => setFormData(prev => ({ ...prev, hora_entrega: e.target.value }))}
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label>Fecha devolución</Label>
                    <Input
                        type='date'
                        value={formData.fecha_devolucion}
                        onChange={(e) => setFormData(prev => ({ ...prev, fecha_devolucion: e.target.value }))}
                    />
                </div>
                <div>
                    <Label>Hora de devolución</Label>
                    <Input
                        type='time'
                        value={formData.hora_devolucion}
                        onChange={(e) => setFormData(prev => ({ ...prev, hora_devolucion: e.target.value }))}
                    />
                </div>
            </div>

            <div>
                <Label>Estado</Label>
                <Select
                    value={formData.estado}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Seleccionar estado' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='PENDIENTE'>Pendiente</SelectItem>
                        <SelectItem value='RUTA'>En ruta</SelectItem>
                        <SelectItem value='COMPLETADA'>Completada</SelectItem>
                        <SelectItem value='DEVUELTA'>Devuelta</SelectItem>
                        <SelectItem value='CANCELADA'>Cancelada</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={onClose}>
                    Cancelar
                </Button>
                <Button type='submit'>
                    Guardar cambios
                </Button>
            </div>
        </form>
    )
}

export default EditEntrega
