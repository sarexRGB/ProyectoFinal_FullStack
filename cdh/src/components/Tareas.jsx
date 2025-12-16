import React, { useEffect, useState } from 'react'
import { getNotificaciones, updateNotificacion, deleteNotificacion } from '../services/NotificacionesServices'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Trash } from "lucide-react"

function Tareas() {
    const [tareas, setTareas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadTareas()
    }, [])

    const loadTareas = async () => {
        try {
            const response = await getNotificaciones()
            const sortedTareas = response.data.sort((a, b) => {
                if (a.completada === b.completada) {
                    return new Date(b.fecha) - new Date(a.fecha)
                }
                return a.completada ? 1 : -1
            })
            setTareas(sortedTareas)
        } catch (error) {
            console.error("Error loading tasks", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDateChange = async (id, date) => {
        setTareas(prev => prev.map(t => t.id === id ? { ...t, fecha_realizacion: date } : t))
        try {
            await updateNotificacion(id, { fecha_realizacion: date, completada: !!date })
        } catch (error) {
            console.error("Error updating date", error)
            loadTareas()
        }
    }

    const handleCompletionChange = async (id, completed) => {
        let fecha = null;
        if (completed) {
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;
            const localDate = new Date(now.getTime() - offset);
            fecha = localDate.toISOString().slice(0, 16);
        }

        setTareas(prev => prev.map(t => t.id === id ? { ...t, completada: completed, fecha_realizacion: fecha } : t))
        try {
            const data = {
                completada: completed,
                fecha_realizacion: fecha
            }
            await updateNotificacion(id, data)
        } catch (error) {
            console.error("Error updating status", error)
            loadTareas()
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="p-6 w-full max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Mis Tareas</CardTitle>
                </CardHeader>
                <CardContent>
                    {tareas.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No tienes tareas asignadas.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tareas.map(tarea => (
                                <div
                                    key={tarea.id}
                                    className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg transition-colors ${tarea.completada ? 'bg-muted/50 border-muted' : 'bg-card border-border shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start space-x-4 flex-1 mb-4 md:mb-0">
                                        <Checkbox
                                            checked={tarea.completada}
                                            onCheckedChange={(checked) => handleCompletionChange(tarea.id, checked)}
                                            id={`task-${tarea.id}`}
                                            className="mt-1"
                                        />
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor={`task-${tarea.id}`}
                                                className={`text-base font-medium cursor-pointer ${tarea.completada ? 'line-through text-muted-foreground' : ''
                                                    }`}
                                            >
                                                {tarea.mensaje}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Asignada el: {new Date(tarea.fecha).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto pl-8 md:pl-0">
                                        <Label className="whitespace-nowrap text-sm text-muted-foreground">
                                            Realizada el:
                                        </Label>
                                        <Input
                                            type="datetime-local"
                                            value={tarea.fecha_realizacion ? tarea.fecha_realizacion.slice(0, 16) : ''}
                                            onChange={(e) => handleDateChange(tarea.id, e.target.value)}
                                            className="w-full md:w-56 h-8"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Tareas
