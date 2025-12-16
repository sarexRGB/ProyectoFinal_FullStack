import React, { useState, useEffect } from 'react'
import { getProductos, getModalidades, getProductoModalidades, getCategorias } from '@/services/ProductosServices'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Package, Loader2, ImageOff, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

function AdminCatalogo({ tipo }) {
    const [productos, setProductos] = useState([])
    const [modalidades, setModalidades] = useState([])
    const [productoModalidades, setProductoModalidades] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)

    const [filterStock, setFilterStock] = useState('todos')

    const [openModal, setOpenModal] = useState(false)
    const [selectedProducto, setSelectedProducto] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [productosRes, modalidadesRes, prodModalidadesRes, categoriasRes] = await Promise.all([
                getProductos(),
                getModalidades(),
                getProductoModalidades(),
                getCategorias()
            ])
            setProductos(productosRes.data)
            setModalidades(modalidadesRes.data)
            setProductoModalidades(prodModalidadesRes.data)
            setCategorias(categoriasRes.data)
        } catch (error) {
            console.error('Error al cargar datos:', error)
        } finally {
            setLoading(false)
        }
    }

    const getProductosFiltrados = () => {
        if (!modalidades.length || !productoModalidades.length) return []

        const tipoNormalizado = tipo.toLowerCase()
        const modalidad = modalidades.find(m =>
            m.nombre.toLowerCase() === tipoNormalizado
        )

        if (!modalidad) return []

        const productosIdsPorModalidad = productoModalidades
            .filter(pm => pm.modalidad === modalidad.id)
            .map(pm => pm.producto)

        let filtered = productos.filter(p => productosIdsPorModalidad.includes(p.id))

        if (filterStock !== 'todos') {
            if (filterStock === 'disponible') {
                filtered = filtered.filter(p => p.stock !== 0)
            } else if (filterStock === 'agotado') {
                filtered = filtered.filter(p => p.stock === 0)
            }
        }

        return filtered
    }

    const productosFiltrados = getProductosFiltrados()

    const getPrecio = (producto) => {
        if (tipo === 'alquiler') {
            return producto.precio_alquiler
                ? `₡${parseFloat(producto.precio_alquiler).toFixed(2)}/día`
                : 'Precio no disponible'
        } else {
            return producto.precio_venta
                ? `₡${parseFloat(producto.precio_venta).toFixed(2)}`
                : 'Precio no disponible'
        }
    }

    const handleVerDetalle = (producto) => {
        setSelectedProducto(producto)
        setOpenModal(true)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold capitalize">Catálogo de {tipo}</h1>
                    <p className="text-gray-500">Gestión de productos para {tipo}</p>
                </div>

                <div className="flex gap-4">
                    <div className="w-full md:w-72">
                        <Select value={filterStock} onValueChange={setFilterStock}>
                            <SelectTrigger className="w-full h-12 text-lg">
                                <SelectValue placeholder="Stock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos" className="text-lg">Todos</SelectItem>
                                <SelectItem value="disponible" className="text-lg">En Stock</SelectItem>
                                <SelectItem value="agotado" className="text-lg">Agotado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="ml-4 text-gray-600">Cargando productos...</p>
                </div>
            ) : (
                <>
                    {productosFiltrados.length === 0 ? (
                        <div className="text-center py-20 bg-muted rounded-lg border-2 border-dashed">
                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold">No hay productos disponibles</h3>
                            <p className="text-sm text-gray-500">
                                No se encontraron productos para {tipo} bajo los filtros actuales.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productosFiltrados.map(producto => (
                                <Card
                                    key={producto.id}
                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                    onClick={() => handleVerDetalle(producto)}
                                >
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                            {producto.nombre}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 h-10 text-xs">
                                            {producto.descripcion || 'Sin descripción'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 pb-6">
                                        <div className="aspect-video w-full bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                                            {producto.imagen ? (
                                                <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageOff className="h-8 w-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Precio:</span>
                                                <span className="font-semibold text-primary">{getPrecio(producto)}</span>
                                            </div>
                                            {producto.stock !== undefined && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Stock:</span>
                                                    <Badge variant={producto.stock !== 0 ? "secondary" : "destructive"} className="text-xs">
                                                        {producto.stock !== 0 ? `${producto.stock}` : "Agotado"}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}


            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalles del Producto</DialogTitle>
                        <DialogDescription>Información completa del producto seleccionado</DialogDescription>
                    </DialogHeader>

                    {selectedProducto && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
                                        {selectedProducto.imagen ? (
                                            <img
                                                src={selectedProducto.imagen}
                                                alt={selectedProducto.nombre}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <ImageOff className="h-20 w-20 text-gray-300" />
                                        )}
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">{selectedProducto.nombre}</h3>
                                        {selectedProducto.codigo && (
                                            <Badge variant="outline" className="mt-2 text-xs font-normal text-muted-foreground">
                                                Código: {selectedProducto.codigo}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                        <div className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                            <span className="font-semibold">Categoría:</span>
                                            <span>
                                                {categorias.find(c => c.id === (selectedProducto.categoria?.id || selectedProducto.categoria))?.nombre || 'N/A'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                            <span className="font-semibold">Precio {tipo === 'alquiler' ? 'Alquiler' : 'Venta'}:</span>
                                            <span className="text-xl font-bold text-primary">
                                                {getPrecio(selectedProducto)}
                                            </span>
                                        </div>

                                        {selectedProducto.stock !== undefined && (
                                            <div className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                                <span className="font-semibold">Stock Disponible:</span>
                                                <Badge variant={selectedProducto.stock > 0 ? "default" : "destructive"}>
                                                    {selectedProducto.stock > 0 ? `${selectedProducto.stock} Unidades` : 'Agotado'}
                                                </Badge>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <span className="font-semibold block mb-2 text-sm">Disponible para:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {productoModalidades
                                                    .filter(pm => pm.producto === selectedProducto.id)
                                                    .map(pm => {
                                                        const mod = modalidades.find(m => m.id === pm.modalidad)
                                                        return mod ? (
                                                            <Badge key={pm.id} variant="secondary">
                                                                {mod.nombre}
                                                            </Badge>
                                                        ) : null
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Descripción</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed p-3 rounded border h-32 overflow-y-auto">
                                            {selectedProducto.descripcion || 'No hay descripción disponible para este producto.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminCatalogo
