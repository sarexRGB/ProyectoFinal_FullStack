import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from './ui/textarea'

function Agregar({
    type,
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    selectedItem
}) {
    const isCategoriaModal = type === 'categoria';
    const isBodegaModal = type === 'bodega';
    const isProveedorModal = type === 'proveedor';

    const handleSubmit = () => {
        onSubmit();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isCategoriaModal && (selectedItem ? 'Editar Categoría' : 'Nueva Categoría')}
                        {isBodegaModal && 'Nueva Bodega'}
                        {isProveedorModal && 'Nuevo Proveedor'}
                    </DialogTitle>
                    <DialogDescription>
                        {isCategoriaModal && (selectedItem
                            ? 'Actualiza la información de la categoría.'
                            : 'Ingresa la información de la nueva categoría.'
                        )}
                        {isBodegaModal && 'Ingresa la información de la nueva bodega.'}
                        {isProveedorModal && 'Ingresa la información del nuevo proveedor.'}
                    </DialogDescription>
                </DialogHeader>

                <div className='grid gap-4 py-4'>
                    {isCategoriaModal && (
                        <>
                            <div>
                                <Label htmlFor='cat-nombre'>Nombre *</Label>
                                <Input
                                    id='cat-nombre'
                                    value={formData.nombre || ''}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder='Ej: Maquinaria Pesada'
                                />
                            </div>
                            <div>
                                <Label htmlFor='cat-descripcion'>Descripción</Label>
                                <Textarea
                                    id='cat-descripcion'
                                    value={formData.descripcion || ''}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder='Descripción de la categoría'
                                />
                            </div>
                        </>
                    )}

                    {isBodegaModal && (
                        <>
                            <div>
                                <Label htmlFor='bodega-nombre'>Nombre *</Label>
                                <Input
                                    id='bodega-nombre'
                                    value={formData.nombre || ''}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder='Ej: Bodega Principal'
                                />
                            </div>
                        </>
                    )}

                    {isProveedorModal && (
                        <>
                            <div>
                                <Label htmlFor='prov-nombre'>Nombre *</Label>
                                <Input
                                    id='prov-nombre'
                                    value={formData.nombre || ''}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder='Ej: Distribuidora XYZ'
                                />
                            </div>
                            <div>
                                <Label htmlFor='prov-telefono'>Teléfono *</Label>
                                <Input
                                    id='prov-telefono'
                                    value={formData.telefono || ''}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    placeholder='Ej: +1234567890'
                                />
                            </div>
                            <div>
                                <Label htmlFor='prov-email'>Email</Label>
                                <Input
                                    id='prov-email'
                                    type='email'
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder='Ej: contacto@proveedor.com'
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>
                        {isCategoriaModal && selectedItem ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Agregar