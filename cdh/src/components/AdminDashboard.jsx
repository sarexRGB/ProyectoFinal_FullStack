import React, { useState, useEffect } from 'react'
import { format, subDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { getAlquileres } from '@/services/AlquilerServices'
import { getProductos } from '@/services/ProductosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [rentalsByDay, setRentalsByDay] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [equipmentStatus, setEquipmentStatus] = useState([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            const [alquileresRes, productosRes, vehiculosRes] = await Promise.all([
                getAlquileres(),
                getProductos(),
                getVehiculos()
            ])

            const alquileres = alquileresRes.data
            const productos = productosRes.data
            const vehiculos = vehiculosRes.data

            processRentalsByDay(alquileres)
            processTopProducts(alquileres, productos)
            processEquipmentStatus(vehiculos)

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const processRentalsByDay = (alquileres) => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), 29 - i)
            return format(date, 'yyyy-MM-dd')
        })

        const rentalCounts = {}
        last30Days.forEach(day => {
            rentalCounts[day] = 0
        })

        alquileres.forEach(alquiler => {
            if (alquiler.fecha_inicio) {
                const startDate = format(parseISO(alquiler.fecha_inicio), 'yyyy-MM-dd')
                if (rentalCounts.hasOwnProperty(startDate)) {
                    rentalCounts[startDate]++
                }
            }
        })

        const chartData = last30Days.map(day => ({
            date: format(parseISO(day), 'dd/MM', { locale: es }),
            cantidad: rentalCounts[day]
        }))

        setRentalsByDay(chartData)
    }

    const processTopProducts = (alquileres, productos) => {
        const productCounts = {}

        alquileres.forEach(alquiler => {
            if (alquiler.producto) {
                const productId = alquiler.producto
                productCounts[productId] = (productCounts[productId] || 0) + 1
            }
        })

        const productMap = {}
        productos.forEach(p => {
            productMap[p.id] = p.nombre
        })

        const productArray = Object.entries(productCounts).map(([id, count]) => ({
            nombre: productMap[id] || `Producto ${id}`,
            cantidad: count
        }))

        productArray.sort((a, b) => b.cantidad - a.cantidad)

        setTopProducts(productArray.slice(0, 5))
    }

    const processEquipmentStatus = (vehiculos) => {
        const statusCounts = {
            'DISPONIBLE': 0,
            'ALQUILADO': 0,
            'REPARACION': 0
        }

        vehiculos.forEach(vehiculo => {
            const estado = vehiculo.estado?.toUpperCase() || 'DISPONIBLE'
            if (statusCounts.hasOwnProperty(estado)) {
                statusCounts[estado]++
            } else {
                statusCounts['DISPONIBLE']++
            }
        })

        const chartData = [
            { name: 'Disponibles', value: statusCounts['DISPONIBLE'] },
            { name: 'Alquilados', value: statusCounts['ALQUILADO'] },
            { name: 'En Reparación', value: statusCounts['REPARACION'] }
        ]

        setEquipmentStatus(chartData)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-lg text-gray-500">Cargando estadísticas...</p>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard de Administración</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Alquileres del Último Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={rentalsByDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="cantidad"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    name="Alquileres"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Productos Más Alquilados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nombre" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cantidad" fill="#82ca9d" name="Veces Alquilado" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Estado de Equipos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={equipmentStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {equipmentStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard
