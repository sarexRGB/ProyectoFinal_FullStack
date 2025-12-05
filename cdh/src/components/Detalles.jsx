import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ArrowLeft, Edit, Trash, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getAlquiler, getDetallesAlquiler, deleteDetalleAlquiler } from '@/services/AlquilerServices'
import { getVenta, getDetallesPorVenta, deleteDetalleVenta } from '@/services/VentaServices'
import { getProducto } from '@/services/ProductosServices'
import EditDetalle from './EditDetalle'

function Detalles() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [tipo, setTipo] = useState('alquiler')
    const [item, setItem] = useState(null)
    const [detalles, setDetalles] = useState([])
    const [selectedDetalle, setSelectedDetalle] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) {
            fetchAlquiler()
            fetchProducto()
        }
    }, [id])

    const fetchAlquiler = async () => {
        setLoading(true)
        try {
            const response = await getAlquiler(id)
            setItem(response.data)
            setTipo('alquiler')
            await fetchDetallesAlquiler()
        } catch (error) {
            console.log("No es alquiler, intentando como venta...")
            fetchVenta()
        } finally {
            setLoading(false)
        }
    }

    const fetchVenta = async () => {
        setLoading(true)
        try {
            const response = await getVenta(id)
            setItem(response.data)
            setTipo('venta')
            await fetchDetallesVenta()
        } catch (error) {
            console.error("Error al obtener datos:", error)
            toast.error('Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    const fetchDetallesAlquiler = async () => {
        try {
            const response = await getDetallesAlquiler(id)
            setDetalles(response.data)
        } catch (error) {
            console.error("Error al obtener detalles:", error)
            toast.error('Error al cargar detalles')
        }
    }
    console.log("Detalles:", detalles);


    const fetchDetallesVenta = async () => {
        try {
            const response = await getDetallesPorVenta(id)
            setDetalles(response.data)
        } catch (error) {
            console.error("Error al obtener detalles:", error)
            toast.error('Error al cargar detalles')
        }
    }

    const fetchProducto = async () => {
        try {
            const response = await getProducto(id)
            setItem(response.data)
            setTipo('alquiler')
            await fetchDetallesAlquiler()
        } catch (error) {
            console.log("No es alquiler, intentando como venta...")
            fetchVenta()
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (detalle) => {
        setSelectedDetalle(detalle)
        setOpenEdit(true)
    }

    const handleCloseEdit = () => {
        setSelectedDetalle(null)
        setOpenEdit(false)
    }

    const handleSuccess = () => {
        if (tipo === 'alquiler') {
            fetchDetallesAlquiler()
        } else {
            fetchDetallesVenta()
        }
    }

    const handleDeleteClick = (detalle) => {
        setDeleteItem(detalle)
        setOpenDelete(true)
    }

    const confirmDelete = async () => {
        try {
            if (tipo === 'alquiler') {
                await deleteDetalleAlquiler(deleteItem.id)
            } else {
                await deleteDetalleVenta(deleteItem.id)
            }
            setOpenDelete(false)
            setDeleteItem(null)
            handleSuccess()
            toast.success('Detalle eliminado correctamente')
        } catch (error) {
            console.error("Error eliminando detalle:", error)
            toast.error('Error al eliminar el detalle')
        }
    }

    const getAlquilerStatus = (fechaInicio, fechaFin) => {
        const fechaActual = new Date()
        const inicio = new Date(fechaInicio)
        const fin = new Date(fechaFin)

        if (fin < fechaActual) return { text: 'Finalizado', color: 'text-red-600 font-semibold' }
        if (inicio <= fechaActual && fin >= fechaActual) return { text: 'En curso', color: 'text-yellow-600 font-semibold' }
        return { text: 'Por comenzar', color: 'text-green-600' }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Cargando...</p>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>No se encontraron datos</p>
            </div>
        )
    }

    const status = tipo === 'alquiler' ? getAlquilerStatus(item.fecha_inicio, item.fecha_fin) : null

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/historial')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">
                    Detalles de {tipo === 'alquiler' ? 'Alquiler' : 'Venta'} #{id}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-semibold">
                            {item.cliente?.nombre || 'N/A'} {item.cliente?.apellido || ''}
                        </p>
                    </div>
                    {tipo === 'alquiler' ? (
                        <>
                            <div>
                                <p className="text-sm text-gray-500">Fecha Inicio</p>
                                <p className="font-semibold">{item.fecha_inicio}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fecha Fin</p>
                                <p className="font-semibold">{item.fecha_fin}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Estado</p>
                                <p className={status.color}>{status.text}</p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-500">Fecha Venta</p>
                            <p className="font-semibold">{item.fecha}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-semibold text-lg">₡{item.total}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Productos</CardTitle>
                    <Button variant="default" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Detalle
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Cantidad</TableHead>
                                    {tipo === 'alquiler' && <TableHead>Precio Diario</TableHead>}
                                    {tipo === 'venta' && <TableHead>Precio Unitario</TableHead>}
                                    {tipo === 'venta' && <TableHead>Subtotal</TableHead>}
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {detalles.length > 0 ? (
                                    detalles.map((detalle) => (
                                        <TableRow key={detalle.id}>
                                            <TableCell>
                                                {detalle.producto_nombre || 'N/A'}
                                            </TableCell>
                                            <TableCell>{detalle.cantidad}</TableCell>
                                            {tipo === 'alquiler' && <TableCell>₡{detalle.precio_diario}</TableCell>}
                                            {tipo === 'venta' && <TableCell>₡{detalle.precio_unitario}</TableCell>}
                                            <TableCell className="font-semibold">₡{detalle.subtotal}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(detalle)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(detalle)}
                                                >
                                                    <Trash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No hay detalles registrados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal para editar detalle */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Detalle</DialogTitle>
                        <DialogDescription>
                            Modifique la cantidad o precio del producto/pieza.
                        </DialogDescription>
                    </DialogHeader>
                    <EditDetalle
                        type={tipo}
                        initialData={selectedDetalle}
                        onClose={handleCloseEdit}
                        onSuccess={handleSuccess}
                    />
                </DialogContent>
            </Dialog>

            {/* AlertDialog para confirmar eliminación */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el detalle.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Detalles