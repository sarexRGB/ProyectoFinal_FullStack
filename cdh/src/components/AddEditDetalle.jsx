import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getProductos } from '@/services/ProductosServices'
import { createDetalleAlquiler, getDetallesAlquiler, updateDetalleAlquiler } from '@/services/AlquilerServices'
import { createDetalleVenta, getDetallesPorVenta, updateDetalleVenta } from '@/services/VentaServices'


function AddEditDetalle({ type, initialData, onClose, onSuccess }) {
    const [productos, setProductos] = useState([])
    const [formData, setFormData] = useState({
        producto: '',
        cantidad: '',
        precio_unitario: '',
        precio_diario: '',
        descuento_tipo: 'NINGUNO',
        descuento_valor: '0',
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
                descuento_tipo: initialData.descuento_tipo || 'NINGUNO',
                descuento_valor: initialData.descuento_valor || '0',
                subtotal: initialData.subtotal || ''
            })
        }
    }, [initialData])

    useEffect(() => {
        if (formData.producto && productos.length > 0) {
            const selectedProduct = productos.find(p => p.id === parseInt(formData.producto))
            if (selectedProduct && !initialData) {
                if (type === 'alquiler' && selectedProduct.precio_alquiler) {
                    setFormData(prev => ({ ...prev, precio_diario: selectedProduct.precio_alquiler }))
                } else if (type === 'venta' && selectedProduct.precio_venta) {
                    setFormData(prev => ({ ...prev, precio_unitario: selectedProduct.precio_venta }))
                }
            }
        }
    }, [formData.producto, productos, type, initialData])

    useEffect(() => {
        const cantidad = parseFloat(formData.cantidad) || 0
        const precio = type === 'alquiler'
            ? parseFloat(formData.precio_diario) || 0
            : parseFloat(formData.precio_unitario) || 0

        let subtotal = cantidad * precio

        if (formData.descuento_tipo && formData.descuento_valor) {
            const descuentoValor = parseFloat(formData.descuento_valor) || 0
            if (formData.descuento_tipo === 'PORCENTAJE') {
                subtotal = subtotal * (1 - descuentoValor / 100)
            } else if (formData.descuento_tipo === 'FIJO') {
                subtotal = subtotal - descuentoValor
            }
        }

        setFormData(prev => ({ ...prev, subtotal: Math.max(0, subtotal).toFixed(2) }))
    }, [formData.cantidad, formData.precio_unitario, formData.precio_diario, formData.descuento_tipo, formData.descuento_valor, type])

    const fetchProductos = async () => {
        try {
            const response = await getProductos()
            const allProductos = response.data
            const filteredProductos = allProductos.filter(producto => {
                if (type === 'alquiler') {
                    return producto.precio_alquiler && producto.precio_alquiler > 0
                } else if (type === 'venta') {
                    return producto.precio_venta && producto.precio_venta > 0
                }
                return true
            })
            setProductos(filteredProductos)
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

        if (!formData.producto) {
            toast.error('Producto es obligatorio')
            return
        }

        const isAlquiler = type === 'alquiler'
        const precioValido = isAlquiler ? formData.precio_diario : formData.precio_unitario

        if (!formData.cantidad || !precioValido) {
            toast.error(`Cantidad y ${isAlquiler ? 'Precio diario' : 'Precio unitario'} son obligatorios`)
            return
        }

        try {
            const dataToSubmit = {
                producto: parseInt(formData.producto),
                cantidad: parseFloat(formData.cantidad),
                precio_unitario: parseFloat(formData.precio_unitario) || 0,
                precio_diario: parseFloat(formData.precio_diario) || 0,
                descuento_tipo: formData.descuento_tipo || 'NINGUNO',
                descuento_valor: parseFloat(formData.descuento_valor) || 0,
                subtotal: parseFloat(formData.subtotal),
                producto_nombre: productos.find(p => p.id === parseInt(formData.producto))?.nombre
            }

            if (initialData?.id && initialData?.alquiler) {
                const backendData = {
                    alquiler: initialData.alquiler,
                    producto: dataToSubmit.producto,
                    cantidad: dataToSubmit.cantidad,
                    precio_diario: dataToSubmit.precio_diario,
                    descuento_tipo: dataToSubmit.descuento_tipo,
                    descuento_valor: dataToSubmit.descuento_valor
                }
                await updateDetalleAlquiler(initialData.id, backendData)
                toast.success('Detalle actualizado correctamente')
            } else if (initialData?.id && initialData?.venta) {
                const backendData = {
                    venta: initialData.venta,
                    producto: dataToSubmit.producto,
                    cantidad: dataToSubmit.cantidad,
                    precio_unitario: dataToSubmit.precio_unitario,
                    descuento_tipo: dataToSubmit.descuento_tipo,
                    descuento_valor: dataToSubmit.descuento_valor
                }
                await updateDetalleVenta(initialData.id, backendData)
                toast.success('Detalle actualizado correctamente')
            }

            onSuccess(dataToSubmit)
            onClose()
        } catch (error) {
            console.error("Error saving data:", error)
            toast.error('Error al guardar los datos')
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
                        <SelectValue placeholder='Seleccionar producto' />
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
                    <Label htmlFor={type === 'alquiler' ? 'precio_diario' : 'precio_unitario'}>
                        {type === 'alquiler' ? 'Precio Diario' : 'Precio Unitario'}
                    </Label>
                    <Input
                        id={type === 'alquiler' ? 'precio_diario' : 'precio_unitario'}
                        name={type === 'alquiler' ? 'precio_diario' : 'precio_unitario'}
                        type='number'
                        step='0.01'
                        min='0'
                        value={type === 'alquiler' ? formData.precio_diario : formData.precio_unitario}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className='space-y-2'>
                <Label htmlFor='descuento_tipo'>Descuento</Label>
                <Select
                    value={formData.descuento_tipo}
                    onValueChange={(value) => handleSelectChange('descuento_tipo', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Tipo de descuento' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='NINGUNO'>Sin descuento</SelectItem>
                        <SelectItem value='PORCENTAJE'>Porcentaje (%)</SelectItem>
                        <SelectItem value='FIJO'>Monto fijo (₡)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {formData.descuento_tipo !== 'NINGUNO' && (
                <div className='space-y-2'>
                    <Label htmlFor='descuento_valor'>
                        {formData.descuento_tipo === 'PORCENTAJE' ? 'Porcentaje de descuento' : 'Monto de descuento'}
                    </Label>
                    <Input
                        id='descuento_valor'
                        name='descuento_valor'
                        type='number'
                        step={formData.descuento_tipo === 'PORCENTAJE' ? '0.01' : '1'}
                        min='0'
                        max={formData.descuento_tipo === 'PORCENTAJE' ? '100' : undefined}
                        value={formData.descuento_valor}
                        onChange={handleChange}
                    />
                </div>
            )}

            <div className='space-y-2'>
                <Label htmlFor='subtotal'>Subtotal</Label>
                <Input
                    id='subtotal'
                    name='subtotal'
                    type='number'
                    step='0.01'
                    value={formData.subtotal}
                    disabled
                    className='bg-gray-100 font-bold'
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