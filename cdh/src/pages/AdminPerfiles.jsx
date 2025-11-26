import React from 'react'
import { useParams } from 'react-router-dom'
import PerfilUsuario from '@/components/PerfilUsuario'

function AdminPerfiles() {
    const { id } = useParams();

    return (
        <div>
            <PerfilUsuario userId={id} />
        </div>
    )
}

export default AdminPerfiles