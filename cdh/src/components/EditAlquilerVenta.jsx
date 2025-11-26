import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getClientes } from '@/services/ClientesServices'
import { createAlquiler, updateAlquiler } from '@/services/AlquilerServices'
import { createVenta, updateVenta } from '@/services/VentaServices'

function EditAlquilerVenta({ type, initialData, onClose, onSuccess }) {
    const [clientes, setClientes] = useState([])
    const [formData, setFormData] = useState({
        cliente: '',
        fecha_inicio: '',
        fecha_fin: '',
        fecha: '',
        total: '',
        estado: 'PENDIENTE',
        contrato: ''
    })

    useEffect(() => {
        fetchClientes()
        if (initialData) {
            setFormData({
                cliente: initialData.cliente?.id || initialData.cliente || '',
                fecha_inicio: initialData.fecha_inicio || '',
                fecha_fin: initialData.fecha_fin || '',
                fecha: initialData.fecha || '',
                total: initialData.total || '',
                estado: initialData.estado || 'PENDIENTE',
                contrato: initialData.contrato || ''
            })
        }
    }, [initialData])

    const fetchClientes = async () => {
        try {
            const response = await getClientes()
            setClientes(response.data)
        } catch (error) {
            console.error("Error fetching clients:", error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const dataToSubmit = { ...formData }
            // Clean up fields based on type
            if (type === 'alquiler') {
                delete dataToSubmit.fecha
            } else {
                delete dataToSubmit.fecha_inicio
                delete dataToSubmit.fecha_fin
                delete dataToSubmit.estado
                delete dataToSubmit.contrato
            }

            if (initialData) {
                if (type === 'alquiler') {
                    await updateAlquiler(initialData.id, dataToSubmit)
                } else {
                    await updateVenta(initialData.id, dataToSubmit)
                }
            } else {
                if (type === 'alquiler') {
                    await createAlquiler(dataToSubmit)
                } else {
                    await createVenta(dataToSubmit)
                }
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error saving data:", error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                    value={formData.cliente.toString()}
                    onValueChange={(value) => handleSelectChange('cliente', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                        {clientes.map(cliente => (
                            <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                {cliente.nombre} {cliente.apellido}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {type === 'alquiler' ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                            <Input
                                id="fecha_inicio"
                                name="fecha_inicio"
                                type="date"
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fecha_fin">Fecha Fin</Label>
                            <Input
                                id="fecha_fin"
                                name="fecha_fin"
                                type="date"
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select
                            value={formData.estado}
                            onValueChange={(value) => handleSelectChange('estado', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                <SelectItem value="ACTIVO">Activo</SelectItem>
                                <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                                <SelectItem value="CANCELADO">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha Venta</Label>
                    <Input
                        id="fecha"
                        name="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="total">Total</Label>
                <Input
                    id="total"
                    name="total"
                    type="number"
                    step="0.01"
                    value={formData.total}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>
        </form>
    )
}

export default EditAlquilerVenta