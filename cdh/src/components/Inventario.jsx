import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash, Package, FolderPlus, Warehouse, UserRoundPlus, Menu } from 'lucide-react'
import { getInventario, deleteInventario, getInventarioPieza, deleteInventarioPieza } from '@/services/InventarioServices'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AgregarProductoPieza from '@/components/AgregarProductoPieza'

function Inventario() {
    const navigate = useNavigate();
    const [inventoryType, setInventoryType] = useState('productos');
    const [inventario, setInventario] = useState([]);
    const [inventarioPiezas, setInventarioPiezas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState('producto');
    const [selectedItem, setSelectedItem] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);

    useEffect(() => {
        fetchInventario();
        fetchInventarioPiezas();
    }, [])

    const fetchInventario = async () => {
        try {
            const response = await getInventario();
            setInventario(response.data);
        } catch (error) {
            console.error("Error al obtener inventario:", error);
        }
    };

    const fetchInventarioPiezas = async () => {
        try {
            const response = await getInventarioPieza();
            setInventarioPiezas(response.data);
        } catch (error) {
            console.error("Error al obtener inventario de piezas:", error);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setModalType(inventoryType === 'productos' ? 'producto' : 'pieza');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setOpenModal(false);
        if (inventoryType === 'productos') {
            fetchInventario();
        } else {
            fetchInventarioPiezas();
        }
    };

    const confirmDelete = async () => {
        try {
            if (inventoryType === 'productos') {
                await deleteInventario(deletedItem.id);
            } else {
                await deleteInventarioPieza(deletedItem.id);
            }
            setOpenDelete(false);
            setDeletedItem(null);
            if (inventoryType === 'productos') {
                fetchInventario();
            } else {
                fetchInventarioPiezas();
            }
        } catch (error) {
            console.error("Error eliminando item:", error);
        }
    };

    const getStockStatus = (stock, minimo) => {
        if (stock === 0) return { text: 'Sin stock', color: 'text-red-600 font-semibold' };
        if (stock < minimo) return { text: 'Stock bajo', color: 'text-orange-600 font-semibold' };
        return { text: 'Stock normal', color: 'text-green-600' };
    };

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center gap-4'>
                    <Select value={inventoryType} onValueChange={setInventoryType}>
                        <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Tipo de inventario' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='productos'>Productos</SelectItem>
                            <SelectItem value='piezas'>Piezas de Repuesto</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex gap-2'>
                    <Button variant='default'
                        onClick={() => {
                            setOpenModal(true);
                            setModalType(inventoryType === 'productos' ? 'producto' : 'pieza');
                            setSelectedItem(null);
                        }}
                    >
                        <Plus size={16} className='mr-2' /> Agregar {inventoryType === 'productos' ? 'Producto' : 'Pieza'}
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
                        <TableHead className='text-lg font-semibold'>{inventoryType === 'productos' ? 'Producto' : 'Pieza'}</TableHead>
                        <TableHead className='text-lg font-semibold'>Bodega</TableHead>
                        <TableHead className='text-lg font-semibold'>Ubicación</TableHead>
                        <TableHead className='text-lg font-semibold'>Stock</TableHead>
                        <TableHead className='text-lg font-semibold'>Stock Mínimo</TableHead>
                        {inventoryType === 'piezas' && <TableHead className='text-lg font-semibold'>Origen</TableHead>}
                        <TableHead className='text-lg font-semibold'>Estado</TableHead>
                        <TableHead className='text-lg font-semibold'>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(inventoryType === 'productos' ? inventario : inventarioPiezas).length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={inventoryType === 'piezas' ? 8 : 7} className='text-center py-8 text-gray-500'>
                                <Package className='mx-auto mb-2' size={48} />
                                <p>No hay {inventoryType === 'productos' ? 'productos' : 'piezas'} en el inventario</p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        (inventoryType === 'productos' ? inventario : inventarioPiezas).map((item) => {
                            const stockStatus = getStockStatus(item.stock, item.minimo_stock);
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className='font-medium'>
                                        {inventoryType === 'productos'
                                            ? (item.producto?.nombre || 'N/A')
                                            : (item.pieza?.nombre || 'N/A')
                                        }
                                    </TableCell>
                                    <TableCell>{item.bodega?.nombre || 'N/A'}</TableCell>
                                    <TableCell>{item.ubicacion}</TableCell>
                                    <TableCell className='font-semibold'>{item.stock}</TableCell>
                                    <TableCell>{item.minimo_stock}</TableCell>
                                    {inventoryType === 'piezas' && (
                                        <TableCell>
                                            <span className='text-xs px-2 py-1 rounded bg-blue-100 text-blue-800'>
                                                {item.origen || 'N/A'}
                                            </span>
                                        </TableCell>
                                    )}
                                    <TableCell className={stockStatus.color}>{stockStatus.text}</TableCell>
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
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            <AgregarProductoPieza
                type={modalType}
                isOpen={openModal}
                onClose={handleCloseModal}
                item={selectedItem}
                inventarioItem={selectedItem}
            />

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar {inventoryType === 'productos' ? 'Producto' : 'Pieza'}</DialogTitle>
                        <DialogDescription>
                            ¿Seguro que deseas eliminar {inventoryType === 'productos' ? 'el producto' : 'la pieza'}{" "}
                            <strong>
                                {inventoryType === 'productos'
                                    ? deletedItem?.producto?.nombre
                                    : deletedItem?.pieza?.nombre
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