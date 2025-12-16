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
import { createAlquiler, updateAlquiler, getDetallesAlquiler, getEntregas, createEntrega, updateEntrega, createDetalleAlquiler, updateDetalleAlquiler, createRetiroCliente, uploadArchivoAlquiler } from '@/services/AlquilerServices'
import { createVenta, updateVenta, getDetallesPorVenta, createDetalleVenta, updateDetalleVenta } from '@/services/VentaServices'
import { getChoferes } from '@/services/UsuariosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { AuthContext } from '@/services/AuthContext'
import { Plus, Edit, Trash } from 'lucide-react'
import AddEditDetalle from '@/components/AddEditDetalle'

function AddEditRenSaleDeliver({ type, initialData, onClose, onSuccess }) {
    const { user } = React.useContext(AuthContext);
    const [clientes, setClientes] = useState([]);
    const [choferes, setChoferes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [realizarEntrega, setRealizarEntrega] = useState(false);
    const [clienteRetira, setClienteRetira] = useState(false);
    const [openDetalleModal, setOpenDetalleModal] = useState(false);
    const [editingDetalle, setEditingDetalle] = useState(null);
    const [detalleIndex, setDetalleIndex] = useState(null);
    const [formData, setFormData] = useState({
        cliente: '',
        fecha_inicio: '',
        fecha_fin: '',
        total: '',
        estado: 'Pendiente',
        contrato: '',
        descuento_tipo: 'NINGUNO',
        descuento_valor: '0',
    });
    const [entregaFormData, setEntregaFormData] = useState({
        chofer: '',
        vehiculo: '',
        fecha_entrega: '',
        hora_entrega: '',
        fecha_devolucion: '',
        hora_devolucion: '',
        estado: 'PENDIENTE',
    });
    const [detalleFormData, setDetalleFormData] = useState({
        producto: '',
        cantidad: '',
        precio_unitario: '',
        precio_diario: '',
        descuento_tipo: '',
        descuento_valor: '',
        subtotal: '',
    });
    const [entrega, setEntrega] = useState(null);

    useEffect(() => {
        fetchClientes()
        fetchChoferes()
        fetchVehiculos()
        fetchProductos()
        if (initialData) {
            setFormData({
                cliente: initialData.cliente?.id || initialData.cliente || '',
                proveedor: initialData.proveedor?.id || initialData.proveedor || '',
                fecha_inicio: initialData.fecha_inicio || '',
                fecha_fin: initialData.fecha_fin || '',
                total: initialData.total || '',
                estado: initialData.estado || 'Pendiente',
                contrato: initialData.contrato || '',
                descuento_tipo: initialData.descuento_tipo || 'NINGUNO',
                descuento_valor: initialData.descuento_valor || '0',
            })
            fetchDetallesExistentes()
            fetchEntregasExistentes()
        }
    }, [initialData])

    useEffect(() => {
        let total = 0
        if (type === 'alquiler' && formData.fecha_inicio && formData.fecha_fin) {
            const fechaInicio = new Date(formData.fecha_inicio)
            const fechaFin = new Date(formData.fecha_fin)
            const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24))

            total = detalles.reduce((sum, detalle) => {
                return sum + (parseFloat(detalle.subtotal || 0) * dias)
            }, 0)
        } else {
            total = detalles.reduce((sum, detalle) => {
                return sum + parseFloat(detalle.subtotal || 0)
            }, 0)
        }

        if (formData.descuento_tipo && formData.descuento_valor) {
            const descuentoValor = parseFloat(formData.descuento_valor) || 0
            if (formData.descuento_tipo === 'PORCENTAJE') {
                total = total * (1 - descuentoValor / 100)
            } else if (formData.descuento_tipo === 'FIJO') {
                total = total - descuentoValor
            }
        }

        setFormData(prev => ({ ...prev, total: Math.max(0, total).toFixed(2) }))
    }, [detalles, formData.fecha_inicio, formData.fecha_fin, formData.descuento_tipo, formData.descuento_valor, type]);

    useEffect(() => {
        if (type === 'alquiler' && formData.fecha_inicio && formData.fecha_fin) {
            setEntregaFormData(prev => ({
                ...prev,
                fecha_entrega: formData.fecha_inicio,
                fecha_devolucion: formData.fecha_fin
            }))
        }
    }, [formData.fecha_inicio, formData.fecha_fin, type])

    const fetchDetallesExistentes = async () => {
        try {
            const response = type === 'alquiler'
                ? await getDetallesAlquiler(initialData.id)
                : await getDetallesPorVenta(initialData.id)

            const detallesProcesados = response.data.map(detalle => {
                if (type === 'alquiler') {
                    const precio = parseFloat(detalle.precio_diario || detalle.precio_unitario || 0);
                    const cantidad = parseFloat(detalle.cantidad || 0);
                    return {
                        ...detalle,
                        subtotal: (precio * cantidad).toFixed(2)
                    };
                }
                return detalle;
            });

            setDetalles(detallesProcesados)
        } catch (error) {
            toast.error('Error al cargar los detalles')
        }
    };

    const fetchEntregasExistentes = async () => {
        try {
            if (type === 'alquiler' && initialData?.id) {
                const response = await getEntregas(initialData.id)
                if (response.data && response.data.length > 0) {
                    setRealizarEntrega(true)
                    const entregaData = response.data[0]
                    setEntrega(entregaData)

                    const fechaSalida = entregaData.fecha_salida ? entregaData.fecha_salida.split('T') : ['', ''];
                    const fechaRetorno = entregaData.fecha_retorno ? entregaData.fecha_retorno.split('T') : ['', ''];

                    setEntregaFormData({
                        chofer: entregaData.chofer?.id || entregaData.chofer || '',
                        vehiculo: entregaData.vehiculo?.id || entregaData.vehiculo || '',
                        fecha_entrega: fechaSalida[0],
                        hora_entrega: fechaSalida[1] ? fechaSalida[1].substring(0, 5) : '',
                        fecha_devolucion: fechaRetorno[0],
                        hora_devolucion: fechaRetorno[1] ? fechaRetorno[1].substring(0, 5) : '',
                        estado: entregaData.estado || 'PENDIENTE'
                    });
                }
            }
        } catch (error) {
            toast.error('Error al cargar las entregas')
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await getClientes()
            setClientes(response.data)
        } catch (error) {
            toast.error('Error al cargar los clientes')
        }
    };

    const fetchChoferes = async () => {
        try {
            const response = await getChoferes()
            setChoferes(response.data)
        } catch (error) {
            toast.error('Error al cargar los choferes')
        }
    };

    const fetchVehiculos = async () => {
        try {
            const response = await getVehiculos()
            setVehiculos(response.data)
        } catch (error) {
            toast.error('Error al cargar los vehiculos')
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await getProductos()
            setProductos(response.data)
        } catch (error) {
            toast.error('Error al cargar los productos')
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({ ...prev, contrato: file }))
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    };

    const handleAddDetalle = () => {
        setEditingDetalle(null)
        setDetalleIndex(null)
        setDetalleFormData({
            producto: '',
            cantidad: '',
            precio_unitario: '',
            precio_diario: '',
            descuento_tipo: '',
            descuento_valor: '',
            subtotal: '',
        })
        setOpenDetalleModal(true)
    };

    const handleEditDetalle = (detalle, index) => {
        setEditingDetalle(detalle)
        setDetalleIndex(index)
        setDetalleFormData({
            producto: detalle.producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            precio_diario: detalle.precio_diario,
            descuento_tipo: detalle.descuento_tipo,
            descuento_valor: detalle.descuento_valor,
            subtotal: detalle.subtotal,
        })
        setOpenDetalleModal(true)
    };

    const handleEntrega = (checked) => {
        setRealizarEntrega(checked)
    };

    const handleDeleteDetalle = (index) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index)
        setDetalles(nuevosDetalles)
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'fecha_fin' && formData.fecha_inicio && value < formData.fecha_inicio) {
            toast.error('La fecha final debe ser mayor a la fecha de inicio')
            return
        }
        setFormData(prev => ({ ...prev, [name]: value }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (detalles.length === 0) {
            toast.error('Debe agregar al menos un detalle')
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
                toast.error('Por favor, seleccione la fecha')
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

            if (!entregaFormData.hora_entrega) {
                toast.error('Por favor, seleccione la hora de entrega')
                return
            }

            if (!entregaFormData.fecha_devolucion) {
                toast.error('Por favor, seleccione la fecha de devolucion')
                return
            }
            if (new Date(entregaFormData.fecha_devolucion) < new Date(entregaFormData.fecha_entrega)) {
                toast.error('La fecha de devolucion debe ser posterior a la fecha de entrega')
                return
            }
        }

        console.log('Validaciones exitosas')

        try {
            let response

            if (type === 'alquiler') {
                let contratoUrl = formData.contrato
                if (formData.contrato instanceof File) {
                    console.log('Subiendo archivo...')
                    try {
                        const uploadResponse = await uploadArchivoAlquiler(formData.contrato)
                        contratoUrl = uploadResponse.data.url
                        console.log('Archivo subido exitosamente')
                    } catch (error) {
                        console.error('Error al subir el archivo', error)
                        toast.error('Error al subir el archivo')
                        throw uploadError
                    }
                }

                const alquilerData = {
                    cliente: parseInt(formData.cliente),
                    fecha_inicio: formData.fecha_inicio,
                    fecha_fin: formData.fecha_fin,
                    total: parseFloat(formData.total),
                    estado: formData.estado,
                    contrato: contratoUrl || null,
                    descuento_tipo: formData.descuento_tipo || 'NINGUNO',
                    descuento_valor: parseFloat(formData.descuento_valor) || 0
                }

                console.log('Enviando alquiler:', alquilerData)

                if (initialData) {
                    response = await updateAlquiler(initialData.id, alquilerData)
                    console.log('Alquiler actualizado:', response.data)
                } else {
                    response = await createAlquiler(alquilerData)
                    console.log('Alquiler creado:', response.data)
                }

                for (const detalle of detalles) {
                    const productoId = parseInt(detalle.producto)
                    if (isNaN(productoId)) {
                        console.error('Invalid producto ID:', detalle.producto, 'Detalle:', detalle)
                        throw new Error(`Producto inválido en detalle`)
                    }

                    const detalleData = {
                        alquiler: response.data.id,
                        producto: productoId,
                        cantidad: parseInt(detalle.cantidad),
                        precio_diario: parseFloat(detalle.precio_diario || detalle.precio_unitario),
                        descuento_tipo: detalle.descuento_tipo || 'NINGUNO',
                        descuento_valor: parseFloat(detalle.descuento_valor) || 0
                    }

                    console.log('Guardando detalle:', detalleData)

                    try {
                        if (detalle.id) {
                            await updateDetalleAlquiler(detalle.id, detalleData)
                            console.log('Detalle actualizado:', detalle.id)
                        } else {
                            const detalleResponse = await createDetalleAlquiler(detalleData)
                            console.log('Detalle creado:', detalleResponse.data)
                        }
                    } catch (detalleError) {
                        console.error('Error al guardar detalle:', detalleError)
                        console.error('Detalle data:', detalleData)
                        console.error('Error response:', detalleError.response?.data)
                        throw new Error(`Error al guardar detalle: ${detalleError.response?.data?.message || detalleError.message}`)
                    }
                }

                if (realizarEntrega) {
                    const entregaData = {
                        alquiler: response.data.id,
                        chofer: parseInt(entregaFormData.chofer),
                        vehiculo: parseInt(entregaFormData.vehiculo),
                        fecha_salida: `${entregaFormData.fecha_entrega}T${entregaFormData.hora_entrega}:00`,
                        fecha_retorno: `${entregaFormData.fecha_devolucion}T${entregaFormData.hora_devolucion}:00`,
                        estado: entregaFormData.estado
                    }

                    console.log('Guardando entrega:', entregaData)

                    try {
                        if (entrega && entrega.id) {
                            await updateEntrega(entrega.id, entregaData)
                            console.log('Entrega actualizada:', entrega.id)
                        } else {
                            const entregaResponse = await createEntrega(entregaData)
                            console.log('Entrega creada:', entregaResponse.data)
                        }
                    } catch (entregaError) {
                        console.error('Error al guardar entrega:', entregaError)
                        console.error('Entrega data:', entregaData)
                        console.error('Error response:', entregaError.response?.data)
                        throw new Error(`Error al guardar entrega: ${entregaError.response?.data?.message || entregaError.message}`)
                    }
                }

                toast.success(initialData ? 'Alquiler actualizado correctamente' : 'Alquiler creado correctamente')

                if (clienteRetira && !initialData && user) {
                    try {
                        await createRetiroCliente({
                            alquiler: response.data.id,
                            cliente: parseInt(formData.cliente),
                            fecha: new Date().toISOString(),
                            estado: 'PENDIENTE'
                        })
                    } catch (error) {
                        console.error('Error al crear el retiro de cliente', error)
                        toast.error('Error al crear el retiro de cliente')
                        throw error
                    }
                }
            } else if (type === 'venta') {
                const ventaData = {
                    cliente: parseInt(formData.cliente),
                    fecha: formData.fecha,
                    total: parseFloat(formData.total),
                    descuento_tipo: formData.descuento_tipo || 'NINGUNO',
                    descuento_valor: parseFloat(formData.descuento_valor) || 0
                }

                if (initialData) {
                    response = await updateVenta(initialData.id, ventaData)
                } else {
                    response = await createVenta(ventaData)
                }

                for (const detalle of detalles) {
                    const detalleData = {
                        venta: response.data.id,
                        producto: parseInt(detalle.producto),
                        cantidad: parseFloat(detalle.cantidad),
                        precio_unitario: parseFloat(detalle.precio_unitario),
                        descuento_tipo: detalle.descuento_tipo || 'NINGUNO',
                        descuento_valor: parseFloat(detalle.descuento_valor) || 0
                    }

                    if (detalle.id) {
                        await updateDetalleVenta(detalle.id, detalleData)
                    } else {
                        await createDetalleVenta(detalleData)
                    }
                }

                toast.success(initialData ? 'Venta actualizada correctamente' : 'Venta creada correctamente')

                if (clienteRetira && !initialData && user) {
                    try {
                        await createRetiroCliente({
                            venta: response.data.id,
                            cliente: parseInt(formData.cliente),
                            empleado: user.id
                        })
                    } catch (error) {
                        console.error('Error al crear retiro de cliente:', error)
                    }
                }
            }

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error al guardar:', error)
            toast.error('Error al guardar los datos')
        }
    };

    const clienteNombre = (id) => {
        const cliente = clientes.find((cliente) => cliente.id === id)
        return cliente ? `${cliente.nombre} ${cliente.primer_apellido} ${cliente.segundo_apellido}` : ''
    }

    const choferNombre = (id) => {
        const chofer = choferes.find((chofer) => chofer.id === id || chofer.empleado === id)
        return chofer ? chofer.empleado_nombre : ''
    }

    const vehiculoNombre = (id) => {
        const vehiculo = vehiculos.find((vehiculo) => vehiculo.id === id)
        return vehiculo ? `${vehiculo.modelo} ${vehiculo.placa}` : ''
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4 max-h-screen'>
            <div className='space-y-2'>
                <Label htmlFor='cliente'>Cliente</Label>
                <Select
                    value={formData.cliente}
                    onValueChange={(value) => handleSelectChange('cliente', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Seleccionar cliente' />
                    </SelectTrigger>
                    <SelectContent>
                        {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
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
                                min={new Date().toISOString().split('T')[0]}
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
                            <Label>Contrato</Label>
                            <div className='flex items-center gap-2'>
                                <Input
                                    type='file'
                                    id='contrato'
                                    name='contrato'
                                    onChange={handleFileChange}
                                    required={!initialData}
                                    className='hidden'
                                />
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => document.getElementById('contrato').click()}
                                >
                                    Seleccionar archivo
                                </Button>
                                <span className='text-sm text-muted-foreground'>
                                    {formData.contrato instanceof File
                                        ? formData.contrato.name
                                        : (formData.contrato ? 'Contrato actual' : 'Sin archivo seleccionado')}
                                </span>
                            </div>
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

            <div className='space-y-4 border-t pt-4'>
                <h3 className='font-semibold text-lg'>Descuento Global</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='descuento_tipo'>Tipo de Descuento</Label>
                        <Select
                            value={formData.descuento_tipo}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, descuento_tipo: value }))}
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
                                {formData.descuento_tipo === 'PORCENTAJE' ? 'Porcentaje' : 'Monto'}
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
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <Label>Fecha entrega</Label>
                                                <Input
                                                    type='date'
                                                    value={entregaFormData.fecha_entrega}
                                                    onChange={(e) => setEntregaFormData(prev => ({ ...prev, fecha_entrega: e.target.value }))}
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <Label>Hora de entrega</Label>
                                                <Input
                                                    type='time'
                                                    value={entregaFormData.hora_entrega}
                                                    onChange={(e) => setEntregaFormData(prev => ({ ...prev, hora_entrega: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div>
                                                <Label>Fecha devolución</Label>
                                                <Input
                                                    type='date'
                                                    value={entregaFormData.fecha_devolucion}
                                                    onChange={(e) => setEntregaFormData(prev => ({ ...prev, fecha_devolucion: e.target.value }))}
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <Label>Hora de devolución</Label>
                                                <Input
                                                    type='time'
                                                    value={entregaFormData.hora_devolucion}
                                                    onChange={(e) => setEntregaFormData(prev => ({ ...prev, hora_devolucion: e.target.value }))}
                                                />
                                            </div>
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
                                                    <SelectItem value='PENDIENTE'>Pendiente</SelectItem>
                                                    <SelectItem value='RUTA'>En ruta</SelectItem>
                                                    <SelectItem value='COMPLETADA'>Completada</SelectItem>
                                                    <SelectItem value='DEVUELTA'>Devuelta</SelectItem>
                                                    <SelectItem value='CANCELADA'>Cancelada</SelectItem>
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