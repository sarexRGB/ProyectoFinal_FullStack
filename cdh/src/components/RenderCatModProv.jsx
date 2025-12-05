import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash, ArrowLeft } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import Agregar from '@/components/Agregar'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '@/services/ProductosServices'
import { getBodegas, createBodega, updateBodega, deleteBodega, getProveedores, createProveedor, updateProveedor, deteleProveedor } from '@/services/InventarioServices'

function RenderCatModProv() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [openDelete, setOpenDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const config = {
        categorias: {
            title: 'Gestión de Categorías',
            singular: 'Categoría',
            fetch: getCategorias,
            create: createCategoria,
            update: updateCategoria,
            delete: deleteCategoria,
            columns: [
                { header: 'Nombre', key: 'nombre' },
                { header: 'Descripción', key: 'descripcion' }
            ],
            formFields: { nombre: '', descripcion: '' },
            modalType: 'categoria'
        },
        bodegas: {
            title: 'Gestión de Bodegas',
            singular: 'Bodega',
            fetch: getBodegas,
            create: createBodega,
            update: updateBodega,
            delete: deleteBodega,
            columns: [
                { header: 'Nombre', key: 'nombre' },
            ],
            formFields: { nombre: '' },
            modalType: 'bodega'
        },
        proveedores: {
            title: 'Gestión de Proveedores',
            singular: 'Proveedor',
            fetch: getProveedores,
            create: createProveedor,
            update: updateProveedor,
            delete: deteleProveedor,
            columns: [
                { header: 'Nombre', key: 'nombre' },
                { header: 'Teléfono', key: 'telefono' },
                { header: 'Email', key: 'email' }
            ],
            formFields: { nombre: '', telefono: '', email: '' },
            modalType: 'proveedor'
        }
    };

    const currentConfig = config[type];

    useEffect(() => {
        if (currentConfig) {
            fetchData();
        }
    }, [type]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await currentConfig.fetch();
            setData(response.data);
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setFormData(currentConfig.formFields);
        setOpenModal(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData(item);
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (selectedItem) {
                await currentConfig.update(selectedItem.id, formData);
            } else {
                await currentConfig.create(formData);
            }
            setOpenModal(false);
            fetchData();
        } catch (error) {
            console.error(`Error saving ${currentConfig.singular}:`, error);
            alert(`Error al guardar ${currentConfig.singular.toLowerCase()}`);
        }
    };

    const handleDelete = async () => {
        try {
            await currentConfig.delete(itemToDelete.id);
            setOpenDelete(false);
            fetchData();
        } catch (error) {
            console.error(`Error deleting ${currentConfig.singular}:`, error);
            alert(`Error al eliminar ${currentConfig.singular.toLowerCase()}`);
        }
    };

    if (!currentConfig) {
        return <div className="p-6">Tipo de configuración no válido</div>;
    }

    return (
        <div className='p-6'>
            <div className='flex items-center gap-4 mb-6'>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </Button>
                <h1 className='text-2xl font-bold'>{currentConfig.title}</h1>
                <div className="flex-1"></div>
                <Button onClick={handleCreate} className='flex items-center gap-2'>
                    <Plus size={18} /> Agregar {currentConfig.singular}
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {currentConfig.columns.map((col, index) => (
                                <TableHead key={index}>{col.header}</TableHead>
                            ))}
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={currentConfig.columns.length + 1} className="text-center py-8">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={currentConfig.columns.length + 1} className="text-center py-8 text-gray-500">
                                    No hay registros
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    {currentConfig.columns.map((col, index) => (
                                        <TableCell key={index}>{item[col.key]}</TableCell>
                                    ))}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => {
                                                setItemToDelete(item);
                                                setOpenDelete(true);
                                            }}>
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Agregar
                type={currentConfig.modalType}
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                selectedItem={selectedItem}
            />

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar {currentConfig.singular}</DialogTitle>
                        <DialogDescription>
                            ¿Seguro que deseas eliminar {currentConfig.singular.toLowerCase()}{" "}
                            <strong>{itemToDelete?.nombre}</strong>?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RenderCatModProv