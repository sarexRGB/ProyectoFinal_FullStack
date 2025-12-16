import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { getMantenimientosProducto, getMantenimientosVehiculo } from '@/services/MantenimientoServices'
import { getProductos } from '@/services/ProductosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { Eye, Wrench } from 'lucide-react'
import AddMantenimientoModal from './AddMantenimientoModal'

function Mantenimientos() {
    const [mantenimientosProducto, setMantenimientosProducto] = useState([])
    const [mantenimientosVehiculo, setMantenimientosVehiculo] = useState([])
    const [productos, setProductos] = useState([])
    const [vehiculos, setVehiculos] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterTipo, setFilterTipo] = useState('todos')
    const [selectedMantenimiento, setSelectedMantenimiento] = useState(null)

    const [openDetails, setOpenDetails] = useState(false)
    const [openRegisterModal, setOpenRegisterModal] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [mantProd, mantVeh, prod, veh] = await Promise.all([
                getMantenimientosProducto(),
                getMantenimientosVehiculo(),
                getProductos(),
                getVehiculos()
            ])
            setMantenimientosProducto(mantProd.data)
            setMantenimientosVehiculo(mantVeh.data)
            setProductos(prod.data)
            setVehiculos(veh.data)
        } catch (error) {
            console.error('Error al obtener mantenimientos:', error)
            toast.error('Error al cargar mantenimientos')
        } finally {
            setLoading(false)
        }
    }

    const getProductoNombre = (id) => {
        const producto = productos.find(p => p.id === id)
        return producto ? producto.nombre : `Producto #${id}`
    }

    const getVehiculoNombre = (id) => {
        const vehiculo = vehiculos.find(v => v.id === id)
        return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}` : `Vehículo #${id}`
    }

    const combinedMantenimientos = [
        ...mantenimientosProducto.map(m => ({
            ...m,
            tipo_item: 'Producto',
            nombre_item: getProductoNombre(m.producto)
        })),
        ...mantenimientosVehiculo.map(m => ({
            ...m,
            tipo_item: 'Vehículo',
            nombre_item: getVehiculoNombre(m.vehiculo)
        }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    const filteredMantenimientos = combinedMantenimientos.filter(m => {
        if (filterTipo === 'todos') return true
        return m.tipo_item.toLowerCase() === filterTipo
    })

    const handleViewDetails = (mantenimiento) => {
        setSelectedMantenimiento(mantenimiento)
        setOpenDetails(true)
    }

    if (loading) {
        return <div className='p-6'>Cargando...</div>
    }

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <div className="flex items-center gap-4">
                    <h2 className='text-2xl font-bold'>Mantenimientos</h2>
                    <Button onClick={() => setOpenRegisterModal(true)}>
                        <Wrench className="mr-2 h-4 w-4" />
                        Registrar Mantenimiento
                    </Button>
                </div>

                <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger className='w-[200px]'>
                        <SelectValue placeholder='Filtrar por tipo' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='todos'>Todos</SelectItem>
                        <SelectItem value='producto'>Productos</SelectItem>
                        <SelectItem value='vehículo'>Vehículos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Mecánico</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Costo</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMantenimientos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className='text-center text-gray-500'>
                                    No hay mantenimientos registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMantenimientos.map((mant) => (
                                <TableRow key={`${mant.tipo_item}-${mant.id}`}>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${mant.tipo_item === 'Producto' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {mant.tipo_item}
                                        </span>
                                    </TableCell>
                                    <TableCell>{mant.nombre_item}</TableCell>
                                    <TableCell>{mant.mecanico || 'N/A'}</TableCell>
                                    <TableCell>{mant.fecha}</TableCell>
                                    <TableCell className='font-semibold'>₡{parseFloat(mant.costo).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleViewDetails(mant)}
                                        >
                                            <Eye className='h-4 w-4 mr-2' />
                                            Ver Detalles
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={openDetails} onOpenChange={setOpenDetails}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalles del Mantenimiento</DialogTitle>
                    </DialogHeader>
                    {selectedMantenimiento && (
                        <div className='space-y-4'>
                            <div>
                                <p className='text-sm font-semibold text-gray-600'>Tipo</p>
                                <p>{selectedMantenimiento.tipo_item}</p>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-600'>Item</p>
                                <p>{selectedMantenimiento.nombre_item}</p>
                            </div>
                            {selectedMantenimiento.mecanico && (
                                <div>
                                    <p className='text-sm font-semibold text-gray-600'>Mecánico</p>
                                    <p>{selectedMantenimiento.mecanico}</p>
                                </div>
                            )}
                            <div>
                                <p className='text-sm font-semibold text-gray-600'>Fecha</p>
                                <p>{selectedMantenimiento.fecha}</p>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-600'>Costo</p>
                                <p className='text-lg font-bold'>₡{parseFloat(selectedMantenimiento.costo).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-gray-600'>Descripción</p>
                                <p className='text-sm'>{selectedMantenimiento.descripcion || 'Sin descripción'}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AddMantenimientoModal
                isOpen={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                onSuccess={fetchData}
            />
        </div >
    )
}

export default Mantenimientos
