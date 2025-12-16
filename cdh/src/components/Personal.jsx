import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, User, Key, MoreVertical } from 'lucide-react'
import Register from '@/components/Register'
import { getUsuarios } from '@/services/UsuariosServices'

function Personal() {
    const navigate = useNavigate();
    const [usuarios, setUsuario] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [roleFilter, setRoleFilter] = useState('todos');

    useEffect(() => {
        fetchUsuarios();
    }, [])

    const fetchUsuarios = async () => {
        try {
            const response = await getUsuarios();
            setUsuario(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error al obtener usuarios", error);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        fetchUsuarios();
    };

    const filteredUsuarios = usuarios.filter(usuario => {
        if (roleFilter === 'todos') return true;
        return Array.isArray(usuario.roles) && usuario.roles.includes(roleFilter);
    })

    return (
        <div className='p-6'>
            <div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="Mecánico">Mecánico</SelectItem>
                        <SelectItem value="Chofer">Chofer</SelectItem>
                        <SelectItem value="Despacho">Despacho</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex justify-end items-center mb-4 gap-2'>
                <Button onClick={() => setOpenModal(true)} variant='default' className='flex items-center gap-2'>
                    <Plus size={18} /> Agregar Empleado
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <MoreVertical size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => navigate('/admin/roles')}>
                            <Key size={18} className="mr-2" />
                            Roles
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-lg font-semibold'>Nombre</TableHead>
                        <TableHead className='text-lg font-semibold'>Teléfono</TableHead>
                        <TableHead className='text-lg font-semibold'>Email</TableHead>
                        <TableHead className='text-lg font-semibold'>Roles</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsuarios.map((usuario) => (
                        <TableRow
                            key={usuario.id}
                            onClick={() => navigate(`/admin/personal/${usuario.id}`)}
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <TableCell className='text-sm text-gray-300'>{usuario.nombre_completo}</TableCell>
                            <TableCell className='text-sm text-gray-300'>{usuario.telefono}</TableCell>
                            <TableCell className='text-sm text-gray-300'>{usuario.email}</TableCell>
                            <TableCell className='text-sm text-gray-300'>{usuario.roles?.join(" / ") || 'Sin roles'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {openModal && (
                <Register
                    isOpen={openModal}
                    onClose={handleCloseModal}
                />
            )}

        </div>
    )
}

export default Personal