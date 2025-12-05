import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getVentas, deleteVenta, getDetallesPorVenta, updateDetalleVenta } from '@/services/VentaServices'
import { getAlquileres, deleteAlquiler, getDetallesAlquiler, updateDetalleAlquiler, getEntregas } from '@/services/AlquilerServices'
import { getChoferes } from '@/services/UsuariosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { getClientes } from '@/services/ClientesServices'
import AddEditRenSaleDeliver from './AddEditRenSaleDeliver'
import { format } from 'date-fns'
const result = format(new Date(), 'MM/dd/yyyy')

function Historial() {
    const navigate = useNavigate()
    const [historialType, setHistorialType] = useState('alquileres')
    const [openModal, setOpenModal] = useState(false)
    const [modalType, setModalType] = useState('alquiler')
    const [selectedItem, setSelectedItem] = useState(null)
    const [deletedItem, setDeletedItem] = useState(null)
    const [alquileres, setAlquileres] = useState([])
    const [detallesAlquiler, setDetallesAlquiler] = useState([])
    const [ventas, setVentas] = useState([])
    const [detallesVenta, setDetallesVenta] = useState([])
    const [clientes, setClientes] = useState([])
    const [entregas, setEntregas] = useState([])
    const [choferes, setChoferes] = useState([])
    const [vehiculos, setVehiculos] = useState([])
    const [openDelete, setOpenDelete] = useState(false)

    const fetchAlquileres = async () => {
        try {
            const response = await getAlquileres()
            setAlquileres(response.data)
        } catch (error) {
            console.log('Error al obtener alquileres', error)
            toast.error('Error al obtener alquileres')
        }
    }

    const fetchDetallesAlquiler = async () => {
        try {
            const response = await getDetallesAlquiler()
            setDetallesAlquiler(response.data)
        } catch (error) {
            console.log('Error al obtener detalles de alquiler', error)
            toast.error('Error al obtener detalles de alquiler')
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

    const fetchDetallesVenta = async () => {
        try {
            const response = await getDetallesPorVenta()
            setDetallesVenta(response.data)
        } catch (error) {
            console.log('Error al obtener detalles de venta', error)
            toast.error('Error al obtener detalles de venta')
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
        fetchDetallesAlquiler()
        fetchVentas()
        fetchDetallesVenta()
        fetchClientes()
        fetchEntregas()
        fetchChoferes()
        fetchVehiculos()
    }, [])

    const cliente = (id) => {
        const cliente = clientes.find((cliente) => cliente.id === id)
        return cliente ? `${cliente.nombre} ${cliente.primer_apellido} ${cliente.segundo_apellido}` : ''
    }

    const chofer = (id) => {
        const chofer = choferes.find((chofer) => chofer.id === id)
        return chofer ? `${chofer.nombre} ${chofer.primer_apellido} ${chofer.segundo_apellido}` : ''
    }

    const vehiculo = (id) => {
        const vehiculo = vehiculos.find((vehiculo) => vehiculo.id === id)
        return vehiculo ? `${vehiculo.modelo} ${vehiculo.placa}` : ''
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setSelectedItem(null)
        if (modalType === 'alquiler') {
            fetchAlquileres()
            fetchDetallesAlquiler()
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
            fetchDetallesAlquiler()
        } else if (modalType === 'venta') {
            fetchVentas()
            fetchDetallesVenta()
        } else if (modalType === 'entrega') {
            fetchEntregas()
            fetchChoferes()
            fetchVehiculos()
        }
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
                fetchDetallesAlquiler()
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
                <div className='flex items-center gap-4'>
                    <Select value={historialType} onValueChange={setHistorialType}>
                        <SelectTrigger className='w-3xs'>
                            <SelectValue placeholder='Tipo de historial' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="alquileres">Alquileres</SelectItem>
                            <SelectItem value="ventas">Ventas</SelectItem>
                            <SelectItem value="entregas">Entregas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

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
                                </>
                            }
                            {historialType === 'ventas' &&
                                <>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha Venta</TableHead>
                                    <TableHead>Total</TableHead>
                                </>
                            }
                            {historialType === 'entregas' &&
                                <>
                                    <TableHead>Chofer</TableHead>
                                    <TableHead>Vehiculo</TableHead>
                                    <TableHead>Fecha Salida</TableHead>
                                    <TableHead>Fecha Retorno</TableHead>
                                    <TableHead>Estado</TableHead>
                                </>
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historialType === 'alquileres' &&
                            alquileres.map((alquiler) => (
                                <TableRow key={alquiler.id}>
                                    <TableCell>
                                        {cliente(alquiler.cliente)}
                                    </TableCell>
                                    <TableCell>{alquiler.fecha_inicio}</TableCell>
                                    <TableCell>{alquiler.fecha_fin}</TableCell>
                                    <TableCell>{alquiler.estado}</TableCell>
                                    <TableCell>₡{alquiler.total}</TableCell>
                                    <TableCell className='text-right'>
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(item);
                                        }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(item);
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
                                <TableRow key={venta.id}>
                                    <TableCell>
                                        {cliente(venta.cliente)}
                                    </TableCell>
                                    <TableCell>{venta.fecha_venta}</TableCell>
                                    <TableCell>₡{venta.total}</TableCell>
                                    <TableCell>
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(item);
                                        }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(item);
                                        }}
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {historialType === 'entregas' &&
                            entregas.map((entrega) => (
                                <TableRow key={entrega.id}>
                                    <TableCell>{chofer(entrega.chofer)}</TableCell>
                                    <TableCell>{vehiculo(entrega.vehiculo)}</TableCell>
                                    <TableCell>{entrega.fecha_salida}</TableCell>
                                    <TableCell>{entrega.fecha_retorno}</TableCell>
                                    <TableCell>{entrega.estado}</TableCell>
                                    <TableCell>
                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(item);
                                        }}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
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
        </div>
    )
}

export default Historial