import React, { useState, useEffect } from 'react'
import { format, subDays, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { getAlquileres } from '@/services/AlquilerServices'
import { getProductos } from '@/services/ProductosServices'
import { getVehiculos } from '@/services/VehiculoServices'
import { getVentas } from '@/services/VentaServices'
import { getUsuarios } from '@/services/UsuariosServices'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Users, Activity, Package, Calendar } from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        revenue: 0,
        activeRentals: 0,
        monthlySales: 0,
        totalUsers: 0
    })
    const [incomeData, setIncomeData] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [equipmentStatus, setEquipmentStatus] = useState([])
    const [recentActivity, setRecentActivity] = useState([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            const [alquileresRes, productosRes, vehiculosRes, ventasRes, usuariosRes] = await Promise.all([
                getAlquileres(),
                getProductos(),
                getVehiculos(),
                getVentas(),
                getUsuarios()
            ])

            const alquileres = alquileresRes.data
            const productos = productosRes.data
            const vehiculos = vehiculosRes.data
            const ventas = ventasRes.data
            const usuarios = usuariosRes.data.filter(u => u.is_active !== false)

            calculateKPIs(alquileres, ventas, usuarios)
            processIncomeData(alquileres, ventas)
            processTopProducts(alquileres, productos)
            processEquipmentStatus(vehiculos)
            processRecentActivity(alquileres, ventas)

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateKPIs = (alquileres, ventas, usuarios) => {
        const now = new Date()
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)
        const rentalRevenue = alquileres
            .filter(a => a.estado !== 'CANCELADO' && isWithinInterval(parseISO(a.fecha_inicio), { start: monthStart, end: monthEnd }))
            .reduce((sum, a) => sum + parseFloat(a.total || 0), 0)

        const salesRevenue = ventas
            .filter(v => isWithinInterval(parseISO(v.fecha), { start: monthStart, end: monthEnd }))
            .reduce((sum, v) => sum + parseFloat(v.total || 0), 0)

        const activeRentals = alquileres.filter(a => a.estado === 'PENDIENTE' || a.estado === 'ACTIVO').length

        const monthlySalesCount = ventas.filter(v =>
            isWithinInterval(parseISO(v.fecha), { start: monthStart, end: monthEnd })
        ).length

        setStats({
            revenue: rentalRevenue + salesRevenue,
            activeRentals,
            monthlySales: monthlySalesCount,
            totalUsers: usuarios.length
        })
    }

    const processIncomeData = (alquileres, ventas) => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), 29 - i)
            return format(date, 'yyyy-MM-dd')
        })

        const incomeMap = {}
        last30Days.forEach(day => incomeMap[day] = 0)

        alquileres.forEach(a => {
            if (a.fecha_inicio && a.estado !== 'CANCELADO') {
                const day = format(parseISO(a.fecha_inicio), 'yyyy-MM-dd')
                if (incomeMap.hasOwnProperty(day)) {
                    incomeMap[day] += parseFloat(a.total || 0)
                }
            }
        })

        ventas.forEach(v => {
            if (v.fecha) {
                const day = format(parseISO(v.fecha), 'yyyy-MM-dd')
                if (incomeMap.hasOwnProperty(day)) {
                    incomeMap[day] += parseFloat(v.total || 0)
                }
            }
        })

        const chartData = last30Days.map(day => ({
            date: format(parseISO(day), 'dd/MM', { locale: es }),
            total: incomeMap[day]
        }))

        setIncomeData(chartData)
    }

    const processTopProducts = (alquileres, productos) => {
        const productCounts = {}

        alquileres.forEach(alquiler => {
            if (alquiler.producto && alquiler.estado !== 'CANCELADO') {
                const productId = alquiler.producto
                productCounts[productId] = (productCounts[productId] || 0) + 1
            }
        })

        const productMap = {}
        productos.forEach(p => productMap[p.id] = p.nombre)

        const productArray = Object.entries(productCounts).map(([id, count]) => ({
            nombre: productMap[id] || `ID ${id}`,
            cantidad: count
        }))

        productArray.sort((a, b) => b.cantidad - a.cantidad)
        setTopProducts(productArray.slice(0, 5))
    }

    const processEquipmentStatus = (vehiculos) => {
        const statusCounts = { 'DISPONIBLE': 0, 'ALQUILADO': 0, 'REPARACION': 0 }
        vehiculos.forEach(v => {
            const estado = v.estado?.toUpperCase() || 'DISPONIBLE'
            if (statusCounts.hasOwnProperty(estado)) statusCounts[estado]++
            else statusCounts['DISPONIBLE']++
        })

        setEquipmentStatus([
            { name: 'Disponibles', value: statusCounts['DISPONIBLE'] },
            { name: 'Alquilados', value: statusCounts['ALQUILADO'] },
            { name: 'En Reparación', value: statusCounts['REPARACION'] }
        ])
    }

    const processRecentActivity = (alquileres, ventas) => {
        const combined = [
            ...alquileres.map(a => ({ ...a, type: 'Alquiler', date: a.fecha_inicio })),
            ...ventas.map(v => ({ ...v, type: 'Venta', date: v.fecha }))
        ]

        combined.sort((a, b) => new Date(b.date) - new Date(a.date))
        setRecentActivity(combined.slice(0, 5))
    }

    if (loading) {
        return <div className="flex items-center justify-center h-96"><p className="text-lg text-gray-500">Cargando dashboard...</p></div>
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₡{stats.revenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total ventas y alquileres</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alquileres Activos</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeRentals}</div>
                        <p className="text-xs text-muted-foreground">En curso actualmente</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas (Mes)</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.monthlySales}</div>
                        <p className="text-xs text-muted-foreground">Transacciones realizadas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Tendencia de Ingresos (30 días)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={incomeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" name="Ingresos (₡)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                        <CardDescription>Últimas 5 transacciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${item.type === 'Alquiler' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                            {item.type === 'Alquiler' ? <Calendar className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium inline-flex items-center gap-2">
                                                {item.type}
                                                {item.type === 'Alquiler' && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${item.estado === 'CANCELADO' ? 'text-red-500 border-red-200 bg-red-50' :
                                                        item.estado === 'FINALIZADO' ? 'text-gray-500 border-gray-200 bg-gray-50' :
                                                            'text-blue-500 border-blue-200 bg-blue-50'
                                                        }`}>
                                                        {item.estado}
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold">
                                        ₡{parseFloat(item.total).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard
