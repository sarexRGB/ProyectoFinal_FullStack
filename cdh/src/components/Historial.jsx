import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getVentas, deleteVenta } from '@/services/VentaServices'
import { getAlquileres, deleteAlquiler } from '@/services/AlquilerServices'
import EditAlquilerVenta from './EditAlquilerVenta'

function Historial() {
    const navigate = useNavigate();
    const [historialType, setHistorialType] = useState('alquileres');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState('alquiler');
    const [selectedItem, setSelectedItem] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);
    const [alquileres, setAlquileres] = useState([]);
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        fetchAlquileres();
        fetchVentas();
    }, []);

    const fetchAlquileres = async () => {
        try {
            const response = await getAlquileres();
            setAlquileres(response.data);
        } catch (error) {
            console.error("Error al obtener historial:", error);
        }
    };
    const fetchVentas = async () => {
        try {
            const response = await getVentas();
            setVentas(response.data);
        } catch (error) {
            console.error("Error al obtener historial:", error);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalType(historialType === 'alquileres' ? 'alquiler' : 'venta');
        setOpenModal(true);
    };

    const handleDeleteClick = (item) => {
        setDeletedItem(item);
        setOpenDelete(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setOpenModal(false);
        if (historialType === 'alquileres') {
            fetchAlquileres();
        } else {
            fetchVentas();
        }
    };

    const handleSuccess = () => {
        if (historialType === 'alquileres') {
            fetchAlquileres();
        } else {
            fetchVentas();
        }
    };

    const confirmDelete = async () => {
        try {
            if (historialType === 'alquileres') {
                await deleteAlquiler(deletedItem.id);
            } else {
                await deleteVenta(deletedItem.id);
            }
            setOpenDelete(false);
            setDeletedItem(null);
            if (historialType === 'alquileres') {
                fetchAlquileres();
            } else {
                fetchVentas();
            }
        } catch (error) {
            console.error("Error eliminando item:", error);
        }
    };

    const getAlquilerStatus = (fechaInicio, fechaFin) => {
        const fechaActual = new Date();
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (fin < fechaActual) return { text: 'Finalizado', color: 'text-red-600 font-semibold' };
        if (inicio <= fechaActual && fin >= fechaActual) return { text: 'En curso', color: 'text-yellow-600 font-semibold' };
        return { text: 'Por comenzar', color: 'text-green-600' };
    };

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center gap-4'>
                    <Select value={historialType} onValueChange={setHistorialType}>
                        <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Tipo de historial' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="alquileres">Alquileres</SelectItem>
                            <SelectItem value="ventas">Ventas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Button variant='default' onClick={() => {
                        setOpenModal(true);
                        setModalType(historialType === 'alquileres' ? 'alquiler' : 'venta');
                        setSelectedItem(null);
                    }}>
                        <Plus size={16} className='mr-2' /> Agregar
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            {historialType === 'alquileres' ? (
                                <>
                                    <TableHead>Fecha Inicio</TableHead>
                                    <TableHead>Fecha Fin</TableHead>
                                    <TableHead>Estado</TableHead>
                                </>
                            ) : (
                                <TableHead>Fecha Venta</TableHead>
                            )}
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historialType === 'alquileres' ? (
                            alquileres.map((item) => {
                                const status = getAlquilerStatus(item.fecha_inicio, item.fecha_fin);
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.cliente?.nombre || 'Cliente'} {item.cliente?.apellido || ''}</TableCell>
                                        <TableCell>{item.fecha_inicio}</TableCell>
                                        <TableCell>{item.fecha_fin}</TableCell>
                                        <TableCell className={status.color}>{status.text}</TableCell>
                                        <TableCell>${item.total}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}>
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            ventas.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.cliente?.nombre || 'Cliente'} {item.cliente?.apellido || ''}</TableCell>
                                    <TableCell>{item.fecha}</TableCell>
                                    <TableCell>${item.total}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}>
                                            <Trash className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? 'Editar' : 'Agregar'} {modalType === 'alquiler' ? 'Alquiler' : 'Venta'}</DialogTitle>
                        <DialogDescription>
                            Complete los datos del formulario.
                        </DialogDescription>
                    </DialogHeader>
                    <EditAlquilerVenta
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
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el registro.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Historial