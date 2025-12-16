import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducto, deleteProducto, getCategorias } from '@/services/ProductosServices'
import { getInventario, getPieza, getInventarioPieza, deletePieza, deleteInventario, deleteInventarioPieza } from '@/services/InventarioServices'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AddProducto from '@/components/AddProducto'
import AddPieza from '@/components/AddPieza'
import { ArrowLeft, Package, Warehouse, Pencil, Trash } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

function InfoDetallada() {
    const { id, tipo } = useParams();
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [producto, setProducto] = useState(null);
    const [inventarios, setInventarios] = useState([]);
    const [inventarioPiezas, setInventarioPiezas] = useState([]);
    const [pieza, setPieza] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchProductoDetalle();
        fetchCategorias();
    }, [id, tipo]);

    const fetchCategorias = async () => {
        try {
            const response = await getCategorias();
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const fetchProductoDetalle = async () => {
        try {
            setLoading(true);
            if (tipo === 'producto') {
                const productoResponse = await getProducto(id);
                setProducto(productoResponse.data);

                const inventarioResponse = await getInventario({ producto: id });

                const listaInventario = Array.isArray(inventarioResponse.data)
                    ? inventarioResponse.data
                    : (inventarioResponse.data.results || []);

                setInventarios(listaInventario);
            } else if (tipo === 'pieza') {
                const piezaResponse = await getPieza(id);
                setPieza(piezaResponse.data);

                const inventarioPiezaResponse = await getInventarioPieza({ pieza: id });

                const listaInventarioPiezas = Array.isArray(inventarioPiezaResponse.data)
                    ? inventarioPiezaResponse.data
                    : (inventarioPiezaResponse.data.results || []);

                setInventarioPiezas(listaInventarioPiezas);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error al cargar producto:', error);
            setError('No se pudo cargar la información del producto');
            toast.error('No se pudo cargar la información del producto');
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setModalType(tipo);
        setModalOpen(true);
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (tipo === 'producto') {
                await deleteProducto(id);
            } else if (tipo === 'pieza') {
                await deletePieza(id);
            }
            toast.success('Eliminado correctamente');
            navigate('/inventario');
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar el ítem');
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalType(null);

        fetchProductoDetalle();
        toast.success('Producto editado correctamente');
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p className='text-lg'>Cargando información del producto...</p>
            </div>
        );
    }

    const item = tipo === 'producto' ? producto : pieza;

    if (error || !item) {
        return (
            <div className='p-6'>
                <Button variant='outline' onClick={() => navigate(`/admin/inventario?tab=${tipo}s`)}>
                    <ArrowLeft size={16} className='mr-2' /> Volver
                </Button>
                <div className='mt-4 text-center'>
                    <p className='text-red-500'>{error || 'Ítem no encontrado'}</p>
                </div>
            </div>
        );
    }

    const totalStock = inventarios.reduce((sum, inv) => sum + ((tipo === 'producto' ? inv.stock_disponible : inv.stock) || 0), 0);

    return (
        <div className='p-6 space-y-6'>
            <div className='flex items-center justify-between'>
                <Button variant='outline' onClick={() => navigate(`/admin/inventario?tab=${tipo}s`)}>
                    <ArrowLeft size={16} className='mr-2' /> Volver al Inventario
                </Button>
                <div className='flex gap-2'>
                    <Button variant='outline' onClick={handleEdit}>
                        <Pencil size={16} className='mr-2' /> Editar {tipo === 'producto' ? 'Producto' : 'Pieza'}
                    </Button>
                    <Button variant='destructive' onClick={handleDelete}>
                        <Trash size={16} className='mr-2' /> Eliminar {tipo === 'producto' ? 'Producto' : 'Pieza'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Package size={24} />
                        {item.nombre}
                    </CardTitle>
                    <CardDescription>{item.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {tipo === 'producto' && (
                            <>
                                <div>
                                    <p className='text-sm text-gray-500'>Categoría</p>
                                    <p className='font-semibold'>
                                        {categorias.find(c => c.id === (item.categoria?.id || item.categoria))?.nombre || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Estado</p>
                                    <span className={`inline-block px-2 py-1 rounded text-xs ${item.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                                        item.estado === 'ALQUILADO' ? 'bg-blue-100 text-blue-800' :
                                            item.estado === 'REPARACIÓN' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item.estado}
                                    </span>
                                </div>
                            </>
                        )}
                        {tipo === 'producto' && (
                            <div>
                                <p className='text-sm text-gray-500'>Imagen</p>
                                {item.imagen ? (
                                    <a href={item.imagen} target='_blank' rel='noopener noreferrer'
                                        className='text-blue-600 hover:underline text-sm'>
                                        Ver imagen
                                    </a>
                                ) : (
                                    <p className='text-gray-400 text-sm'>Sin imagen</p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {tipo === 'producto' && (
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            Precios y Modalidades
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Modalidad</TableHead>
                                    <TableHead>Precio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {item.precio_venta && (
                                    <TableRow>
                                        <TableCell className='font-medium'>Venta</TableCell>
                                        <TableCell className='text-green-600 font-semibold'>
                                            ₡{parseFloat(item.precio_venta).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {item.precio_alquiler && (
                                    <TableRow>
                                        <TableCell className='font-medium'>Alquiler (por día)</TableCell>
                                        <TableCell className='text-blue-600 font-semibold'>
                                            ₡{parseFloat(item.precio_alquiler).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!item.precio_venta && !item.precio_alquiler && (
                                    <TableRow>
                                        <TableCell colSpan={2} className='text-center text-gray-500'>
                                            No hay precios configurados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Warehouse size={24} />
                        Inventario e historial del {tipo === 'producto' ? 'producto' : 'pieza'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {(() => {
                        const itemsToShow = tipo === 'producto' ? inventarios : inventarioPiezas;

                        if (itemsToShow.length > 0) {
                            return (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bodega</TableHead>
                                            {tipo === 'pieza' && <TableHead>Ubicación</TableHead>}
                                            <TableHead>Stock {tipo === 'producto' ? 'Disponible' : ''}</TableHead>
                                            {tipo === 'producto' && <TableHead>Stock Alquilado</TableHead>}
                                            <TableHead>Stock Mínimo</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Última Actualización</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {itemsToShow.map((inv) => {
                                            const stock = tipo === 'producto' ? (inv.stock_disponible || 0) : (inv.stock || 0);
                                            const stockBajo = stock < (inv.minimo_stock || 0);
                                            const sinStock = stock === 0;

                                            return (
                                                <TableRow key={inv.id}>
                                                    <TableCell className='font-medium'>
                                                        {inv.bodega_nombre || inv.bodega?.nombre || 'N/A'}
                                                    </TableCell>
                                                    {tipo === 'pieza' && <TableCell>{inv.ubicacion || '-'}</TableCell>}
                                                    <TableCell className={`font-semibold ${sinStock ? 'text-gray-500' :
                                                        stockBajo ? 'text-orange-600' :
                                                            'text-green-600'
                                                        }`}>
                                                        {stock}
                                                    </TableCell>
                                                    {tipo === 'producto' && (
                                                        <TableCell className='font-semibold text-blue-600'>
                                                            {inv.stock_alquilado || 0}
                                                        </TableCell>
                                                    )}
                                                    <TableCell>{inv.minimo_stock || 0}</TableCell>
                                                    <TableCell>
                                                        <span className={`text-xs px-2 py-1 rounded ${sinStock ? 'bg-gray-100 text-gray-800' :
                                                            stockBajo ? 'bg-orange-100 text-orange-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                            {sinStock ? 'Sin stock' :
                                                                stockBajo ? 'Stock bajo' :
                                                                    'Stock normal'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className='text-sm text-gray-500'>
                                                        {inv.fecha_actualizacion
                                                            ? new Date(inv.fecha_actualizacion).toLocaleDateString('es-ES')
                                                            : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            );
                        } else {
                            return (
                                <div className='text-center py-8 text-gray-500'>
                                    <Warehouse className='mx-auto mb-2' size={48} />
                                    <p>Este ítem no tiene inventario asignado en ninguna bodega</p>
                                </div>
                            );
                        }
                    })()}
                </CardContent>
            </Card>

            {modalType === 'producto' && (
                <AddProducto
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    item={producto}
                    inventarioItem={inventarios[0]}
                />
            )}

            {modalType === 'pieza' && (
                <AddPieza
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    item={pieza}
                    inventarioItem={inventarioPiezas[0]}
                />
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el {tipo} y todo su historial asociado.
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
    );
}

export default InfoDetallada;