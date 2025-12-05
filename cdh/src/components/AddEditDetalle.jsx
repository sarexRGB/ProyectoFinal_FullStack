import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getProductos } from '@/services/ProductosServices'
import { createDetalleAlquiler, getDetallesAlquiler, updateDetalleAlquiler } from '@/services/AlquilerServices'
import { createDetalleVenta, getDetallesVenta, updateDetalleVenta } from '@/services/VentaServices'


function AddEditDetalle({ type, initialData, onClose, onSuccess }) {
    const [productos, setProductos] = useState([])
    const [formData, setFormData] = useState({
        producto: '',
        cantidad: '',
        precio_unitario: '',
        precio_diario: '',
        subtotal: ''
    })

    useEffect(() => {
        fetchProductos()
        if (initialData) {
            setFormData({
                producto: initialData.producto?.id || initialData.producto || '',
                cantidad: initialData.cantidad || '',
                precio_unitario: initialData.precio_unitario || '',
                precio_diario: initialData.precio_diario || '',
                subtotal: initialData.subtotal || ''
            })
        }
    }, [initialData])

    // Calcular subtotal automáticamente
    useEffect(() => {
        const cantidad = parseFloat(formData.cantidad) || 0
        const precioUnitario = parseFloat(formData.precio_unitario) || 0
        const subtotal = cantidad * precioUnitario
        setFormData(prev => ({ ...prev, subtotal: subtotal.toFixed(2) }))
    }, [formData.cantidad, formData.precio_unitario])

    const fetchProductos = async () => {
        try {
            const response = await getProductos()
            setProductos(response.data)
        } catch (error) {
            console.error("Error fetching products:", error)
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

        if (!formData.cantidad || !formData.precio_unitario) {
            alert('Cantidad y Precio unitario son obligatorios')
            return
        }

        try {
            const dataToSubmit = {
                cantidad: parseFloat(formData.cantidad),
                precio_unitario: parseFloat(formData.precio_unitario),
                subtotal: parseFloat(formData.subtotal)
            }

            if (initialData) {
                if (type === 'alquiler') {
                    await updateDetalleAlquiler(initialData.id, dataToSubmit)
                } else {
                    await updateDetalleVenta(initialData.id, dataToSubmit)
                }
            } else {
                if (type === 'alquiler') {
                    await createDetalleAlquiler(dataToSubmit)
                } else {
                    await createDetalleVenta(dataToSubmit)
                }
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error saving data:", error)
        }
    }
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
            <Label htmlFor='producto'>Producto</Label>
            <Select
                value={formData.producto ? formData.producto.toString() : ''}
                onValueChange={(value) => handleSelectChange('producto', value)}
                disabled={!!initialData}
            >
                <SelectTrigger>
                    <SelectValue placeholder='Seleccionar producto'/>
                </SelectTrigger>
                <SelectContent>
                    {productos.map(producto => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                            {producto.nombre}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
                <Label htmlFor='cantidad'>Cantidad</Label>
                <Input
                    id='cantidad'
                    name='cantidad'
                    type='number'
                    step='1'
                    min='1'
                    value={formData.cantidad}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className='space-y-2'>
                <Label htmlFor='precio_unitario'>Precio Unitario</Label>
                <Input
                    id='precio_unitario'
                    name='precio_unitario'
                    type='number'
                    step='0.01'
                    min='0'
                    value={formData.precio_unitario}
                    onChange={handleChange}
                    required
                />
            </div>
        </div>

        <div className='space-y-2'>
            <Label htmlFor='subtotal'>Subtotal</Label>
            <Input
                id='subtotal'
                name='subtotal'
                type='number'
                step='0.01'
                value={formData.subtotal}
                disabled
                className='bg-gray-100'
            />
        </div>

        <div className='flex justify-end gap-2'>
            <Button type='button' onClick={onClose}>Cancelar</Button>
            <Button type='submit'>Guardar</Button>
        </div>
    </form>
  )
}

export default AddEditDetalle