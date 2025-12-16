import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash, Package, FolderPlus, Warehouse, UserRoundPlus, Menu } from 'lucide-react'
import { getProductos } from '@/services/ProductosServices'
import { getVehiculos, deleteVehiculo } from '@/services/VehiculoServices'
import { getInventario, deleteInventario, getInventarioPieza, deleteInventarioPieza } from '@/services/InventarioServices'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AddProducto from '@/components/AddProducto'
import AddPieza from '@/components/AddPieza'
import AddVehiculo from '@/components/AddVehiculo'

function Inventario() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const inventoryType = searchParams.get('tab') || 'productos';

    const setInventoryType = (type) => {
        setSearchParams({ tab: type });
    };
    const [inventario, setInventario] = useState([]);
    const [productos, setProductos] = useState([]);
    const [inventarioPiezas, setInventarioPiezas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);
    const [modalityFilter, setModalityFilter] = useState('todos');

    useEffect(() => {
        fetchInventario();
        fetchInventarioPiezas();
        fetchProductos();
        fetchVehiculos();
    }, [])

    const fetchVehiculos = async () => {
        try {
            const response = await getVehiculos();
            setVehiculos(response.data);
        } catch (error) {
            console.error("Error al obtener vehiculos:", error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await getProductos();
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const fetchInventario = async () => {
        try {
            const response = await getInventario();
            setInventario(response.data.results || response.data);
        } catch (error) {
            console.error("Error al obtener inventario:", error);
        }
    };

    const fetchInventarioPiezas = async () => {
        try {
            const response = await getInventarioPieza();
            setInventarioPiezas(response.data.results || response.data);
        } catch (error) {
            console.error("Error al obtener inventario de piezas:", error);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalType(inventoryType === 'productos' ? 'producto' :
            inventoryType === 'piezas' ? 'pieza' :
                'vehiculo'
        );
    };

    const abrirModal = () => {
        setSelectedItem(null);
        setModalType(
            inventoryType === 'productos' ? 'producto' :
                inventoryType === 'piezas' ? 'pieza' :
                    'vehiculo'
        );
    }

    const handleCloseModal = () => {
        setSelectedItem(null);
        setModalType(null);
        if (inventoryType === 'productos') {
            fetchInventario();
            fetchProductos();
        } else if (inventoryType === 'piezas') {
            fetchInventarioPiezas();
        } else if (inventoryType === 'vehiculos') {
            fetchVehiculos();
        }
    };

    const confirmDelete = async () => {
        try {
            if (inventoryType === 'productos') {
                await deleteInventario(deletedItem.id);
            } else if (inventoryType === 'piezas') {
                await deleteInventarioPieza(deletedItem.id);
            } else if (inventoryType === 'vehiculos') {
                await deleteVehiculo(deletedItem.id);
            }
            setOpenDelete(false);
            setDeletedItem(null);
            if (inventoryType === 'productos') {
                fetchInventario();
            } else if (inventoryType === 'piezas') {
                fetchInventarioPiezas();
            } else if (inventoryType === 'vehiculos') {
                fetchVehiculos();
            }
        } catch (error) {
            console.error("Error eliminando item:", error);
        }
    };

    const getStockStatus = (stock, minimo) => {
        if (stock === 0 || stock === null || stock === undefined) {
            return { text: 'Sin inventario', color: 'text-gray-500' };
        }
        if (stock < minimo) {
            return { text: 'Stock bajo', color: 'text-orange-600 font-semibold' };
        }
        return { text: 'Stock normal', color: 'text-green-600' };
    };

    const getCombinedInventoryData = () => {

        if (inventoryType === 'vehiculos') {
            return vehiculos;
        }

        if (inventoryType === 'piezas') {
            return inventarioPiezas;
        }

        const productosConInventario = productos
            .filter(producto => {
                if (modalityFilter === 'todos') return true;

                const tieneVenta = producto.precio_venta && producto.precio_venta > 0;
                const tieneAlquiler = producto.precio_alquiler && producto.precio_alquiler > 0;

                if (modalityFilter === 'venta') return tieneVenta && !tieneAlquiler;
                if (modalityFilter === 'alquiler') return tieneAlquiler && !tieneVenta;

                return true;
            })
            .map(producto => {
                const inventariosDelProducto = inventario.filter(inv => (inv.producto?.id || inv.producto) == producto.id);
                if (inventariosDelProducto.length > 0) {
                    return inventariosDelProducto.map(inv => ({
                        ...inv,
                        producto: producto
                    }));
                }

                return [{
                    id: `virtual-${producto.id}`,
                    producto: producto,
                    bodega: null,
                    stock_disponible: null,
                    stock_alquilado: 0,
                    minimo_stock: 0,
                    isVirtual: true
                }];
            });

        return productosConInventario.flat();
    };

    const displayData = getCombinedInventoryData();

    const handleRowClick = (item) => {
        if (inventoryType === 'vehiculos') return;

        let itemId;
        if (inventoryType === 'productos') {
            itemId = item.producto?.id || item.id;
            navigate(`info/producto/${itemId}`);
        } else if (inventoryType === 'piezas') {
            itemId = item.pieza?.id || item.id;
            navigate(`info/pieza/${itemId}`);
        }
    }

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center gap-4'>
                    <h2 className='text-2xl font-bold'>
                        {inventoryType === 'productos' ? 'Productos' :
                            inventoryType === 'piezas' ? 'Piezas de Repuesto' :
                                'Vehículos'}
                    </h2>

                    {inventoryType === 'productos' && (
                        <Select value={modalityFilter} onValueChange={setModalityFilter}>
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='Filtrar por modalidad' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='todos'>Todos</SelectItem>
                                <SelectItem value='venta'>Solo Venta</SelectItem>
                                <SelectItem value='alquiler'>Solo Alquiler</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div className='flex gap-2'>
                    <Button variant='default' onClick={abrirModal}>
                        <Plus size={16} className='mr-2' /> Agregar {inventoryType === 'productos' ? 'Producto' : inventoryType === 'piezas' ? 'Pieza' : 'Vehiculo'}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' className='flex items-center gap-2'>
                                <Menu size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-56'>
                            <DropdownMenuItem onClick={() => navigate('config/categorias')}>
                                <FolderPlus size={16} className='mr-2' /> Categorías
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('config/bodegas')}>
                                <Warehouse size={16} className='mr-2' /> Bodegas
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('config/proveedores')}>
                                <UserRoundPlus size={16} className='mr-2' /> Proveedores
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>

                        {(inventoryType === 'productos' || inventoryType === 'piezas') && (
                            <>
                                <TableHead className='text-lg font-semibold'>{inventoryType === 'productos' ? 'Producto' : 'Piezas'}</TableHead>
                                <TableHead className='text-lg font-semibold'>Bodega</TableHead>
                                {inventoryType === 'productos' && <TableHead className='text-lg font-semibold'>Modalidad</TableHead>}
                                <TableHead className='text-lg font-semibold'>Stock Disponible</TableHead>
                                <TableHead className='text-lg font-semibold'>Stock Mínimo</TableHead>
                            </>
                        )}
                        {inventoryType === 'piezas' && <TableHead className='text-lg font-semibold'>Origen</TableHead>}
                        {(inventoryType === 'productos' || inventoryType === 'piezas') && (
                            <>
                                <TableHead className='text-lg font-semibold'>Estado</TableHead>
                                {inventoryType === 'productos' && <TableHead className='text-lg font-semibold'>Alquilado</TableHead>}
                            </>
                        )}
                        {inventoryType === 'vehiculos' && (
                            <>
                                <TableHead className='text-lg font-semibold'>Placa</TableHead>
                                <TableHead className='text-lg font-semibold'>Modelo</TableHead>
                                <TableHead className='text-lg font-semibold'>Estado</TableHead>
                                <TableHead className='text-lg font-semibold'>Acciones</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={inventoryType === 'piezas' ? 8 : inventoryType === 'productos' ? 7 : 4} className='text-center py-8 text-gray-500'>
                                <Package className='mx-auto mb-2' size={48} />
                                <p>No hay {inventoryType === 'productos' ? 'productos' : inventoryType === 'piezas' ? 'piezas' : 'vehiculos'} registrados</p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayData.map((item) => {
                            const stockStatus = getStockStatus(inventoryType === 'productos' ? item.stock_disponible : item.stock, item.minimo_stock);
                            const isVirtual = item.isVirtual;

                            return (
                                <TableRow
                                    key={item.id}
                                    className={
                                        inventoryType !== 'vehiculos' && !isVirtual
                                            ? 'cursor-pointer hover:bg-gray-50'
                                            : ''
                                    }
                                    onClick={() => handleRowClick(item)}
                                >
                                    {inventoryType === 'vehiculos' ? (
                                        <>
                                            <TableCell>{item.placa || 'N/A'}</TableCell>
                                            <TableCell>{item.modelo || 'N/A'}</TableCell>
                                            <TableCell>
                                                <span className={`text-xs px-2 py-1 rounded ${item.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                                                    item.estado === 'en_uso' ? 'bg-blue-100 text-blue-800' :
                                                        item.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {item.estado || 'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell className='flex gap-2'>
                                                <Button size='sm' variant='outline' onClick={() => handleEdit(item)}>
                                                    <Edit size={16} />
                                                </Button>
                                                <Button size='sm'
                                                    variant='destructive'
                                                    onClick={() => {
                                                        setDeletedItem(item);
                                                        setOpenDelete(true)
                                                    }}
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>
                                                {inventoryType === 'productos'
                                                    ? (item.producto?.nombre || 'N/A')
                                                    : (item.pieza_nombre || item.pieza?.nombre || 'N/A')
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {isVirtual ? (
                                                    <span className='text-gray-400 italic'>Sin asignar</span>
                                                ) : (
                                                    item.bodega_nombre || item.bodega?.nombre || 'N/A'
                                                )}
                                            </TableCell>

                                            {inventoryType === 'productos' && (
                                                <TableCell>
                                                    {(() => {
                                                        const tieneVenta = item.producto?.precio_venta && item.producto.precio_venta > 0
                                                        const tieneAlquiler = item.producto?.precio_alquiler && item.producto.precio_alquiler > 0

                                                        if (tieneVenta && tieneAlquiler) {
                                                            return <span className='text-xs px-2 py-1 rounded bg-purple-100 text-purple-800'>Ambos</span>
                                                        } else if (tieneAlquiler) {
                                                            return <span className='text-xs px-2 py-1 rounded bg-blue-100 text-blue-800'>Alquiler</span>
                                                        } else if (tieneVenta) {
                                                            return <span className='text-xs px-2 py-1 rounded bg-green-100 text-green-800'>Venta</span>
                                                        }
                                                        return <span className='text-gray-400'>N/A</span>
                                                    })()}
                                                </TableCell>
                                            )}

                                            <TableCell className='font-semibold'>
                                                {isVirtual ? (
                                                    <span className='text-gray-400'>-</span>
                                                ) : (
                                                    inventoryType === 'productos' ? item.stock_disponible : item.stock
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isVirtual ? (
                                                    <span className='text-gray-400'>-</span>
                                                ) : (
                                                    item.minimo_stock
                                                )}
                                            </TableCell>
                                            {inventoryType === 'piezas' && (
                                                <TableCell>
                                                    <span className='text-xs px-2 py-1 rounded bg-blue-100 text-blue-800'>
                                                        {item.origen || 'N/A'}
                                                    </span>
                                                </TableCell>
                                            )}
                                            <TableCell className={stockStatus.color}>{stockStatus.text}</TableCell>
                                            {inventoryType === 'productos' && (
                                                <TableCell>
                                                    {isVirtual ? (
                                                        <span className='text-gray-400'>-</span>
                                                    ) : (item.producto?.precio_alquiler && item.producto.precio_alquiler > 0) ? (
                                                        item.stock_alquilado || 0
                                                    ) : (
                                                        <span className='text-gray-400'>-</span>
                                                    )}
                                                </TableCell>
                                            )}
                                        </>
                                    )}

                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            {modalType === 'producto' && (
                <AddProducto
                    isOpen={!!modalType}
                    onClose={handleCloseModal}
                    item={selectedItem?.producto}
                    inventarioItem={selectedItem}
                />
            )}

            {modalType === 'pieza' && (
                <AddPieza
                    isOpen={!!modalType}
                    onClose={handleCloseModal}
                    item={selectedItem?.pieza}
                    inventarioItem={selectedItem}
                />
            )}

            {modalType === 'vehiculo' && (
                <AddVehiculo
                    isOpen={!!modalType}
                    onClose={handleCloseModal}
                    item={selectedItem}
                />
            )}

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar {
                            inventoryType === 'productos' ? 'Producto' :
                                inventoryType === 'piezas' ? 'Pieza' :
                                    'Vehículo'
                        }</DialogTitle>
                        <DialogDescription>
                            ¿Seguro que deseas eliminar {
                                inventoryType === 'productos' ? 'el producto' :
                                    inventoryType === 'piezas' ? 'la pieza' :
                                        'el vehículo'
                            }{" "}
                            <strong>
                                {inventoryType === 'productos' ? deletedItem?.producto?.nombre :
                                    inventoryType === 'piezas' ? deletedItem?.pieza?.nombre :
                                        `${deletedItem?.marca} ${deletedItem?.modelo} (${deletedItem?.placa})`
                                }
                            </strong> de la bodega{" "}
                            <strong>{deletedItem?.bodega?.nombre}</strong>?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Inventario