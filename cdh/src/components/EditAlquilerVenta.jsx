import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { getProductos } from '@/services/ProductosServices'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getClientes } from '@/services/ClientesServices'
import { createAlquiler, updateAlquiler, createDetalleAlquiler, updateDetalleAlquiler, getDetallesAlquiler } from '@/services/AlquilerServices'
import { createVenta, updateVenta, createDetalleVenta, updateDetalleVenta, getDetallesPorVenta } from '@/services/VentaServices'
import { Plus, Edit, Trash } from 'lucide-react'

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
    const [productos, setProductos] = useState([])
    const [detalles, setDetalles] = useState([])
    const [openDetalleModal, setOpenDetalleModal] = useState(false)
    const [editingDetalle, setEditingDetalle] = useState(null)
    const [detalleIndex, setDetalleIndex] = useState(null)
    const [detalleForm, setDetalleForm] = useState({
        producto: '',
        cantidad: '',
        precio_unitario: '',
        subtotal: ''
    })

    useEffect(() => {
        fetchClientes()
        fetchProductos()
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
            fetchDetallesExistentes()
        }
    }, [initialData])

    const fetchDetallesExistentes = async () => {
        try {
            const response = type === 'alquiler'
                ? await getDetallesAlquiler(initialData.id)
                : await getDetallesPorVenta(initialData.id)

            setDetalles(response.data)
        } catch (error) {
            console.error("Error fetching details:", error)
            toast.error("Error al cargar detalles")
        }
    }

    const fetchClientes = async () => {
        try {
            const response = await getClientes()
            setClientes(response.data)
        } catch (error) {
            console.error("Error fetching clients:", error)
            toast.error("Error al cargar clientes")
        }
    }

    const fetchProductos = async () => {
        try {
            const response = await getProductos()
            setProductos(response.data)
        } catch (error) {
            console.error("Error fetching products:", error)
            toast.error("Error al cargar productos")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const base64 = e.target.result.split(',')[1]
                setFormData(prev => ({ ...prev, contrato: base64 }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const total = detalles.reduce((sum, detalle) => sum + parseFloat(detalle.subtotal || 0), 0)
        setFormData(prev => ({ ...prev, total: total.toFixed(2) }))
    }, [detalles])

    useEffect(() => {
        const cantidad = parseFloat(detalleForm.cantidad) || 0
        const precioUnitario = parseFloat(detalleForm.precio_unitario) || 0
        let subtotal = cantidad * precioUnitario

        if (type === 'alquiler' && formData.fecha_inicio && formData.fecha_fin) {
            const fechaInicio = new Date(formData.fecha_inicio)
            const fechaFin = new Date(formData.fecha_fin)
            const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1
            subtotal = cantidad * precioUnitario * dias
        }

        setDetalleForm(prev => ({ ...prev, subtotal: subtotal.toFixed(2) }))
    }, [detalleForm.cantidad, detalleForm.precio_unitario, formData.fecha_inicio, formData.fecha_fin, type])

    const handleAddDetalle = () => {
        setEditingDetalle(null)
        setDetalleIndex(null)
        setDetalleForm({
            producto: '',
            cantidad: '',
            precio_unitario: '',
            subtotal: ''
        })
        setOpenDetalleModal(true)
    }

    const handleEditDetalle = (detalle, index) => {
        setEditingDetalle(detalle)
        setDetalleIndex(index)
        setDetalleForm({
            producto: detalle.producto?.id || detalle.producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal
        })
        setOpenDetalleModal(true)
    }

    const handleGuardarDetalle = () => {
        if (!detalleForm.producto || !detalleForm.cantidad || !detalleForm.precio_unitario) {
            toast.error("Complete todos los campos del detalle")
            return
        }

        const productoObj = productos.find(p => p.id === parseInt(detalleForm.producto))
        const nuevoDetalle = {
            ...detalleForm,
            producto: productoObj,
            id: editingDetalle?.id
        }

        if (detalleIndex !== null) {
            const nuevosDetalles = [...detalles]
            nuevosDetalles[detalleIndex] = nuevoDetalle
            setDetalles(nuevosDetalles)
        } else {
            setDetalles([...detalles, nuevoDetalle])
        }
        setOpenDetalleModal(false)
        setEditingDetalle(null)
        setDetalleIndex(null)
    }

    const handleEliminarDetalle = (index) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index)
        setDetalles(nuevosDetalles)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.cliente) {
            toast.error("El cliente es obligatorio")
            return
        }


        if (detalles.length === 0) {
            toast.error("Debe agregar al menos un producto")
            return
        }

        try {
            let alquilerVentaId = initialData?.id

            const dataToSubmit = { ...formData }

            if (type === 'alquiler') {
                delete dataToSubmit.fecha
                delete dataToSubmit.contrato
            } else {
                delete dataToSubmit.fecha_inicio
                delete dataToSubmit.fecha_fin
                delete dataToSubmit.estado
                delete dataToSubmit.contrato
            }

            dataToSubmit.cliente = parseInt(dataToSubmit.cliente)
            dataToSubmit.total = parseFloat(dataToSubmit.total)

            console.log('Datos a enviar al backend:', dataToSubmit)

            if (initialData) {
                if (type === 'alquiler') {
                    await updateAlquiler(initialData.id, dataToSubmit)
                } else {
                    await updateVenta(initialData.id, dataToSubmit)
                }

                for (const detalle of detalles) {
                    if (detalle.id) {
                        const detalleData = {
                            cantidad: parseFloat(detalle.cantidad),
                        }

                        if (type === 'alquiler') {
                            detalleData.precio_diario = parseFloat(detalle.precio_unitario)
                        } else {
                            detalleData.precio_unitario = parseFloat(detalle.precio_unitario)
                            detalleData.subtotal = parseFloat(detalle.subtotal)
                        }
                        if (type === 'alquiler') {
                            await updateDetalleAlquiler(detalle.id, detalleData)
                        } else {
                            await updateDetalleVenta(detalle.id, detalleData)
                        }
                    } else {
                        const detalleData = {
                            [type === 'alquiler' ? 'alquiler' : 'venta']: initialData.id,
                            producto: detalle.producto?.id || detalle.producto,
                            cantidad: parseFloat(detalle.cantidad),
                        }

                        if (type === 'alquiler') {
                            detalleData.precio_diario = parseFloat(detalle.precio_unitario)
                        } else {
                            detalleData.precio_unitario = parseFloat(detalle.precio_unitario)
                            detalleData.subtotal = parseFloat(detalle.subtotal)
                        }
                        if (type === 'alquiler') {
                            await createDetalleAlquiler(detalleData)
                        } else {
                            await createDetalleVenta(detalleData)
                        }
                    }
                }
            } else {
                const response = type === 'alquiler'
                    ? await createAlquiler(dataToSubmit)
                    : await createVenta(dataToSubmit)

                alquilerVentaId = response.data.id

                for (const detalle of detalles) {
                    const detalleData = {
                        [type === 'alquiler' ? 'alquiler' : 'venta']: alquilerVentaId,
                        producto: detalle.producto?.id || detalle.producto,
                        cantidad: parseFloat(detalle.cantidad),
                    }

                    if (type === 'alquiler') {
                        detalleData.precio_diario = parseFloat(detalle.precio_unitario)
                    } else {
                        detalleData.precio_unitario = parseFloat(detalle.precio_unitario)
                        detalleData.subtotal = parseFloat(detalle.subtotal)
                    }
                    if (type === 'alquiler') {
                        await createDetalleAlquiler(detalleData)
                    } else {
                        await createDetalleVenta(detalleData)
                    }
                }
            }

            toast.success(`${type === 'alquiler' ? 'Alquiler' : 'Venta'} guardado correctamente`)
            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error saving data:", error)
            toast.error("Error al guardar los datos")
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                    value={formData.cliente ? formData.cliente.toString() : ''}
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
                    <div>
                        <Label htmlFor="contrato">Contrato</Label>
                        <Input
                            id="contrato"
                            name="contrato"
                            type="file"
                            onChange={handleFileChange}
                            required={!initialData}
                        />
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
                <div className="flex justify-between items-center">
                    <Label>Productos</Label>
                    <Button type="button" size="sm" onClick={handleAddDetalle}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Producto
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Precio Unit.</TableHead>
                                <TableHead>Subtotal</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detalles.length > 0 ? (
                                detalles.map((detalle, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{detalle.producto?.nombre || detalle.producto_nombre || 'N/A'}</TableCell>
                                        <TableCell>{detalle.cantidad}</TableCell>
                                        <TableCell>₡{detalle.precio_unitario}</TableCell>
                                        <TableCell className="font-semibold">₡{detalle.subtotal}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditDetalle(detalle, index)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEliminarDetalle(index)}
                                            >
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No hay productos agregados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="total">Total</Label>
                <Input
                    id="total"
                    name="total"
                    type="number"
                    step="0.01"
                    value={formData.total}
                    disabled
                    className="bg-gray-100 font-bold text-lg"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </div>

            <Dialog open={openDetalleModal} onOpenChange={setOpenDetalleModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDetalle ? 'Editar' : 'Agregar'} Producto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Producto</Label>
                            <Select
                                value={detalleForm.producto ? detalleForm.producto.toString() : ''}
                                onValueChange={(value) => setDetalleForm(prev => ({ ...prev, producto: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar producto" />
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cantidad</Label>
                                <Input
                                    type="number"
                                    step="1"
                                    min="1"
                                    value={detalleForm.cantidad}
                                    onChange={(e) => setDetalleForm(prev => ({ ...prev, cantidad: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Precio Unitario</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={detalleForm.precio_unitario}
                                    onChange={(e) => setDetalleForm(prev => ({ ...prev, precio_unitario: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Subtotal</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={detalleForm.subtotal}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenDetalleModal(false)}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleGuardarDetalle}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </form>
    )
}

export default EditAlquilerVenta