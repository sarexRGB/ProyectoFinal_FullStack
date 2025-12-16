import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAsistencias, getUsuario } from '@/services/UsuariosServices'
import { toast } from 'sonner'
import { ArrowLeft, UserCheck, UserX, Clock } from 'lucide-react'

function HistorialAsistencia() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [asistencias, setAsistencias] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [userRes, asistenciasRes] = await Promise.all([
                    getUsuario(id),
                    getAsistencias()
                ])

                setUsuario(userRes.data)

                const fullName = `${userRes.data.first_name} ${userRes.data.last_name}`.trim()

                const userAsistencias = asistenciasRes.data.filter(a =>
                    a.empleado_nombre === fullName
                )

                setAsistencias(userAsistencias)
            } catch (error) {
                console.error("Error loading history:", error)
                toast.error("Error al cargar el historial")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadData()
        }
    }, [id])

    const stats = {
        presente: asistencias.filter(a => a.estado === 'Presente').length,
        ausente: asistencias.filter(a => a.estado === 'Ausente').length,
        justificado: asistencias.filter(a => a.estado === 'Justificado').length,
        tardanzas: asistencias.filter(a => a.estado === 'Tarde').length
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Historial de Asistencia</h1>
                    {usuario && <p className="text-muted-foreground">{usuario.first_name} {usuario.last_name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Asistencias</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.presente}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tardías</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tardanzas}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ausencias</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.ausente}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Justificadas</CardTitle>
                        <UserCheck className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.justificado}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registro Detallado</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Entrada</TableHead>
                                <TableHead>Salida</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {asistencias.length > 0 ? (
                                asistencias.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.fecha}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.estado === 'Presente' ? 'bg-green-100 text-green-800' :
                                                item.estado === 'Tarde' ? 'bg-orange-100 text-orange-800' :
                                                    item.estado === 'Ausente' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.estado}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.hora_entrada || '-'}</TableCell>
                                        <TableCell>{item.hora_salida || '-'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4">
                                        No hay registros disponibles para este usuario.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default HistorialAsistencia
