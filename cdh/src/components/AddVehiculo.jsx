import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createVehiculo, updateVehiculo } from '@/services/VehiculoServices'

function AddVehiculo({ isOpen, onClose, item }) {
    const [formData, setFormData] = useState({
        placa: '',
        modelo: '',
        estado: 'DISPONIBLE'
    })

    useEffect(() => {
        if (item) {
            setFormData({
                placa: item.placa || '',
                modelo: item.modelo || '',
                estado: item.estado || 'DISPONIBLE'
            })
        } else {
            setFormData({
                placa: '',
                modelo: '',
                estado: 'DISPONIBLE'
            })
        }
    }, [item, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validaciones
        if (!formData.placa.trim()) {
            toast.error('La placa es requerida')
            return
        }

        if (!formData.modelo.trim()) {
            toast.error('El modelo es requerido')
            return
        }

        try {
            const vehiculoData = {
                placa: formData.placa.trim().toUpperCase(),
                modelo: formData.modelo.trim(),
                estado: formData.estado
            }

            if (item?.id) {
                await updateVehiculo(item.id, vehiculoData)
                toast.success('Vehículo actualizado correctamente')
            } else {
                await createVehiculo(vehiculoData)
                toast.success('Vehículo creado correctamente')
            }

            onClose()
        } catch (error) {
            console.error('Error al guardar vehículo:', error)
            const errorMessage = error.response?.data?.placa?.[0] ||
                error.response?.data?.detail ||
                'Error al guardar el vehículo'
            toast.error(errorMessage)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {item?.id ? 'Editar' : 'Agregar'} Vehículo
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='placa'>
                                Placa <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='placa'
                                name='placa'
                                value={formData.placa}
                                onChange={handleChange}
                                placeholder='Ej: ABC-123'
                                maxLength={10}
                                required
                                className='uppercase'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='modelo'>
                                Modelo <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='modelo'
                                name='modelo'
                                value={formData.modelo}
                                onChange={handleChange}
                                placeholder='Ej: Toyota Hilux 2020'
                                maxLength={100}
                                required
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='estado'>
                            Estado <span className='text-red-500'>*</span>
                        </Label>
                        <Select
                            value={formData.estado}
                            onValueChange={(value) => handleSelectChange('estado', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Seleccionar estado' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='DISPONIBLE'>Disponible</SelectItem>
                                <SelectItem value='USO'>En uso</SelectItem>
                                <SelectItem value='MANTENIMIENTO'>En mantenimiento</SelectItem>
                                <SelectItem value='FUERA'>Fuera de servicio</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex justify-end gap-2 pt-4'>
                        <Button type='button' variant='outline' onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type='submit'>
                            {item?.id ? 'Actualizar' : 'Crear'} Vehículo
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddVehiculo
