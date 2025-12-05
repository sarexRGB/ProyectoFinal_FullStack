import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientes, createCliente, updateCliente, deleteCliente } from '@/services/ClientesServices'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

function Clientes() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        email: '',
        telefono: ''
    });
    const [openDelete, setOpenDelete] = useState(false);
    const [deletedItem, setDeletedItem] = useState(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    useEffect(() => {
        if (selectedItem) {
            setFormData({
                nombre: selectedItem.nombre || '',
                primer_apellido: selectedItem.primer_apellido || '',
                segundo_apellido: selectedItem.segundo_apellido || '',
                email: selectedItem.email || '',
                telefono: selectedItem.telefono || ''
            });
        } else {
            setFormData({
                nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                email: '',
                telefono: ''
            });
        }
    }, [selectedItem]);

    const fetchClientes = async () => {
        try {
            const response = await getClientes();
            setClientes(response.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setOpenModal(true);
    };

    const handleDeleteClick = (item) => {
        setDeletedItem(item);
        setOpenDelete(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setOpenModal(false);
        setFormData({
            nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            email: '',
            telefono: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (selectedItem) {
                await updateCliente(selectedItem.id, formData);
            } else {
                await createCliente(formData);
            }
            handleCloseModal();
            fetchClientes();
        } catch (error) {
            console.error("Error al guardar cliente:", error);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteCliente(deletedItem.id);
            setOpenDelete(false);
            setDeletedItem(null);
            fetchClientes();
        } catch (error) {
            console.error("Error eliminando cliente:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-lg font-semibold'>Nombre</TableHead>
                            <TableHead className='text-lg font-semibold'>Correo</TableHead>
                            <TableHead className='text-lg font-semibold'>Telefono</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell className='text-sm-gray-300'>{cliente.nombre_completo}</TableCell>
                                <TableCell className='text-sm-gray-300'>{cliente.email}</TableCell>
                                <TableCell className='text-sm-gray-300'>{cliente.telefono}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cliente)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(cliente)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {clientes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                    No hay clientes registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                        <DialogDescription>
                            Complete los datos del cliente a continuación.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="primer_apellido">Primer Apellido</Label>
                                <Input id="primer_apellido" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} placeholder="Primer Apellido" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="segundo_apellido">Segundo Apellido</Label>
                                <Input id="segundo_apellido" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+506 ..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente {deletedItem?.nombre} {deletedItem?.primer_apellido}.
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

export default Clientes