import React, { useEffect, useState } from 'react'
import { getNotificaciones } from '@/services/NotificacionesServices';
import { toast } from 'sonner';
import { DayPicker } from 'react-day-picker'
import { format, isSameDay, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';


function CalendarioChofer() {
    const [notificaciones, setNotificacioes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotificaciones();
    }, []);

    const fetchNotificaciones = async () => {
        try {
            const response = await getNotificaciones();
            setNotificacioes(response.data);
        } catch (error) {
            console.error('Error fetching notificaciones', error);
            toast.error('Error obteniendo las notificaciones');
        } finally {
            setLoading(false);
        }
    };

    const selectedDateTasks = notificaciones.filter(n => {
        const taskData = parseISO(n.fecha);
        return isSameDay(taskData, selectedDate);
    });

    const modifiers = {
        hasTask: (date) => notificaciones.some(n => isSameDay(parseISO(n.fecha), date))
    };

    const modifiersStyles = {
        hasTask: { fontWeight: 'bold', textDecoration: 'underline', color: 'var(--primary)' }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className='p-4 md:p-8 max-w-6xl mx-auto grid grid-cols-1 gap-8'>
            <Card>
                <CardContent className='flex justify-center'>
                    <div style={{
                        '--rdp-cell-size': '70px',
                        '--rdp-caption-font-size': '1.5rem',
                        fontSize: '1.2rem'
                    }}>
                        <style>{`
                        .rdp-day_selected { 
                            font-weight: bold; 
                            background-color: var(--primary);
                            color: white;
                        }
                        .rdp-table {
                            border-spacing: 15px;
                            border-collapse: separate;
                        }
                        .rdp-day {
                            border: 1px solid hsl(var(--border));
                            border-radius: 10px;
                            background-color: hsl(var(--secondary));
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            height: 60px;
                            width: 70px;
                        }
                        .rdp-day:hover:not(.rdp-day_selected) {
                            background-color: hsl(var(--accent));
                            cursor: pointer;
                        }
                    `}</style>
                        <DayPicker
                            mode='single'
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={es}
                            modifiers={modifiers}
                            modifiersStyles={modifiersStyles}
                            formatters={{
                                formatWeekdayName: (date) => format(date, 'eeeee', { locale: es }).toUpperCase()
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tareas del {format(selectedDate || new Date(), 'd MMMM', { locale: es })}</CardTitle>
                </CardHeader>
                <CardContent>
                    {selectedDateTasks.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDateTasks.map(task => (
                                <div key={task.id} className="p-4 border rounded shadow-sm bg-card">
                                    <p className="font-semibold">{task.mensaje}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <Badge variant={task.completada ? "default" : "secondary"}>
                                            {task.completada ? "Completada" : "Pendiente"}
                                        </Badge>
                                        {task.fecha_realizacion && (
                                            <span className="text-xs text-gray-500">
                                                {format(parseISO(task.fecha_realizacion), 'HH:mm')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-10">Sin tareas.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default CalendarioChofer