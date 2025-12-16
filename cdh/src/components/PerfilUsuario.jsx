import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, User, Mail, Shield, Truck, Wrench, Package, MoreVertical, Pencil, Key, Trash, Phone, CalendarCheck } from 'lucide-react'
import { AuthContext } from '@/services/AuthContext'
import { getProfile } from '@/services/authServices'
import { getUsuario, deleteUsuario, resetPassword } from '@/services/UsuariosServices'
import Register from './Register'
import UpdatePerfil from '@/components/UpdatePerfil'

function PerfilUsuario({ userId }) {
    const navigate = useNavigate();
    const { user, loading: authLoading, roles } = useContext(AuthContext);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const isOwnProfile = !userId;

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        description: '',
        action: null
    });

    React.useEffect(() => {
        const fetchUsuarioCompleto = async () => {
            try {
                let response;
                if (userId) {
                    response = await getUsuario(userId);
                    setUsuario(response.data);
                } else if (user) {
                    response = await getProfile();
                    setUsuario(response);
                }
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchUsuarioCompleto();
        }
    }, [user, authLoading, userId]);

    const handleCloseEditModal = async () => {
        setOpenEditModal(false);
        try {
            let response;
            if (userId) {
                response = await getUsuario(userId);
                setUsuario(response.data);
            } else if (user) {
                response = await getProfile();
                setUsuario(response);
            }
        } catch (error) {
            console.error("Error al refrescar usuario:", error);
        }
    };

    const handleRestorePassword = () => {
        setAlertConfig({
            isOpen: true,
            title: '¿Restaurar contraseña?',
            description: `¿Estás seguro de que deseas restaurar la contraseña del usuario "${usuario?.username}" a "central2025"?`,
            action: async () => {
                try {
                    await resetPassword(usuario.id);
                    toast('Contraseña restablecida exitosamente');
                } catch (error) {
                    console.error("Error al restablecer contraseña:", error);
                    toast('Error al restablecer la contraseña');
                }
            }
        });
    };

    const handleUpdateUser = async (data) => {
        await updateUsuario(usuario.id, data);
    };

    const handleDeleteUser = () => {
        if (!userId) return;

        setAlertConfig({
            isOpen: true,
            title: '¿Eliminar usuario?',
            description: `¿Estás seguro de que deseas eliminar el usuario "${usuario?.username}"? Esta acción no se puede deshacer.`,
            action: async () => {
                try {
                    await deleteUsuario(userId);
                    toast('Usuario eliminado exitosamente');
                    navigate('/admin/personal');
                } catch (error) {
                    console.error("Error al eliminar usuario:", error);
                    toast('Error al eliminar el usuario. Por favor, intenta de nuevo.');
                }
            }
        });
    };

    if (authLoading || loading) {
        return <div className="p-6">Cargando perfil...</div>;
    }

    if (!user) {
        return <div className="p-6">Debes iniciar sesión para ver tu perfil</div>;
    }

    if (!usuario) {
        return <div className="p-6">No se pudo cargar la información del perfil</div>;
    }

    const renderRoleInfo = () => {

        if (!usuario.role_data || !usuario.groups) {
            return null;
        }

        const roleCards = [];

        usuario.groups.forEach(group => {
            const roleData = usuario.role_data[group.id];

            if (!roleData) {
                return;
            }

            if (group.name.toLowerCase().includes('chofer')) {
                roleCards.push(
                    <Card key={`chofer-${group.id}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Truck size={18} /> Chofer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Número de Licencia:</strong> {roleData.licencia_numero || 'N/A'}</p>
                            <p><strong>Tipo de Licencia:</strong> {roleData.licencia_tipo || 'N/A'}</p>
                            <p><strong>Fecha de Vencimiento:</strong> {roleData.fecha_vencimiento || 'N/A'}</p>
                            <p><strong>Años de Experiencia:</strong> {roleData.experiencia_anios || 'N/A'}</p>
                            {roleData.observaciones && (
                                <p><strong>Observaciones:</strong> {roleData.observaciones}</p>
                            )}
                        </CardContent>
                    </Card>
                );
            }

            if (group.name.toLowerCase().includes('mecánico')) {
                roleCards.push(
                    <Card key={`mecanico-${group.id}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Wrench size={18} /> Mecánico
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Especialidad:</strong> {roleData.especialidad || 'N/A'}</p>
                            {roleData.certificaciones && (
                                <p><strong>Certificaciones:</strong> {roleData.certificaciones}</p>
                            )}
                            <p><strong>Años de Experiencia:</strong> {roleData.experiencia_anios || 'N/A'}</p>
                            {roleData.observaciones && (
                                <p><strong>Observaciones:</strong> {roleData.observaciones}</p>
                            )}
                        </CardContent>
                    </Card>
                );
            }

            if (group.name.toLowerCase().includes('despacho')) {
                roleCards.push(
                    <Card key={`despacho-${group.id}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Package size={18} /> Despacho
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {roleData.observaciones ? (
                                <p><strong>Observaciones:</strong> {roleData.observaciones}</p>
                            ) : (
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium">Observaciones:</Label>
                                    <textarea
                                        className="w-full min-h-[60px] p-2 rounded-md border text-sm text-gray-500 resize-none focus:outline-none"
                                        disabled
                                        value="No hay observaciones"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            }
        });

        if (roleCards.length === 0) {
            return null;
        }

        return (
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información de Rol</h3>
                {roleCards}
            </div>
        );
    };

    return (
        <div className='p-6 max-w-4xl mx-auto'>
            <div className='mb-6 flex justify-between items-center'>
                <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
                    <ArrowLeft size={20} /> Volver
                </Button>

                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <MoreVertical size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                variant='outline'
                                className='flex items-center gap-2'
                                onClick={() => setOpenEditModal(true)}
                            >
                                <Pencil size={18} />
                                Editar Perfil
                            </DropdownMenuItem>
                            {isOwnProfile ? (
                                <DropdownMenuItem>
                                    <Key size={18} className='mr-2' />
                                    Cambiar Contraseña
                                </DropdownMenuItem>
                            ) : (
                                <>
                                    <DropdownMenuItem
                                        variant='outline'
                                        className='flex items-center gap-2'
                                        onClick={handleRestorePassword}
                                    >
                                        <Key size={18} />
                                        Restaurar Contraseña
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant='outline'
                                        className='flex items-center gap-2'
                                        onClick={() => handleDeleteUser(true)}
                                    >
                                        <Trash size={18} />
                                        Eliminar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={() => navigate(`/admin/asistencias/usuario/${usuario.id}`)}
                                    >
                                        <CalendarCheck size={18} />
                                        Ver Asistencia
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <User size={32} className="text-primary" />
                        </div>
                        {usuario.username}
                    </CardTitle>
                    <CardDescription>{isOwnProfile ? 'Mi Perfil' : 'Perfil de Usuario'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <User size={16} /> Nombre Completo
                            </Label>
                            <p className="text-lg">{usuario.nombre_completo}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Mail size={16} /> Email
                            </Label>
                            <p className="text-lg">{usuario.email}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Phone size={16} /> Telefono
                            </Label>
                            <p className="text-lg">{usuario.telefono}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Shield size={16} /> Roles
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {usuario.groups && usuario.groups.length > 0 ? (
                                    usuario.groups.map((group, index) => (
                                        <span key={index} className="px-2 py-1 bg-secondary rounded-md text-sm font-medium">
                                            {group.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground italic">Sin roles asignados</span>
                                )}
                            </div>
                        </div>
                        {usuario.fecha_ingreso && (
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</Label>
                                <p className="text-lg">{new Date(usuario.fecha_ingreso).toLocaleDateString('es-ES')}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {renderRoleInfo()}

            {openEditModal && (
                isOwnProfile ? (
                    <UpdatePerfil
                        isOpen={openEditModal}
                        onClose={handleCloseEditModal}
                        usuario={usuario} />
                ) : (
                    <Register
                        isOpen={openEditModal}
                        onClose={handleCloseEditModal}
                        usuario={usuario} />
                )
            )}

            <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertConfig.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (alertConfig.action) alertConfig.action();
                        }}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default PerfilUsuario