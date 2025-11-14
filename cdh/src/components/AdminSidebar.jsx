import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Users, FileText, Package, KeyRound, ShoppingCart, LogOut } from 'lucide-react'
import { Button } from './ui/button'

function AdminSidebar({ isExpanded, toggleSidebar }) {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/inventario', label: 'Inventario', icon: Package },
        { path: '/admin/personal', label: 'Personal', icon: Users },
        { path: '/admin/contratos', label: 'Contratos', icon: FileText },
        { path: '/admin/alquiler', label: 'Alquiler', icon: KeyRound },
        { path: '/admin/venta', label: 'Venta', icon: ShoppingCart }
    ]

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border
                flex flex-col justify-between transition-all duration-300 shadow-sm z-50
                ${isExpanded ? 'w-64' : 'w-16'}`}
        >
            <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                    {isExpanded && (
                        <h1 className="text-lg font-bold text-sidebar-foreground">Admin</h1>
                    )}
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        {isExpanded ? <X size={18} /> : <Menu size={18} />}
                    </Button>
                </div>

                <div className="flex flex-col gap-1 mt-4 px-2">
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <Button
                            key={path}
                            variant={isActive(path) ? 'default' : 'ghost'}
                            className={`flex items-center gap-3 justify-${isExpanded ? 'start' : 'center'}
                                w-full py-3 rounded-xl text-sm font-medium ${isActive(path)
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-ring'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                }`}
                            onClick={() => navigate(path)}
                        >
                            <Icon size={20} />
                            {isExpanded && <span>{label}</span>}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-sidebar-border">
                <Button
                    variant="destructive"
                    className={`flex items-center gap-3 justify-${isExpanded ? 'start' : 'center'}
                        w-full py-3 rounded-xl`}
                    onClick={cerrarSesion}
                >
                    <LogOut size={20} />
                    {isExpanded && <span>Cerrar sesión</span>}
                </Button>
            </div>
        </div>
    )
}

export default AdminSidebar
