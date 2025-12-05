import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createProducto, updateProducto, getCategorias, uploadArchivo, getModalidades, createProductoModalidad } from '@/services/ProductosServices'
import { getBodegas, createInventario, updateInventario } from '@/services/InventarioServices'

function AddProducto({ isOpen, onClose, item, inventarioItem }) {
  const [productoFormData, setProductoFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_venta: '',
    precio_alquiler: '',
    categoria: '',
    estado: 'DISPONIBLE',
    imagen: '',
  });

  const [inventarioData, setInventarioData] = useState({
    bodega: '',
    ubicacion: '',
    stock: '',
    minimo_stock: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState({
    venta: false,
    alquiler: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  

  useEffect(() => {
    fetchBodegas();
    fetchCategorias();
    fetchModalidades();

    if (item) {
      /*  */
      setProductoFormData({
        nombre: item.nombre || '',
        descripcion: item.descripcion || '',
        precio_venta: item.precio_venta || '',
        precio_alquiler: item.precio_alquiler || '',
        categoria: item.categoria?.id || '',
        estado: item.estado || 'DISPONIBLE',
        imagen: item.imagen || '',
      });

      setSelectedModalidades({
        venta: !!item.precio_venta,
        alquiler: !!item.precio_alquiler
      });
      console.log(productoFormData)
    }

    if (inventarioItem) {
      setInventarioData({
        bodega: inventarioItem.bodega?.id || '',
        ubicacion: inventarioItem.ubicacion || '',
        stock: inventarioItem.stock || '',
        minimo_stock: inventarioItem.minimo_stock || '',
      });
    }
  }, [item, inventarioItem]);

  const fetchCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const fetchBodegas = async () => {
    try {
      const response = await getBodegas();
      setBodegas(response.data);
    } catch (error) {
      console.error('Error al cargar bodegas:', error);
    }
  };

  const fetchModalidades = async () => {
    try {
      const response = await getModalidades();
      setModalidades(response.data);
    } catch (error) {
      console.error('Error al cargar modalidades:', error);
    }
  };

  const handleProductoChange = (e) => {
    setProductoFormData({ ...productoFormData, [e.target.name]: e.target.value });
  };

  const handleInventarioChange = (e) => {
    setInventarioData({ ...inventarioData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleModalidadChange = (modalidad, checked) => {
    setSelectedModalidades(prev => ({
      ...prev,
      [modalidad]: checked
    }));

    if (!checked) {
      if (modalidad === 'venta') {
        setProductoFormData(prev => ({ ...prev, precio_venta: '' }));
      } else if (modalidad === 'alquiler') {
        setProductoFormData(prev => ({ ...prev, precio_alquiler: '' }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedModalidades.venta && !selectedModalidades.alquiler) {
        alert('Debes seleccionar al menos una modalidad (Venta o Alquiler)');
        return;
      }

      if (selectedModalidades.venta && !productoFormData.precio_venta) {
        alert('Debes ingresar el precio de venta');
        return;
      }
      if (selectedModalidades.alquiler && !productoFormData.precio_alquiler) {
        alert('Debes ingresar el precio de alquiler');
        return;
      }

      let imagenUrl = productoFormData.imagen;

      if (imageFile) {
        setUploading(true);
        const uploadResponse = await uploadArchivo(imageFile);
        imagenUrl = uploadResponse.data.url;
        setUploading(false);
      }

      const productoData = {
        ...productoFormData,
        imagen: imagenUrl,
        precio_venta: selectedModalidades.venta && productoFormData.precio_venta ? parseFloat(productoFormData.precio_venta) : null,
        precio_alquiler: selectedModalidades.alquiler && productoFormData.precio_alquiler ? parseFloat(productoFormData.precio_alquiler) : null,
        categoria: parseInt(productoFormData.categoria),
      };

      let productoId;
      let isNewProduct = false;

      if (item) {
        await updateProducto(item.id, productoData);
        productoId = item.id;
      } else {
        const response = await createProducto(productoData);
        productoId = response.data.id;
        isNewProduct = true;
      }

      // Solo crear relaciones de modalidad para productos nuevos
      if (isNewProduct) {
        const ventaModalidad = modalidades.find(m => m.nombre.toLowerCase() === 'venta');
        const alquilerModalidad = modalidades.find(m => m.nombre.toLowerCase() === 'alquiler');

        if (selectedModalidades.venta && ventaModalidad) {
          await createProductoModalidad({
            producto: productoId,
            modalidad: ventaModalidad.id
          });
        }

        if (selectedModalidades.alquiler && alquilerModalidad) {
          await createProductoModalidad({
            producto: productoId,
            modalidad: alquilerModalidad.id
          });
        }
      }

      if (inventarioData.bodega && inventarioData.stock) {
        const inventarioPayload = {
          producto: productoId,
          bodega: inventarioData.bodega,
          ubicacion: inventarioData.ubicacion,
          stock: parseInt(inventarioData.stock),
          minimo_stock: parseInt(inventarioData.minimo_stock) || 0,
          fecha_actualizacion: new Date().toISOString(),
          activo: true,
        };

        if (inventarioItem) {
          await updateInventario(inventarioItem.id, inventarioPayload);
        } else {
          await createInventario(inventarioPayload);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Ocurrió un error al guardar el producto');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {item ? 'Editar Producto' : 'Agregar Producto'}
          </DialogTitle>
          <DialogDescription>
            {item ? 'Actualiza la información del producto.' : 'Ingresa la información del nuevo producto.'}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-6 py-4'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Información del Producto</h3>

            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Label htmlFor='nombre'>Nombre *</Label>
                <Input
                  id='nombre'
                  name='nombre'
                  value={productoFormData.nombre}
                  onChange={handleProductoChange}
                  placeholder='Ej: Excavadora Caterpillar 320'
                />
              </div>

              <div className='col-span-2'>
                <Label htmlFor='descripcion'>Descripción *</Label>
                <Textarea
                  id='descripcion'
                  name='descripcion'
                  value={productoFormData.descripcion}
                  onChange={handleProductoChange}
                  placeholder='Describe las características'
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor='categoria'>Categoría *</Label>
                <Select
                  value={productoFormData.categoria?.toString()}
                  onValueChange={(value) => setProductoFormData({ ...productoFormData, categoria: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar categoría' />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='estado'>Estado</Label>
                <Select
                  value={productoFormData.estado}
                  onValueChange={(value) => setProductoFormData({ ...productoFormData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar estado' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='DISPONIBLE'>Disponible</SelectItem>
                    <SelectItem value='ALQUILADO'>En alquiler</SelectItem>
                    <SelectItem value='REPARACIÓN'>En reparación</SelectItem>
                    <SelectItem value='INACTIVO'>Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='col-span-2'>
                <Label htmlFor='imagen'>Imagen del Producto</Label>
                <Input
                  id='imagen'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                />
                {productoFormData.imagen && !imageFile && (
                  <p className='text-sm text-gray-500 mt-1'>Imagen actual: {productoFormData.imagen}</p>
                )}
              </div>
            </div>
          </div>

          <div className='space-y-4 border-t pt-4'>
            <h3 className='text-lg font-semibold'>Modalidad y Precios *</h3>

            <div className='space-y-3'>
              <Label>Selecciona las modalidades disponibles:</Label>

              <div className='flex items-center space-x-6'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='modalidad-venta'
                    checked={selectedModalidades.venta}
                    onCheckedChange={(checked) => handleModalidadChange('venta', checked)}
                  />
                  <Label htmlFor='modalidad-venta' className='cursor-pointer font-normal'>
                    Venta
                  </Label>
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='modalidad-alquiler'
                    checked={selectedModalidades.alquiler}
                    onCheckedChange={(checked) => handleModalidadChange('alquiler', checked)}
                  />
                  <Label htmlFor='modalidad-alquiler' className='cursor-pointer font-normal'>
                    Alquiler
                  </Label>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 mt-4'>
                {selectedModalidades.venta && (
                  <div>
                    <Label htmlFor='precio_venta'>Precio de Venta *</Label>
                    <Input
                      id='precio_venta'
                      name='precio_venta'
                      type='number'
                      step='0.01'
                      value={productoFormData.precio_venta}
                      onChange={handleProductoChange}
                      placeholder='0.00'
                    />
                  </div>
                )}

                {selectedModalidades.alquiler && (
                  <div>
                    <Label htmlFor='precio_alquiler'>Precio de Alquiler (por día) *</Label>
                    <Input
                      id='precio_alquiler'
                      name='precio_alquiler'
                      type='number'
                      step='0.01'
                      value={productoFormData.precio_alquiler}
                      onChange={handleProductoChange}
                      placeholder='0.00'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='space-y-4 border-t pt-4'>
            <h3 className='text-lg font-semibold'>Información de Inventario</h3>

            <div className='grid grid-cols-2 gap-4'>
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
          <Button variant='outline' onClick={onClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? 'Subiendo imagen...' : (item ? 'Actualizar' : 'Registrar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddProducto