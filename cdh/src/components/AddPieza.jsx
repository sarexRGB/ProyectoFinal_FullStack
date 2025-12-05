import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getBodegas, createPieza, updatePieza, getProveedores, createInventarioPieza, updateInventarioPieza } from '@/services/InventarioServices'

function AddPieza({ isOpen, onClose, item, inventarioItem }) {
    const [piezaFormData, setPiezaFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
    });

    const [inventarioData, setInventarioData] = useState({
        bodega: '',
        ubicacion: '',
        stock: '',
        minimo_stock: '',
        origen: 'PROVEEDOR',
        proveedor: '',
    });

    const [bodegas, setBodegas] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        fetchBodegas();
        fetchProveedores();

        if (item) {
            setPiezaFormData({
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                precio: item.precio || '',
                numero_parte: item.numero_parte || '',
            });
        }

        if (inventarioItem) {
            setInventarioData({
                bodega: inventarioItem.bodega?.id || '',
                ubicacion: inventarioItem.ubicacion || '',
                stock: inventarioItem.stock || '',
                minimo_stock: inventarioItem.minimo_stock || '',
                origen: inventarioItem.origen || 'PROVEEDOR',
                proveedor: inventarioItem.proveedor?.id || '',
            });
        }
    }, [item, inventarioItem]);

    const fetchBodegas = async () => {
        try {
            const response = await getBodegas();
            setBodegas(response.data);
        } catch (error) {
            console.error('Error al cargar bodegas:', error);
        }
    };

    const fetchProveedores = async () => {
        try {
            const response = await getProveedores();
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    };

    const handlePiezaChange = (e) => {
        setPiezaFormData({ ...piezaFormData, [e.target.name]: e.target.value });
    };

    const handleInventarioChange = (e) => {
        setInventarioData({ ...inventarioData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const piezaData = { ...piezaFormData };

            let piezaId;

            if (item) {
                await updatePieza(item.id, piezaData);
                piezaId = item.id;
            } else {
                const response = await createPieza(piezaData);
                piezaId = response.data.id;
            }

            if (inventarioData.bodega && inventarioData.stock) {
                const inventarioPiezaPayload = {
                    pieza: piezaId,
                    bodega: inventarioData.bodega,
                    ubicacion: inventarioData.ubicacion,
                    stock: parseInt(inventarioData.stock),
                    minimo_stock: parseInt(inventarioData.minimo_stock) || 0,
                    origen: inventarioData.origen,
                    proveedor: inventarioData.origen === 'PROVEEDOR' ? inventarioData.proveedor : null,
                    fecha_actualizacion: new Date().toISOString(),
                    activo: true,
                };

                if (inventarioItem) {
                    await updateInventarioPieza(inventarioItem.id, inventarioPiezaPayload);
                } else {
                    await createInventarioPieza(inventarioPiezaPayload);
                }
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar pieza:', error);
            alert('Ocurrió un error al guardar la pieza');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        {item ? 'Editar Pieza' : 'Agregar Pieza de Repuesto'}
                    </DialogTitle>
                    <DialogDescription>
                        {item ? 'Actualiza la información de la pieza.' : 'Ingresa la información de la nueva pieza de repuesto.'}
                    </DialogDescription>
                </DialogHeader>

                <div className='grid gap-6 py-4'>
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>Información de la Pieza</h3>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='col-span-2'>
                                <Label htmlFor='nombre'>Nombre *</Label>
                                <Input
                                    id='nombre'
                                    name='nombre'
                                    value={piezaFormData.nombre}
                                    onChange={handlePiezaChange}
                                    placeholder='Ej: Filtro de aceite'
                                />
                            </div>

                            <div className='col-span-2'>
                                <Label htmlFor='descripcion'>Descripción *</Label>
                                <Textarea
                                    id='descripcion'
                                    name='descripcion'
                                    value={piezaFormData.descripcion}
                                    onChange={handlePiezaChange}
                                    placeholder='Describe las características'
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor='numero_parte'>Número de Parte</Label>
                                <Input
                                    id='numero_parte'
                                    name='numero_parte'
                                    value={piezaFormData.numero_parte}
                                    onChange={handlePiezaChange}
                                    placeholder='Ej: CAT-123456'
                                />
                            </div>

                            <div>
                                <Label htmlFor='precio'>Precio *</Label>
                                <Input
                                    id='precio'
                                    name='precio'
                                    type='number'
                                    step='0.01'
                                    value={piezaFormData.precio}
                                    onChange={handlePiezaChange}
                                    placeholder='0.00'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='space-y-4 border-t pt-4'>
                        <h3 className='text-lg font-semibold'>Información de Inventario</h3>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Label htmlFor='origen'>Origen *</Label>
                                <Select
                                    value={inventarioData.origen}
                                    onValueChange={(value) => setInventarioData({ ...inventarioData, origen: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Seleccionar origen' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='PROVEEDOR'>Proveedor</SelectItem>
                                        <SelectItem value='RECUPERADO'>Recuperado</SelectItem>
                                        <SelectItem value='OTRO'>Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {inventarioData.origen === 'PROVEEDOR' && (
                                <div>
                                    <Label htmlFor='proveedor'>Proveedor *</Label>
                                    <Select
                                        value={inventarioData.proveedor?.toString()}
                                        onValueChange={(value) => setInventarioData({ ...inventarioData, proveedor: parseInt(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Seleccionar proveedor' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {proveedores.map((prov) => (
                                                <SelectItem key={prov.id} value={prov.id.toString()}>
                                                    {prov.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div>
                                <Label htmlFor='bodega'>Bodega *</Label>
                                <Select
                                    value={inventarioData.bodega?.toString()}
                                    onValueChange={(value) => setInventarioData({ ...inventarioData, bodega: parseInt(value) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Seleccionar bodega' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bodegas.map((bodega) => (
                                            <SelectItem key={bodega.id} value={bodega.id.toString()}>
                                                {bodega.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor='ubicacion'>Ubicación *</Label>
                                <Input
                                    id='ubicacion'
                                    name='ubicacion'
                                    value={inventarioData.ubicacion}
                                    onChange={handleInventarioChange}
                                    placeholder='Ej: Estante A-1'
                                />
                            </div>

                            <div>
                                <Label htmlFor='stock'>Stock *</Label>
                                <Input
                                    id='stock'
                                    name='stock'
                                    type='number'
                                    value={inventarioData.stock}
                                    onChange={handleInventarioChange}
                                    placeholder='0'
                                />
                            </div>

                            <div>
                                <Label htmlFor='minimo_stock'>Stock Mínimo</Label>
                                <Input
                                    id='minimo_stock'
                                    name='minimo_stock'
                                    type='number'
                                    value={inventarioData.minimo_stock}
                                    onChange={handleInventarioChange}
                                    placeholder='0'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className='flex justify-end space-x-2'>
                    <Button variant='outline' onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        {item ? 'Actualizar' : 'Registrar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddPieza