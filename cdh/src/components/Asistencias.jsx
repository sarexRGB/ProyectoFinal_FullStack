import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getAsistencias, createAsistencia, updateAsistencia, getEmpleados } from '@/services/UsuariosServices'
import { toast } from 'sonner'
import { CalendarIcon, Clock, User } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"

function Asistencias() {
    const [asistencias, setAsistencias] = useState([])
    const [empleados, setEmpleados] = useState([])
    const [formData, setFormData] = useState({
        empleado: '',
        fecha: new Date().toISOString().split('T')[0],
        hora_entrada: '',
        hora_salida: '',
        estado: 'Presente'
    })
    const [existingRecord, setExistingRecord] = useState(null)
    const [mode, setMode] = useState('entry') // 'entry', 'exit', 'completed'

    const [isExitModalOpen, setIsExitModalOpen] = useState(false)
    const [selectedExitRecord, setSelectedExitRecord] = useState(null)
    const [exitTime, setExitTime] = useState('')

    // Filters
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0])
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        checkExistingRecord()
    }, [formData.empleado, formData.fecha, asistencias])

    const fetchData = async () => {
        try {
            const [asistenciaRes, empleadosRes] = await Promise.all([
                getAsistencias(),
                getEmpleados()
            ])
            setAsistencias(asistenciaRes.data)
            setEmpleados(empleadosRes.data)
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Error al cargar los datos")
        }
    }

    const checkExistingRecord = () => {
        if (!formData.empleado || !formData.fecha) return

        const record = asistencias.find(a =>
            String(a.empleado) === String(formData.empleado) &&
            a.fecha === formData.fecha
        )

        setExistingRecord(record)

        if (record) {
            if (record.hora_salida) {
                setMode('completed')
            } else {
                setMode('exit')
                // Pre-fill form with existing data
                setFormData(prev => ({
                    ...prev,
                    hora_entrada: record.hora_entrada,
                    estado: record.estado
                }))
            }
        } else {
            setMode('entry')
            // Reset fields for new entry if switching between modes
            setFormData(prev => ({
                ...prev,
                hora_entrada: '',
                hora_salida: '',
                estado: 'Presente'
            }))
        }
    }

    const filteredAsistencias = asistencias.filter(item => {
        const matchesDate = filterDate ? item.fecha === filterDate : true
        const matchesStatus = filterStatus && filterStatus !== 'all' ? item.estado === filterStatus : true
        return matchesDate && matchesStatus
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!formData.empleado || !formData.fecha) {
                toast.error("Por favor complete los campos obligatorios")
                return
            }

            if (mode === 'entry') {
                if ((formData.estado === 'Presente' || formData.estado === 'Tarde') && !formData.hora_entrada) {
                    toast.error("Hora de entrada obligatoria")
                    return
                }

                // Clean data
                const dataToSend = { ...formData }
                if (dataToSend.estado !== 'Presente' && dataToSend.estado !== 'Tarde') {
                    dataToSend.hora_entrada = null
                }
                dataToSend.hora_salida = null // Ensure no exit time on entry

                await createAsistencia(dataToSend)
                toast.success("Entrada registrada correctamente")

            } else if (mode === 'exit') {
                // If using main form for exit (backup or legacy flow), ensure logic holds
                if (!formData.hora_salida) {
                    toast.error("Hora de salida obligatoria")
                    return
                }

                await updateAsistencia(existingRecord.id, {
                    ...existingRecord,
                    hora_salida: formData.hora_salida
                })
                toast.success("Salida registrada correctamente")
            }

            setFormData(prev => ({
                ...prev,
                empleado: '',
                hora_entrada: '',
                hora_salida: '',
                estado: 'Presente'
            }))
            fetchData()
        } catch (error) {
            console.error("Error processing asistencia:", error)
            toast.error("Error al procesar la solicitud")
        }
    }

    const handleOpenExitModal = (record) => {
        setSelectedExitRecord(record)
        setExitTime('')
        setIsExitModalOpen(true)
    }

    const handleRegisterExit = async () => {
        if (!exitTime) {
            toast.error("Por favor ingrese la hora de salida")
            return
        }

        try {
            await updateAsistencia(selectedExitRecord.id, {
                ...selectedExitRecord,
                hora_salida: exitTime
            })
            toast.success("Salida registrada correctamente")
            setIsExitModalOpen(false)
            fetchData()
        } catch (error) {
            console.error("Error registering exit:", error)
            toast.error("Error al registrar salida")
        }
    }


    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Gestión de Asistencias</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>
                            {mode === 'entry' ? 'Registrar Entrada' :
                                mode === 'exit' ? 'Registrar Salida' :
                                    'Registro Completado'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="empleado">Empleado</Label>
                                <Select
                                    value={formData.empleado}
                                    onValueChange={(value) => handleSelectChange('empleado', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar empleado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {empleados.map(emp => (
                                            <SelectItem key={emp.id} value={String(emp.id)}>
                                                {emp.first_name} {emp.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha">Fecha</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        name="fecha"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {mode === 'entry' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="estado">Estado</Label>
                                        <Select
                                            value={formData.estado}
                                            onValueChange={(value) => handleSelectChange('estado', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Presente">Presente</SelectItem>
                                                <SelectItem value="Tarde">Tarde</SelectItem>
                                                <SelectItem value="Ausente">Ausente</SelectItem>
                                                <SelectItem value="Justificado">Justificado</SelectItem>
                                                <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                                                <SelectItem value="Permiso">Permiso</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {(formData.estado === 'Presente' || formData.estado === 'Tarde') && (
                                        <div className="space-y-2">
                                            <Label htmlFor="hora_entrada">Hora de Entrada</Label>
                                            <Input
                                                type="time"
                                                name="hora_entrada"
                                                value={formData.hora_entrada}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {mode === 'exit' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-muted rounded-md text-sm">
                                        <p><strong>Entrada:</strong> {existingRecord?.hora_entrada}</p>
                                        <p><strong>Estado:</strong> {existingRecord?.estado}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hora_salida">Hora de Salida</Label>
                                        <Input
                                            type="time"
                                            name="hora_salida"
                                            value={formData.hora_salida}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {mode === 'completed' && (
                                <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm">
                                    <p>La asistencia para este empleado y fecha ya está completa.</p>
                                    <p><strong>Entrada:</strong> {existingRecord?.hora_entrada}</p>
                                    <p><strong>Salida:</strong> {existingRecord?.hora_salida}</p>
                                </div>
                            )}

                            {mode !== 'completed' && (
                                <Button type="submit" className="w-full">
                                    {mode === 'entry' ? 'Registrar Entrada' : 'Registrar Salida'}
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Registros</CardTitle>
                        <div className="flex gap-4 pt-4">
                            <div className="w-full sm:w-auto">
                                <Label htmlFor="filter-date" className="text-xs mb-1 block">Filtrar por Fecha</Label>
                                <Input
                                    id="filter-date"
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="w-full sm:w-[150px]"
                                />
                            </div>
                            <div className="w-full sm:w-auto">
                                <Label htmlFor="filter-status" className="text-xs mb-1 block">Filtrar por Estado</Label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="Presente">Presente</SelectItem>
                                        <SelectItem value="Tarde">Tarde</SelectItem>
                                        <SelectItem value="Ausente">Ausente</SelectItem>
                                        <SelectItem value="Justificado">Justificado</SelectItem>
                                        <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                                        <SelectItem value="Permiso">Permiso</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Empleado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Entrada</TableHead>
                                    <TableHead>Salida</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAsistencias.length > 0 ? (
                                    filteredAsistencias.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.empleado_nombre || item.empleado?.nombre_completo || 'N/A'}</TableCell>
                                            <TableCell>{item.fecha}</TableCell>
                                            <TableCell>{item.hora_entrada || '-'}</TableCell>
                                            <TableCell>
                                                {item.hora_salida ? (
                                                    item.hora_salida
                                                ) : (
                                                    item.estado === 'Presente' || item.estado === 'Tarde' ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                                            onClick={() => handleOpenExitModal(item)}
                                                        >
                                                            Registrar Salida
                                                        </Button>
                                                    ) : '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${item.estado === 'Presente' ? 'bg-green-100 text-green-800' :
                                                    item.estado === 'Tarde' ? 'bg-orange-100 text-orange-800' :
                                                        item.estado === 'Ausente' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {item.estado}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">
                                            No hay registros encontrados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Salida</DialogTitle>
                        <DialogDescription>
                            Confirmar hora de salida para el empleado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="p-4 bg-muted rounded-md text-sm">
                            <p><strong>Empleado:</strong> {selectedExitRecord?.empleado_nombre || selectedExitRecord?.empleado?.nombre_completo}</p>
                            <p><strong>Entrada:</strong> {selectedExitRecord?.hora_entrada}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="modal-hora-salida">Hora de Salida</Label>
                            <Input
                                id="modal-hora-salida"
                                type="time"
                                value={exitTime}
                                onChange={(e) => setExitTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsExitModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleRegisterExit}>Confirmar Salida</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Asistencias
