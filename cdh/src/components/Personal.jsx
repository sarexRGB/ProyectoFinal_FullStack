import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash } from 'lucide-react'
import RegisterEmpleado from '@/components/RegisterEmpleado'
import { getUsuarios } from '@/services/UsuariosServices'

function Personal() {
    const [empleados, setEmpleados] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);

    useEffect(() => {
        fetchEmpleados();
    }, [])

    const fetchEmpleados = async () => {
        try {
            const data = await getUsuarios();
            setEmpleados(data.filter(u => u.roles?.length > 0));
        } catch (error) {
            console.error("Error al obtener empleados", error);
        }
    };

    const handleEdit = (empleado) => {
        setSelectedEmpleado(empleado);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedEmpleado(null);
        setOpenModal(false);
        fetchEmpleados();
    };

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Personal</h1>
                <Button onClick={() => setOpenModal(true)} variant='default' className='flex items-center gap-2'>
                    <Plus size={18} /> Agregar Empleado
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {empleados.map((empleado) => (
                        <TableRow key={empleado.id}>
                            <TableCell>{empleado.username}</TableCell>
                            <TableCell>{empleado.email}</TableCell>
                            <TableCell>{empleado.roles}</TableCell>
                            <TableCell className='flex gap-2'>
                                <Button size='sm' viarian='outline' onClick={() => handleEdit(empleado)}>
                                    <Edit size={16} />
                                </Button>
                                <Button size='sm' variant='destructive'>
                                    <Trash size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {openModal && (
                <RegisterEmpleado
                    isOpen={openModal}
                    onClose={handleCloseModal}
                    empleado={selectedEmpleado}
                />
            )}
        </div>
    )
}

export default Personal