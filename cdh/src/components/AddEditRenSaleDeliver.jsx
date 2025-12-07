import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getProductos } from '@/services/ProductosServices'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { getClientes } from '@/services/ClientesServices'
import { createAlquiler, updateAlquiler, getDetallesAlquiler, getEntregas, createEntrega, updateEntrega, createDetalleAlquiler, updateDetalleAlquiler } from '@/services/AlquilerServices'
import { createVenta, updateVenta, getDetallesPorVenta, createDetalleVenta, updateDetalleVenta } from '@/services/VentaServices'
import { getChoferes } from '@/services/UsuariosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { Plus, Edit, Trash } from 'lucide-react'
import AddEditDetalle from '@/components/AddEditDetalle'

function AddEditRenSaleDeliver({ type, initialData, onClose, onSuccess }) {
    const [clientes, setClientes] = useState([])
    const [choferes, setChoferes] = useState([])
    const [vehiculos, setVehiculos] = useState([])
    const [productos, setProductos] = useState([])
    const [detalles, setDetalles] = useState([])
    const [realizarEntrega, setRealizarEntrega] = useState(false)
    const [clienteRetira, setClienteRetira] = useState(false)
    const [openDetalleModal, setOpenDetalleModal] = useState(false)
    const [editingDetalle, setEditingDetalle] = useState(null)
    const [detalleIndex, setDetalleIndex] = useState(null)
    const [formData, setFormData] = useState({
        cliente: '',
        fecha_inicio: '',
        fecha_fin: '',
        fecha: '',
        total: '',
        estado: 'Pendiente',
        contrato: '',
    })
    const [detalleFormData, setDetalleFormData] = useState({
        producto: '',
        cantidad: '',
        precio_unitario: '',
        precio_diario: '',
        subtotal: '',
    })
    const [entregaFormData, setEntregaFormData] = useState({
        chofer: '',
        vehiculo: '',
        fecha_salida: '',
        fecha_retorno: '',
        estado: 'Entregado',
    })

    useEffect(() => {
        fetchClientes()
        fetchChoferes()
        fetchVehiculos()
        fetchProductos()
        if (initialData) {
            setFormData({
                cliente: initialData.cliente?.id || initialData.cliente || '',
                fecha_inicio: initialData.fecha_inicio || '',
                fecha_fin: initialData.fecha_fin || '',
                fecha: initialData.fecha || '',
                total: initialData.total || '',
                estado: initialData.estado || 'Pendiente',
                contrato: initialData.contrato || '',
            })
            fetchDetallesExistentes()
            fetchEntregaExistente()
        }
    }, [initialData])

    // Calcular total automáticamente cuando cambian los detalles o las fechas (para alquileres)
    useEffect(() => {
        let total = 0

        if (type === 'alquiler' && formData.fecha_inicio && formData.fecha_fin) {
            // Calcular días de alquiler
            const fechaInicio = new Date(formData.fecha_inicio)
            const fechaFin = new Date(formData.fecha_fin)
            const diasAlquiler = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))

            // Total = suma de (subtotal * días)
            total = detalles.reduce((sum, detalle) => {
                return sum + (parseFloat(detalle.subtotal || 0) * diasAlquiler)
            }, 0)
        } else {
            // Para ventas, el total es la suma de subtotales
            total = detalles.reduce((sum, detalle) => {
                return sum + parseFloat(detalle.subtotal || 0)
            }, 0)
        }

        setFormData(prev => ({ ...prev, total: total.toFixed(2) }))
    }, [detalles, formData.fecha_inicio, formData.fecha_fin, type])

    const fetchDetallesExistentes = async () => {
        try {
            const response = type === 'alquiler'
                ? await getDetallesAlquiler(initialData.id)
                : await getDetallesPorVenta(initialData.id)
            setDetalles(response.data)
        } catch (error) {
            console.log('Error al obtener los detalles', error)
            toast.error('Error al obtener los detalles')
        }
    }

    const fetchEntregaExistente = async () => {
        try {
            const response = type === 'alquiler' &&
                await getEntregas(initialData.id)
            setRealizarEntrega(response.data)
        } catch (error) {
            console.log('Error al obtener la entrega', error)
            toast.error('Error al obtener la entrega')
        }
    }

    const fetchClientes = async () => {
        try {
            const response = await getClientes()
            setClientes(response.data)
        } catch (error) {
            console.log('Error al obtener los clientes', error)
            toast.error('Error al obtener los clientes')
        }
    }

    const fetchChoferes = async () => {
        try {
            const response = await getChoferes()
            setChoferes(response.data)
        } catch (error) {
            console.log('Error al obtener los choferes', error)
            toast.error('Error al obtener los choferes')
        }
    }

    const fetchVehiculos = async () => {
        try {
            const response = await getVehiculos()
            setVehiculos(response.data)
        } catch (error) {
            console.log('Error al obtener los vehiculos', error)
            toast.error('Error al obtener los vehiculos')
        }
    }

    const fetchProductos = async () => {
        try {
            const response = await getProductos()
            setProductos(response.data)
        } catch (error) {
            console.log('Error al obtener los productos', error)
            toast.error('Error al obtener los productos')
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFormData(prev => ({ ...prev, contrato: e.target.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAddDetalle = () => {
        setEditingDetalle(null)
        setDetalleIndex(null)
        setDetalleFormData({
            producto: '',
            cantidad: '',
            precio_unitario: '',
            precio_diario: '',
            subtotal: '',
        })
        setOpenDetalleModal(true)
    }

    const handleEditDetalle = (detalle, index) => {
        setEditingDetalle(detalle)
        setDetalleIndex(index)
        setDetalleFormData({
            producto: detalle.producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            precio_diario: detalle.precio_diario,
            subtotal: detalle.subtotal,
        })
        setOpenDetalleModal(true)
    }

    const handleEntrega = (checked) => {
        setRealizarEntrega(checked)
    }

    const handleDeleteDetalle = (index) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index)
        setDetalles(nuevosDetalles)
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'fecha_fin' && formData.fecha_inicio && value < formData.fecha_inicio) {
            toast.error('La fecha de fin debe ser posterior a la fecha de inicio')
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.cliente) {
            toast.error('Por favor, seleccione un cliente')
            return
        }

        if (detalles.length === 0) {
            toast.error('Debe agregar al menos un producto')
            return
        }

        if (!formData.total || parseFloat(formData.total) <= 0) {
            toast.error('El total debe ser mayor a 0')
            return
        }

        if (type === 'alquiler') {
            if (!formData.fecha_inicio || !formData.fecha_fin) {
                toast.error('Por favor, seleccione una fecha de inicio y fin')
                return
            }

            if (!formData.estado) {
                toast.error('Por favor, seleccione un estado')
                return
            }

            if (!initialData && !formData.contrato) {
                toast.error('Por favor, adjunte el contrato')
                return
            }

            if (new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)) {
                toast.error('La fecha de fin debe ser posterior a la fecha de inicio')
                return
            }
        }

        if (type === 'venta') {
            if (!formData.fecha) {
                toast.error('Por favor, seleccione la fecha de venta')
                return
            }
        }

        if (type === 'alquiler' && realizarEntrega) {
            if (!entregaFormData.chofer) {
                toast.error('Por favor, seleccione un chofer')
                return
            }

            if (!entregaFormData.vehiculo) {
                toast.error('Por favor, seleccione un vehiculo')
                return
            }

            if (!entregaFormData.fecha_salida) {
                toast.error('Por favor, seleccione la fecha de salida')
                return
            }

            if (!entregaFormData.fecha_retorno) {
                toast.error('Por favor, seleccione la fecha de retorno')
                return
            }
            if (new Date(entregaFormData.fecha_retorno) < new Date(entregaFormData.fecha_salida)) {
                toast.error('La fecha de retorno debe ser posterior a la fecha de salida')
                return
            }
        }

        try {
            let response

            if (type === 'alquiler') {
                const alquilerData = {
                    cliente: parseInt(formData.cliente),
                    fecha_inicio: formData.fecha_inicio,
                    fecha_fin: formData.fecha_fin,
                    total: parseFloat(formData.total),
                    estado: formData.estado,
                    contrato: formData.contrato || null
                }

                if (initialData) {
                    response = await updateAlquiler(initialData.id, alquilerData)
                } else {
                    response = await createAlquiler(alquilerData)
                }

                // Guardar detalles
                for (const detalle of detalles) {
                    const detalleData = {
                        alquiler: response.data.id,
                        producto: parseInt(detalle.producto),
                        cantidad: parseFloat(detalle.cantidad),
                        precio_diario: parseFloat(detalle.precio_diario || detalle.precio_unitario)
                    }

                    if (detalle.id) {
                        await updateDetalleAlquiler(detalle.id, detalleData)
                    } else {
                        await createDetalleAlquiler(detalleData)
                    }
                }

                // Guardar entrega si corresponde
                if (realizarEntrega) {
                    const entregaData = {
                        alquiler: response.data.id,
                        chofer: parseInt(entregaFormData.chofer),
                        vehiculo: parseInt(entregaFormData.vehiculo),
                        fecha_salida: entregaFormData.fecha_salida,
                        fecha_retorno: entregaFormData.fecha_retorno,
                        estado: entregaFormData.estado
                    }

                    if (initialData?.entrega_id) {
                        await updateEntrega(initialData.entrega_id, entregaData)
                    } else {
                        await createEntrega(entregaData)
                    }
                }

                toast.success(initialData ? 'Alquiler actualizado correctamente' : 'Alquiler creado correctamente')
            } else {
                // Venta
                const ventaData = {
                    cliente: parseInt(formData.cliente),
                    fecha: formData.fecha,
                    total: parseFloat(formData.total)
                }

                if (initialData) {
                    response = await updateVenta(initialData.id, ventaData)
                } else {
                    response = await createVenta(ventaData)
                }

                // Guardar detalles
                for (const detalle of detalles) {
                    const detalleData = {
                        venta: response.data.id,
                        producto: parseInt(detalle.producto),
                        cantidad: parseFloat(detalle.cantidad),
                        precio_unitario: parseFloat(detalle.precio_unitario),
                        subtotal: parseFloat(detalle.subtotal)
                    }

                    if (detalle.id) {
                        await updateDetalleVenta(detalle.id, detalleData)
                    } else {
                        await createDetalleVenta(detalleData)
                    }
                }

                toast.success(initialData ? 'Venta actualizada correctamente' : 'Venta creada correctamente')
            }

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error al guardar:', error)
            toast.error('Error al guardar los datos: ' + (error.response?.data?.message || error.message))
        }
    }

    const clienteNombre = (id) => {
        const cliente = clientes.find((cliente) => cliente.id === id)
        return cliente ? `${cliente.nombre} ${cliente.primer_apellido} ${cliente.segundo_apellido}` : ''
    }

    const choferNombre = (id) => {
        const chofer = choferes.find((chofer) => chofer.id === id)
        return chofer ? `${chofer.nombre} ${chofer.primer_apellido} ${chofer.segundo_apellido}` : ''
    }

    const vehiculoNombre = (id) => {
        const vehiculo = vehiculos.find((vehiculo) => vehiculo.id === id)
        return vehiculo ? `${vehiculo.modelo} ${vehiculo.placa}` : ''
    }

    const productoNombre = (id) => {
        const producto = productos.find((producto) => producto.id === id)
        return producto ? `${producto.nombre}` : ''
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4 max-h-screen overflow-y-auto'>
            <div>
                <Label htmlFor='cliente'>Cliente</Label>
                <Select
                    value={formData.cliente ? formData.cliente.toString() : ''}
                    onValueChange={(value) => handleSelectChange('cliente', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Seleccionar cliente' />
                    </SelectTrigger>
                    <SelectContent>
                        {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                {clienteNombre(cliente.id)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {type === 'alquiler' && (
                <>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='fecha_inicio'>Fecha inicio</Label>
                            <Input
                                type='date'
                                id='fecha_inicio'
                                name='fecha_inicio'
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='fecha_fin'>Fecha fin</Label>
                            <Input
                                type='date'
                                id='fecha_fin'
                                name='fecha_fin'
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                min={formData.fecha_inicio}
                                disabled={!formData.fecha_inicio}
                                required
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='estado'>Estado</Label>
                            <Select
                                value={formData.estado}
                                onValueChange={(value) => handleSelectChange('estado', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Seleccionar estado' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='PENDIENTE'>Pendiente</SelectItem>
                                    <SelectItem value='ACTIVO'>Activo</SelectItem>
                                    <SelectItem value='FINALIZADO'>Finalizado</SelectItem>
                                    <SelectItem value='CANCELADO'>Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='contrato'>Contrato</Label>
                            <Input
                                type='file'
                                id='contrato'
                                name='contrato'
                                onChange={handleFileChange}
                                required={!initialData}
                            />
                        </div>
                    </div>

                </>
            )}
            {type === 'venta' && (
                <>
                    <div className='space-y-2'>
                        <Label htmlFor='fecha'>Fecha Venta</Label>
                        <Input
                            type='date'
                            id='fecha'
                            name='fecha'
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </>
            )}
            <div>
                <div>
                    <Label>Productos</Label>
                    <Button type='button' size='sm' onClick={handleAddDetalle}>
                        <Plus size={16} className='mr-2' />
                        Agregar Producto
                    </Button>
                </div>
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Cantidad</TableHead>
                                {type === 'alquiler' && (
                                    <TableHead>Precio Diario</TableHead>
                                )}
                                {type === 'venta' && (
                                    <TableHead>Precio Unitario</TableHead>
                                )}
                                <TableHead>Subtotal</TableHead>
                                <TableHead className='text-right'>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detalles.length > 0 ? (
                                detalles.map((detalle, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{detalle.producto?.nombre || detalle.producto_nombre || 'N/A'}</TableCell>
                                        <TableCell>{detalle.cantidad}</TableCell>
                                        {type === 'alquiler' && (
                                            <TableCell>₡{detalle.precio_diario}</TableCell>
                                        )}
                                        {type === 'venta' && (
                                            <TableCell>₡{detalle.precio_unitario}</TableCell>
                                        )}
                                        <TableCell>₡{detalle.subtotal}</TableCell>
                                        <TableCell>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => handleEditDetalle(detalle, index)}
                                            >
                                                <Edit size={16} className='mr-2' />
                                            </Button>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => handleDeleteDetalle(index)}
                                            >
                                                <Trash size={16} className='mr-2' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className='h-24 text-center'>
                                        No hay detalles
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className='space-y-2'>
                <Label htmlFor='total'>Total</Label>
                <Input
                    id='total'
                    name='total'
                    type='number'
                    step='0.01'
                    value={formData.total}
                    disabled
                    className='bg-gray-100 font-bold text-lg'
                />
            </div>

            {type === 'alquiler' && (
                <div>
                    <div>
                        <Checkbox
                            checked={clienteRetira}
                            onCheckedChange={(checked) => {
                                setClienteRetira(checked)
                                if (checked) {
                                    setRealizarEntrega(false)
                                }
                            }}
                        />
                        <Label>Cliente retira</Label>
                    </div>
                    {!clienteRetira && (
                        <div>
                            <Checkbox
                                checked={realizarEntrega}
                                onCheckedChange={handleEntrega}
                            />
                            <Label>Realizar Entrega</Label>
                        </div>
                    )}
                    <div>
                        {realizarEntrega && (
                            <Accordion type='single' collapsible defaultValue='entrega'>
                                <AccordionItem value='entrega'>
                                    <AccordionTrigger>Coordinar Entrega</AccordionTrigger>
                                    <AccordionContent>
                                        <div>
                                            <Label>Chofer</Label>
                                            <Select
                                                value={entregaFormData.chofer ? entregaFormData.chofer.toString() : ''}
                                                onValueChange={(value) => setEntregaFormData(prev => ({ ...prev, chofer: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Seleccionar chofer' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {choferes.map((chofer) => (
                                                        <SelectItem
                                                            key={chofer.id}
                                                            value={chofer.id.toString()}
                                                        >
                                                            {choferNombre(chofer.id)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Vehículo</Label>
                                            <Select
                                                value={entregaFormData.vehiculo ? entregaFormData.vehiculo.toString() : ''}
                                                onValueChange={(value) => setEntregaFormData(prev => ({ ...prev, vehiculo: value }))}
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
                                        <div>
                                            <Label>Fecha de salida</Label>
                                            <Input
                                                type='date'
                                                value={entregaFormData.fecha_salida}
                                                onChange={(e) => setEntregaFormData(prev => ({ ...prev, fecha_salida: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <Label>Fecha de retorno</Label>
                                            <Input
                                                type='date'
                                                value={entregaFormData.fecha_retorno}
                                                onChange={(e) => setEntregaFormData(prev => ({ ...prev, fecha_retorno: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <Label>Estado</Label>
                                            <Select
                                                value={entregaFormData.estado}
                                                onValueChange={(value) => setEntregaFormData(prev => ({ ...prev, estado: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Seleccionar estado' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='pendiente'>Pendiente</SelectItem>
                                                    <SelectItem value='ruta'>En ruta</SelectItem>
                                                    <SelectItem value='completada'>Completada</SelectItem>
                                                    <SelectItem value='devuelta'>Devuelta</SelectItem>
                                                    <SelectItem value='cancelada'>Cancelada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}
                    </div>
                </div>
            )}
            <div>
                <Button
                    type='submit'
                    className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
                >
                    Guardar
                </Button>
            </div>

            <Dialog open={openDetalleModal} onOpenChange={setOpenDetalleModal}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>
                            {editingDetalle ? 'Editar' : 'Agregar'} Producto
                        </DialogTitle>
                    </DialogHeader>
                    <AddEditDetalle
                        type={type}
                        initialData={editingDetalle}
                        onClose={() => setOpenDetalleModal(false)}
                        onSuccess={(nuevoDetalle) => {
                            if (detalleIndex !== null) {
                                const nuevosDetalles = [...detalles]
                                nuevosDetalles[detalleIndex] = nuevoDetalle
                                setDetalles(nuevosDetalles)
                            } else {
                                setDetalles([...detalles, nuevoDetalle])
                            }
                            const nuevoTotal = [...detalles, nuevoDetalle].reduce(
                                (sum, det) => sum + parseFloat(det.subtotal || 0),
                                0
                            )
                            setFormData(prev => ({ ...prev, total: nuevoTotal.toFixed(2) }))
                            setOpenDetalleModal(false)
                        }}
                    />
                </DialogContent>
            </Dialog>

        </form>
    )
}

export default AddEditRenSaleDeliver