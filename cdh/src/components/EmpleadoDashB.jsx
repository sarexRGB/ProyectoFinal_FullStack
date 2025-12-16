import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock, ListTodo, ArrowRight } from "lucide-react"
import { getNotificaciones } from '@/services/NotificacionesServices'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/services/AuthContext'

function EmpleadoDashB() {
    const [tareas, setTareas] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        pendientes: 0,
        completadas: 0,
        total: 0
    })
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getNotificaciones()
                const data = response.data
                setTareas(data)

                const pendientes = data.filter(t => !t.completada).length
                const completadas = data.filter(t => t.completada).length

                setStats({
                    pendientes,
                    completadas,
                    total: data.length
                })
            } catch (error) {
                console.error("Error fetching dashboard data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const recentPending = tareas
        .filter(t => !t.completada)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3)

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel de Empleado</h1>
                    <p className="text-muted-foreground">Bienvenido de nuevo, {user?.first_name || user?.username || 'Usuario'}.</p>
                </div>
                <Button onClick={() => navigate('/empleado/tareas')}>
                    Ver todas las tareas <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tareas Pendientes
                        </CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendientes}</div>
                        <p className="text-xs text-muted-foreground">
                            Requieren atención
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tareas Completadas
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completadas}</div>
                        <p className="text-xs text-muted-foreground">
                            Total histórico
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Asignadas
                        </CardTitle>
                        <ListTodo className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            Tareas en total
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Próximas Tareas</CardTitle>
                        <CardDescription>
                            Las tareas más recientes asignadas a usted.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentPending.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No hay tareas pendientes.</p>
                        ) : (
                            <div className="space-y-4">
                                {recentPending.map(tarea => (
                                    <div key={tarea.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none">{tarea.mensaje}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Asignada el: {new Date(tarea.fecha).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default EmpleadoDashB