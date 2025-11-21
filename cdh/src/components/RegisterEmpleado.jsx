import React, {useState, useEffect} from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createUsuario, updateUsuario } from '@/services/UsuariosServices'

function RegisterEmpleado({ isOpen, onClose, empleado }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (empleado) {
            setFormData({
                username: empleado.username,
                email: empleado.email,
                password: "",
            })
        }
    }, [empleado]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (empleado) {
                await updateUsuario(empleado.id, formData);
            } else {
                await createUsuario(formData);
            }
            onClose();
        } catch (error) {
            console.error("Error al guardar empleado", error);
        }
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className='sm:max-w.lg'>
                    <DialogHeader>
                        <DialogTitle>{empleado ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <Input placeholder="Usuario" name="username" value={formData.username} onChange={handleChange} />
                        <Input placeholder="Correo" name="email" value={formData.email} onChange={handleChange} />
                        <Input placeholder="Contraseña" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <DialogFooter>
                        <Button variamt="outline" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSubmit}>{empleado ? "Actializar" : "Registrar"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RegisterEmpleado