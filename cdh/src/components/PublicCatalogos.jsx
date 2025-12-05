import React, { useState, useEffect } from 'react'
import { getProductos, getModalidades, getProductoModalidades } from '@/services/ProductosServices'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wrench, ShoppingCart, Package, Loader2, Info, ImageOff } from 'lucide-react'

function PublicCatalogos() {
    const [catalogoType, setCatalogoType] = useState('alquiler');
    const [productos, setProductos] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [productoModalidades, setProductoModalidades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productosRes, modalidadesRes, prodModalidadesRes] = await Promise.all([
                getProductos(),
                getModalidades(),
                getProductoModalidades()
            ]);
            setProductos(productosRes.data);
            setModalidades(modalidadesRes.data);
            setProductoModalidades(prodModalidadesRes.data);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar productos según el tipo de catálogo (alquiler o venta)
    const getProductosFiltrados = () => {
        if (!modalidades.length || !productoModalidades.length) return [];

        // Encontrar la modalidad correspondiente
        const modalidad = modalidades.find(m =>
            m.nombre.toLowerCase() === catalogoType.toLowerCase()
        );

        if (!modalidad) return [];

        // Obtener IDs de productos que tienen esta modalidad
        const productosConModalidad = productoModalidades
            .filter(pm => pm.modalidad === modalidad.id)
            .map(pm => pm.producto);

        // Filtrar productos
        return productos.filter(p => productosConModalidad.includes(p.id));
    };

    const productosFiltrados = getProductosFiltrados();

    // Obtener precio según modalidad
    const getPrecio = (producto) => {
        if (catalogoType === 'alquiler') {
            return producto.precio_alquiler
                ? `$${parseFloat(producto.precio_alquiler).toFixed(2)}/día`
                : 'Precio no disponible';
        } else {
            return producto.precio_venta
                ? `$${parseFloat(producto.precio_venta).toFixed(2)}`
                : 'Precio no disponible';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header con selector de catálogo */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Catálogo de {catalogoType === 'alquiler' ? 'Alquiler' : 'Venta'}
                        </h1>
                        <p className="text-gray-600">
                            Explora la maquinaria y herramientas disponibles para {catalogoType}
                        </p>
                    </div>

                    {/* Select para cambiar entre alquiler y venta */}
                    <div className="w-full md:w-64">
                        <Select value={catalogoType} onValueChange={setCatalogoType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona tipo de catálogo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="alquiler">
                                    <div className="flex items-center gap-2">
                                        <Wrench className="h-4 w-4" />
                                        <span>Alquiler</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="venta">
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="h-4 w-4" />
                                        <span>Venta</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="ml-4 text-gray-600">Cargando productos...</p>
                </div>
            ) : (
                <>
                    {/* Empty state */}
                    {productosFiltrados.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-2xl font-semibold mb-2">
                                No hay productos disponibles
                            </h3>
                            <p className="text-gray-600">
                                No se encontraron productos para {catalogoType} en este momento.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Contador de productos */}
                            <div className="mb-4">
                                <Badge variant="secondary">
                                    {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} disponible{productosFiltrados.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>

                            {/* Grid de productos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {productosFiltrados.map(producto => (
                                    <Card key={producto.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {producto.descripcion || 'Sin descripción'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Imagen del producto */}
                                            {producto.imagen ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    className="w-full h-48 object-cover rounded-md mb-4"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                                    <ImageOff className="h-12 w-12 text-gray-400" />
                                                </div>
                                            )}

                                            {/* Información del producto */}
                                            <div className="space-y-2">
                                                {/* Precio condicional */}
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Precio:</span>
                                                    <span className="text-lg font-bold text-primary">
                                                        {getPrecio(producto)}
                                                    </span>
                                                </div>

                                                {/* Categoría */}
                                                {producto.categoria_nombre && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Categoría:</span>
                                                        <Badge variant="outline">
                                                            {producto.categoria_nombre}
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Stock disponible (solo para venta) */}
                                                {catalogoType === 'venta' && producto.stock !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">Stock:</span>
                                                        <Badge
                                                            variant={producto.stock > 0 ? 'success' : 'destructive'}
                                                        >
                                                            {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex gap-2"> 
                                            <Button className="flex-1" variant="default">
                                                {catalogoType === 'alquiler' ? (
                                                    <>
                                                        <Wrench className="h-4 w-4 mr-2" />
                                                        Alquilar
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                                        Comprar
                                                    </>
                                                )}
                                            </Button>
                                            <Button variant="outline" size="icon">
                                                <Info className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default PublicCatalogos