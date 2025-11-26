import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, Edit, Trash, Shield } from 'lucide-react'
import { getRolesEmpleado, createRolEmpleado, updateRolEmpleado, deleteRolEmpleado } from '@/services/UsuariosServices'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

function Roles() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        group_name: '',
        descripcion: '',
        nivel_responsabilidad: '1',
        requiere_licencia: false,
        area_asignada: ''
    });
    const [openDelete, setOpenDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getRolesEmpleado();
            console.log('Roles response:', response.data);
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = () => {
        setSelectedItem(null);
        setFormData({
            group_name: '',
            descripcion: '',
            nivel_responsabilidad: '1',
            requiere_licencia: false,
            area_asignada: ''
        });
        setOpenModal(true);
    };

    const handleEdit = (role) => {
        setSelectedItem(role);
        setFormData({
            group_name: role.group_name || '',
            descripcion: role.descripcion || '',
            nivel_responsabilidad: role.nivel_responsabilidad?.toString() || '1',
            requiere_licencia: role.requiere_licencia || false,
            area_asignada: role.area_asignada || ''
        });
        setOpenModal(true);
    };

    const handleDelete = (role) => {
        setItemToDelete(role);
        setOpenDelete(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedItem(null);
        setFormData({
            group_name: '',
            descripcion: '',
            nivel_responsabilidad: '1',
            requiere_licencia: false,
            area_asignada: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedItem) {
                await updateRolEmpleado(selectedItem.id, formData);
            } else {
                await createRolEmpleado(formData);
            }
            setOpenModal(false);
            fetchData();
            setFormData({
                group_name: '',
                descripcion: '',
                nivel_responsabilidad: '1',
                requiere_licencia: false,
                area_asignada: ''
            });
        } catch (error) {
            console.error('Error saving role:', error);
            alert('Error al guardar el rol. Por favor, intenta de nuevo.');
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await deleteRolEmpleado(itemToDelete.id);
            setOpenDelete(false);
            setItemToDelete(null);
            fetchData();
        } catch (error) {
            console.error('Error deleting role:', error);
            alert('Error al eliminar el rol. Por favor, intenta de nuevo.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const getNivelResponsabilidadLabel = (nivel) => {
        const niveles = {
            '1': 'Bajo',
            '2': 'Medio',
            '3': 'Alto'
        };
        return niveles[nivel?.toString()] || 'N/A';
    };

    return (
        <div className='p-6'>
            <div className='flex items-center gap-4 mb-6'>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex items-center gap-2">
                    <Shield size={28} className="text-primary" />
                    <h1 className='text-2xl font-bold'>Gestión de Roles</h1>
                </div>
                <div className="flex-1"></div>
                <Button onClick={handleCreate} className='flex items-center gap-2'>
                    <Plus size={18} /> Agregar Rol
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8">Cargando roles...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {roles.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-8">
                            No hay roles disponibles
                        </div>
                    ) : (
                        roles.map((role) => (
                            <Card key={role.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center justify-between text-lg">
                                        <span>{role.group_name}</span>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(role)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    {role.descripcion && (
                                        <p className="text-muted-foreground line-clamp-2">{role.descripcion}</p>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-xs text-muted-foreground">Responsabilidad:</span>
                                        <span className="text-xs font-medium">{getNivelResponsabilidadLabel(role.nivel_responsabilidad)}</span>
                                    </div>
                                    {role.area_asignada && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">Área:</span>
                                            <span className="text-xs font-medium">{role.area_asignada}</span>
                                        </div>
                                    )}
                                    {role.requiere_licencia && (
                                        <div className="flex items-center gap-1 text-xs text-amber-600">
                                            <Shield size={12} />
                                            <span>Requiere licencia</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Modal para crear/editar */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedItem ? 'Editar Rol' : 'Agregar Rol'}</DialogTitle>
                        <DialogDescription>
                            {selectedItem
                                ? 'Modifica la información del rol.'
                                : 'Complete el formulario para agregar un nuevo rol.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="group_name">Nombre del Rol *</Label>
                                    <Input
                                        id="group_name"
                                        name="group_name"
                                        value={formData.group_name}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Administrador, Chofer"
                                        required
                                        disabled={selectedItem !== null}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="area_asignada">Área Asignada</Label>
                                    <Input
                                        id="area_asignada"
                                        name="area_asignada"
                                        value={formData.area_asignada}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Operaciones, Mantenimiento"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Describe las responsabilidades de este rol"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nivel_responsabilidad">Nivel de Responsabilidad</Label>
                                    <Select
                                        value={formData.nivel_responsabilidad}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, nivel_responsabilidad: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione nivel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Bajo</SelectItem>
                                            <SelectItem value="2">Medio</SelectItem>
                                            <SelectItem value="3">Alto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 flex items-end">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="requiere_licencia"
                                            name="requiere_licencia"
                                            checked={formData.requiere_licencia}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="requiere_licencia" className="cursor-pointer">
                                            Requiere Licencia
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                {selectedItem ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* AlertDialog para confirmar eliminación */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el rol
                            <strong> "{itemToDelete?.group_name}"</strong> y toda su información asociada.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSubmit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Roles