import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { registerUser, updateProfile } from '@/services/authServices'
import { updateUsuario, getRolesEmpleado } from '@/services/UsuariosServices'

function Register({ isOpen, onClose, usuario, isOwnProfile = false }) {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        segundo_apellido: '',
        telefono: '',
        email: '',
        fecha_ingreso: '',
        password: '',
    });

    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [roleData, setRoleData] = useState({});

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRolesEmpleado();

                setGroups(response.data);

                if (usuario) {
                    setFormData({
                        username: usuario.username || '',
                        first_name: usuario.first_name || '',
                        last_name: usuario.last_name || '',
                        segundo_apellido: usuario.segundo_apellido || '',
                        telefono: usuario.telefono || '+506 ',
                        email: usuario.email || '',
                        fecha_ingreso: usuario.fecha_ingreso ? usuario.fecha_ingreso : '',
                        password: '',
                    });

                    setSelectedGroups(usuario.groups?.map(g => g.id) || []);

                    if (usuario.role_data) {
                        setRoleData(usuario.role_data);
                    }
                } else {
                    setFormData({ username: '', first_name: '', last_name: '', segundo_apellido: '', telefono: '+506 ', email: '', password: '' });
                    setSelectedGroups([]);
                    setRoleData({});
                }
            } catch (error) {
                console.error('Error al cargar grupos', error);
            }
        };
        fetchRoles();
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'telefono') {
            if (!value.startsWith('+506 ')) {
                setFormData({ ...formData, [name]: '+506 ' + value.replace(/^\+506\s*/, '') });
                return;
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleDataChange = (groupId, field, value) => {
        let finalValue = value;

        if (field === 'licencia_numero') {
            finalValue = value.replace(/[\s-]/g, '');
        }

        setRoleData(prev => ({
            ...prev,
            [String(groupId)]: {
                ...prev[String(groupId)],
                [field]: finalValue
            }
        }));
    };

    const handleGroupChange = (groupId, checked) => {
        if (typeof checked === 'boolean') {
            if (checked) {
                setSelectedGroups(prev => prev.includes(groupId) ? prev : [...prev, groupId]);
                if (!roleData[String(groupId)]) {
                    setRoleData(prev => ({ ...prev, [String(groupId)]: {} }));
                }
            } else {
                setSelectedGroups(prev => prev.filter(id => id !== groupId));
                setRoleData(prev => {
                    const newData = { ...prev };
                    delete newData[String(groupId)];
                    return newData;
                });
            }
        } else {
            setSelectedGroups(prev =>
                prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
            );
        }
    };

    const isFormValid = () => {
        return formData.username.trim() && formData.email.trim() && (usuario || formData.password.trim());
    };

    const validateLicense = () => {
        const choferGroup = groups.find(g => g.group_name.toLowerCase().includes('chofer'));
        if (choferGroup && selectedGroups.includes(choferGroup.id)) {
            const licencia = roleData[choferGroup.id]?.licencia_numero || '';
            if (licencia.length !== 9 || isNaN(licencia)) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            alert('Por favor completa todos los campos.')
            return;
        }

        if (!validateLicense()) {
            alert('La licencia de chofer debe tener exactamente 9 dígitos numéricos.');
            return;
        }

        try {
            if (usuario) {
                if (isOwnProfile) {
                    await updateProfile({
                        ...formData,
                        groups: selectedGroups,
                        role_data: roleData
                    });
                } else {
                    await updateUsuario(usuario.id, {
                        ...formData,
                        groups: selectedGroups,
                        role_data: roleData
                    });
                }
            } else {
                await registerUser({
                    ...formData,
                    groups: selectedGroups,
                    role_data: roleData
                });
            }

            onClose();
        } catch (error) {
            console.log("ERROR BACKEND:", error.response?.data);
        }
    }
    console.log("DATA ENVIADA:", formData)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{usuario ? 'Editar Empleado' : 'Registrar Empleado'}</DialogTitle>
                    <DialogDescription>
                        {usuario ? 'Actualiza la información del empleado.' : 'Ingresa la información del nuevo empleado.'}
                    </DialogDescription>
                </DialogHeader>

                <div className='grid gap-4 py-4'>
                    <Input placeholder='Usuario' name='username' value={formData.username} onChange={handleChange} />
                    <Input placeholder='Nombre' name='first_name' value={formData.first_name} onChange={handleChange} />
                    <Input placeholder='Primer Apellido' name='last_name' value={formData.last_name} onChange={handleChange} />
                    <Input placeholder='Segundo Apellido' name='segundo_apellido' value={formData.segundo_apellido} onChange={handleChange} />
                    <Input placeholder='Teléfono' name='telefono' value={formData.telefono} onChange={handleChange} />
                    <Input placeholder='Correo' name='email' type='email' value={formData.email} onChange={handleChange} />
                    <Input placeholder='Fecha de Ingreso' name='fecha_ingreso' type='date' value={formData.fecha_ingreso} onChange={handleChange} />
                    {!usuario && (
                        <Input placeholder='Contraseña' name='password' type='password' value={formData.password} onChange={handleChange} />
                    )}
                </div>

                <div className='grid gap-3 py-2'>
                    <Label className='text-base font-semibold'>Roles</Label>
                    {groups.map((group) => (
                        <div key={group.id} className='flex flex-col space-y-2 border-l-2 border-gray-200 pl-3'>
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    id={`group-${group.id}`}
                                    checked={selectedGroups.includes(group.id)}
                                    onCheckedChange={(checked) => handleGroupChange(group.id, checked)}
                                    className='w-4 h-4'
                                />
                                <Label htmlFor={`group-${group.id}`} className='font-medium'>{group.group_name}</Label>
                            </div>

                            {selectedGroups.includes(group.id) && (
                                <Accordion type='single' collapsible className='w-full'>
                                    <AccordionItem value={`role-${group.id}`} className='border-none'>
                                        <AccordionTrigger className='text-sm py-2'>
                                            Datos adicionales de {group.group_name}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className='grid gap-3 p-2 rounded-md'>
                                                {group.group_name.toLowerCase().includes('chofer') && (
                                                    <>
                                                        <Input
                                                            placeholder='Número de Licencia'
                                                            value={roleData[group.id]?.licencia_numero || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'licencia_numero', e.target.value)}
                                                        />
                                                        <Select
                                                            value={roleData[group.id]?.licencia_tipo || 'A1'}
                                                            onValueChange={(value) => handleRoleDataChange(group.id, 'licencia_tipo', value)}
                                                        >
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Tipo de Licencia' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='A1'>A1 - Motocicleta hasta 125cc</SelectItem>
                                                                <SelectItem value='A2'>A2 - Motocicleta 126cc-500cc</SelectItem>
                                                                <SelectItem value='B1'>B1 - Vehículo liviano hasta 4000kg</SelectItem>
                                                                <SelectItem value='B2'>B2 - Carga mediana 4000-8000kg</SelectItem>
                                                                <SelectItem value='B3'>B3 - Carga pesada +8000kg</SelectItem>
                                                                <SelectItem value='D1'>D1 - Maquinaria liviana</SelectItem>
                                                                <SelectItem value='D2'>D2 - Maquinaria mediana</SelectItem>
                                                                <SelectItem value='D3'>D3 - Maquinaria pesada</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input
                                                            type='date'
                                                            placeholder='Fecha de Vencimiento'
                                                            value={roleData[group.id]?.fecha_vencimiento || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'fecha_vencimiento', e.target.value)}
                                                        />
                                                        <Input
                                                            type='number'
                                                            placeholder='Años de Experiencia'
                                                            value={roleData[group.id]?.experiencia_anios || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'experiencia_anios', e.target.value)}
                                                        />
                                                        <Textarea
                                                            placeholder='Observaciones'
                                                            value={roleData[group.id]?.observaciones || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'observaciones', e.target.value)}
                                                        />
                                                    </>
                                                )}

                                                {group.group_name.toLowerCase().includes('mecánico') && (
                                                    <>
                                                        <Input
                                                            placeholder='Especialidad'
                                                            value={roleData[group.id]?.especialidad || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'especialidad', e.target.value)}
                                                        />
                                                        <Textarea
                                                            placeholder='Certificaciones'
                                                            value={roleData[group.id]?.certificaciones || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'certificaciones', e.target.value)}
                                                        />
                                                        <Input
                                                            type='number'
                                                            placeholder='Años de Experiencia'
                                                            value={roleData[group.id]?.experiencia_anios || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'experiencia_anios', e.target.value)}
                                                        />
                                                        <Textarea
                                                            placeholder='Observaciones'
                                                            value={roleData[group.id]?.observaciones || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'observaciones', e.target.value)}
                                                        />
                                                    </>
                                                )}

                                                {group.group_name.toLowerCase().includes('despacho') && (
                                                    <>
                                                        <Textarea
                                                            placeholder='Observaciones'
                                                            value={roleData[group.id]?.observaciones || ''}
                                                            onChange={(e) => handleRoleDataChange(group.id, 'observaciones', e.target.value)}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </div>
                    ))}
                </div>

                <DialogFooter className='flex justify-end space-x-2'>
                    <Button variant='outline' onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>{usuario ? 'Actualizar' : 'Registrar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Register
