import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getVentas, deleteVenta, getDetallesPorVenta, updateDetalleVenta } from '@/services/VentaServices'
import { getAlquileres, deleteAlquiler, getDetallesAlquiler, updateDetalleAlquiler, getEntregas, getRetirosCliente, getDevoluciones } from '@/services/AlquilerServices'
import { getChoferes } from '@/services/UsuariosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { getClientes } from '@/services/ClientesServices'
import AddEditRenSaleDeliver from './AddEditRenSaleDeliver'
import EditEntrega from './EditEntrega'
import { format } from 'date-fns'
const result = format(new Date(), 'MM/dd/yyyy')

function Historial() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const historialType = searchParams.get('tab') || 'alquileres'
    const [openModal, setOpenModal] = useState(false)
    const [modalType, setModalType] = useState('alquiler')
    const [selectedItem, setSelectedItem] = useState(null)
    const [deletedItem, setDeletedItem] = useState(null)
    const [alquileres, setAlquileres] = useState([])
    const [ventas, setVentas] = useState([])
    const [clientes, setClientes] = useState([])
    const [entregas, setEntregas] = useState([])
    const [devoluciones, setDevoluciones] = useState([])
    const [retirosCliente, setRetirosCliente] = useState([])
    const [deliveryType, setDeliveryType] = useState('chofer')
    const [choferes, setChoferes] = useState([])
    const [vehiculos, setVehiculos] = useState([])
    const [openDelete, setOpenDelete] = useState(false)
    const [openEditEntrega, setOpenEditEntrega] = useState(false)
    const [selectedEntrega, setSelectedEntrega] = useState(null)

    const fetchAlquileres = async () => {
        try {
            const response = await getAlquileres()
            setAlquileres(response.data)
        } catch (error) {
            console.log('Error al obtener alquileres', error)
            toast.error('Error al obtener alquileres')
        }
    }

    const fetchVentas = async () => {
        try {
            const response = await getVentas()
            setVentas(response.data)
        } catch (error) {
            console.log('Error al obtener ventas', error)
            toast.error('Error al obtener ventas')
        }
    }

    const fetchEntregas = async () => {
        try {
            const response = await getEntregas()
            setEntregas(response.data)
        } catch (error) {
            console.log('Error al obtener entregas', error)
            toast.error('Error al obtener entregas')
        }
    }

    const fetchRetirosCliente = async () => {
        try {
            const response = await getRetirosCliente()
            setRetirosCliente(response.data)
        } catch (error) {
            console.log('Error al obtener retiros de cliente', error)
            toast.error('Error al obtener retiros de cliente')
        }
    }

    const fetchDevoluciones = async () => {
        try {
            const response = await getDevoluciones()
            setDevoluciones(response.data)
        } catch (error) {
            console.log('Error al obtener devoluciones', error)
            toast.error('Error al obtener devoluciones')
        }
    }

    const fetchChoferes = async () => {
        try {
            const response = await getChoferes()
            setChoferes(response.data)
        } catch (error) {
            console.log('Error al obtener choferes', error)
            toast.error('Error al obtener choferes')
        }
    }

    const fetchVehiculos = async () => {
        try {
            const response = await getVehiculos()
            setVehiculos(response.data)
        } catch (error) {
            console.log('Error al obtener vehiculos', error)
            toast.error('Error al obtener vehiculos')
        }
    }

    const fetchClientes = async () => {
        try {
            const response = await getClientes()
            setClientes(response.data)
        } catch (error) {
            console.log('Error al obtener clientes', error)
            toast.error('Error al obtener clientes')
        }
    }

    useEffect(() => {
        fetchAlquileres()
        fetchVentas()   
        fetchClientes()
        fetchEntregas()
        fetchRetirosCliente()
        fetchDevoluciones()
        fetchChoferes()
        fetchVehiculos()
    }, [])

    const cliente = (id, item) => {
        if (item && item.cliente_nombre) return item.cliente_nombre;

        const cliente = clientes.find((cliente) => cliente.id === id)
        return cliente ? `${cliente.nombre} ${cliente.primer_apellido} ${cliente.segundo_apellido}` : 'Cliente Desconocido'
    }

    const chofer = (id) => {
        const chofer = choferes.find((chofer) => chofer.id === id || chofer.empleado === id)
        return chofer ? chofer.empleado_nombre : ''
    }

    const vehiculo = (id) => {
        const vehiculo = vehiculos.find((vehiculo) => vehiculo.id === id)
        return vehiculo ? `${vehiculo.modelo} ${vehiculo.placa}` : ''
    }

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A'
        const [datePart, timePart] = dateTimeString.split('T')
        if (!datePart || !timePart) return dateTimeString

        const [year, month, day] = datePart.split('-')
        const [hours, minutes] = timePart.split(':')

        return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedItem(null)
        if (modalType === 'alquiler') {
            fetchAlquileres()
        } else if (modalType === 'venta') {
            fetchVentas()
            fetchDetallesVenta()
        } else if (modalType === 'entrega') {
            fetchEntregas()
            fetchChoferes()
            fetchVehiculos()
        }
    }
    const handleSuccess = () => {
        if (modalType === 'alquiler') {
            fetchAlquileres()
        } else if (modalType === 'venta') {
            fetchVentas()
            fetchDetallesVenta()
        } else if (modalType === 'entrega') {
            fetchEntregas()
            fetchChoferes()
            fetchVehiculos()
        }
    }

    const handleEdit = (item) => {
        setSelectedItem(item)
        setModalType(historialType === 'alquileres' ? 'alquiler' : 'venta')
        setOpenModal(true)
    }

    const handleDeleteClick = (item) => {
        setDeletedItem(item)
        setOpenDelete(true)
    }

    const confirmDelete = async () => {
        try {
            if (historialType === 'alquileres') {
                await deleteAlquiler(deletedItem.id)
            } else if (historialType === 'ventas') {
                await deleteVenta(deletedItem.id)
            }
            setOpenDelete(false)
            setDeletedItem(null)
            if (historialType === 'alquileres') {
                fetchAlquileres()
            } else if (historialType === 'ventas') {
                fetchVentas()
                fetchDetallesVenta()
            }
            toast.success('Registro eliminado correctamente')
        } catch (error) {
            console.log('Error eliminando registro', error)
            toast.error('Error al eliminar en registro')
        }
    }

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold'>
                    {historialType === 'alquileres' ? 'Alquileres' :
                        historialType === 'ventas' ? 'Ventas' :
                            'Entregas'}
                </h2>

                <div>
                    {historialType === 'alquileres' &&
                        <Button variant='default' onClick={() => {
                            setOpenModal(true)
                            setModalType('alquiler')
                            setSelectedItem(null)
                        }}>
                            <Plus size={16} className='mr-2' />
                            Agregar alquiler
                        </Button>
                    }
                    {historialType === 'ventas' &&
                        <Button variant='default' onClick={() => {
                            setOpenModal(true)
                            setModalType('venta')
                            setSelectedItem(null)
                        }}>
                            <Plus size={16} className='mr-2' />
                            Agregar venta
                        </Button>
                    }
                    {historialType === 'entregas' &&
                        <Select value={deliveryType} onValueChange={setDeliveryType}>
                            <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder='Tipo de entrega' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='chofer'>Entregas con Chofer</SelectItem>
                                <SelectItem value='devoluciones'>Devoluciones</SelectItem>
                                <SelectItem value='cliente'>Retiros por Cliente</SelectItem>
                            </SelectContent>
                        </Select>
                    }
                </div>
            </div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {historialType === 'alquileres' &&
                                <>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha Inicio</TableHead>
                                    <TableHead>Fecha Fin</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </>
                            }
                            {historialType === 'ventas' &&
                                <>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha Venta</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </>
                            }
                            {historialType === 'entregas' &&
                                <>
                                    {deliveryType === 'chofer' ? (
                                        <>
                                            <TableHead>Chofer</TableHead>
                                            <TableHead>Vehiculo</TableHead>
                                            <TableHead>Fecha Entrega</TableHead>
                                            <TableHead>Fecha Devolucion</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </>
                                    ) : deliveryType === 'devoluciones' ? (
                                        <>
                                            <TableHead>Chofer</TableHead>
                                            <TableHead>Vehículo</TableHead>
                                            <TableHead>Fecha Devolución</TableHead>
                                            <TableHead>Observaciones</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </>
                                    ) : (
                                        <>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Empleado</TableHead>
                                            <TableHead>Fecha Retiro</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </>
                                    )}
                                </>
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historialType === 'alquileres' &&
                            alquileres.map((alquiler) => (
                                <TableRow
                                    key={alquiler.id}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => navigate(`/admin/historial/detalles/${alquiler.id}?type=alquiler`)}
                                >
                                    <TableCell>
                                        {cliente(alquiler.cliente, alquiler)}
                                    </TableCell>
                                    <TableCell>{alquiler.fecha_inicio}</TableCell>
                                    <TableCell>{alquiler.fecha_fin}</TableCell>
                                    <TableCell>{alquiler.estado}</TableCell>
                                    <TableCell>
                                        ₡{alquiler.total}</TableCell>
                                    <TableCell className='text-right'>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(alquiler);
                                            }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(alquiler);
                                            }}
                                        >
                                            <Trash className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {historialType === 'ventas' &&
                            ventas.map((venta) => (
                                <TableRow
                                    key={venta.id}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => navigate(`/admin/historial/detalles/${venta.id}?type=venta`)}
                                >
                                    <TableCell>
                                        {cliente(venta.cliente, venta)}
                                    </TableCell>
                                    <TableCell>{venta.fecha_venta}</TableCell>
                                    <TableCell>₡{venta.total}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(venta);
                                            }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(venta);
                                            }}
                                        >
                                            <Trash className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {historialType === 'entregas' && deliveryType === 'chofer' &&
                            entregas.map((entrega) => (
                                <TableRow
                                    key={entrega.id}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => navigate(`/admin/historial/detalles/${entrega.alquiler}?type=alquiler`)}
                                >
                                    <TableCell>{chofer(entrega.chofer)}</TableCell>
                                    <TableCell>{vehiculo(entrega.vehiculo)}</TableCell>
                                    <TableCell>{formatDateTime(entrega.fecha_salida)}</TableCell>
                                    <TableCell>{formatDateTime(entrega.fecha_retorno)}</TableCell>
                                    <TableCell>{entrega.estado}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedEntrega(entrega);
                                                setOpenEditEntrega(true);
                                            }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {historialType === 'entregas' && deliveryType === 'cliente' &&
                            retirosCliente.map((retiro) => (
                                <TableRow
                                    key={retiro.id}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => {
                                        const tipo = retiro.alquiler ? 'alquiler' : 'venta'
                                        const id = retiro.alquiler || retiro.venta
                                        navigate(`/admin/historial/detalles/${id}?type=${tipo}`)
                                    }}
                                >
                                    <TableCell>{cliente(retiro.cliente, retiro)}</TableCell>
                                    <TableCell>
                                        {retiro.empleado_nombre} {retiro.empleado_apellido}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(retiro.fecha_retiro).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {retiro.alquiler ? 'Alquiler' : 'Venta'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}>
                                            Ver {retiro.alquiler ? 'Alquiler' : 'Venta'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))

                        }
                        {historialType === 'entregas' && deliveryType === 'devoluciones' &&
                            devoluciones.map((devolucion) => (
                                <TableRow
                                    key={devolucion.id}
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => navigate(`/admin/historial/detalles/${devolucion.alquiler}?type=alquiler`)}
                                >
                                    <TableCell>{chofer(devolucion.chofer)}</TableCell>
                                    <TableCell>{vehiculo(devolucion.vehiculo)}</TableCell>
                                    <TableCell>{formatDateTime(devolucion.fecha)}</TableCell>
                                    <TableCell>{devolucion.observaciones || 'Sin observaciones'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className='max-w-4xl max-h-screen overflow-y-auto min-w-3xl'>
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? 'Editar' : 'Agregar'} {modalType === historialType}</DialogTitle>
                        <DialogDescription>
                            Complete los datos del formulario
                        </DialogDescription>
                    </DialogHeader>
                    <AddEditRenSaleDeliver
                        type={modalType}
                        initialData={selectedItem}
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro que deseas eliminar este registro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Una vez eliminado, no podrás recuperar el registro.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className='bg-red-600 hover:bg-red-700'>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={openEditEntrega} onOpenChange={setOpenEditEntrega}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>Editar Entrega</DialogTitle>
                        <DialogDescription>
                            Actualiza la información de la entrega
                        </DialogDescription>
                    </DialogHeader>
                    <EditEntrega
                        entrega={selectedEntrega}
                        onClose={() => setOpenEditEntrega(false)}
                        onSuccess={() => {
                            fetchEntregas()
                            setOpenEditEntrega(false)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default Historial