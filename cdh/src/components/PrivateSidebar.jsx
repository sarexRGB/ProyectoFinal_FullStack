import React, { useContext, useState } from 'react'
import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
    SidebarFooter,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import mixer from "../img/mixer.png"
import { useNavigate, useLocation } from "react-router-dom"
import {
    ChartColumn,
    Package,
    FileText,
    Users,
    Wrench,
    ShoppingCart,
    LogOut,
    BookOpen,
    User,
    List,
} from "lucide-react"
import { Link } from 'react-router-dom'
import { AuthContext } from '@/services/AuthContext'

function PrivateSidebar() {
    const location = useLocation()
    const { roles, logout } = useContext(AuthContext)
    const [openMenu, setOpenMenu] = useState(null)

    const items = [
        { title: "Admin Dasboard", path: "/admin", icon: ChartColumn, roles:["Administrador"]},
        { title: "Inventario", path: "/admin/inventario", icon: Package, roles:["Administrador", "Despacho"] },
        { title: "Historial", path: "/admin/historial", icon: FileText, roles:["Administrador", "Despacho"] },
        { title: "Personal", path: "/admin/personal", icon: Users, roles:["Administrador"] },
        {
            title: "Catálogos", icon: BookOpen, roles:["Administrador", "Despacho"], childrens: [
                { title: "Alquiler", path: "/admin/alquiler", icon: Wrench },
                { title: "Venta", path: "/admin/venta", icon: ShoppingCart },
            ]
        },
        {title: "Dasboard", path: "/empleado", icon: ChartColumn, roles:["Mecánico", "Chofer", "Despacho"]},
        {title: "Tareas", path: "/empleado/tareas", icon: List, roles:["Mecánico", "Chofer", "Despacho"]},
        {title: "Perfil", path: "/empleado/perfil", icon: User, roles:["Mecánico", "Chofer", "Despacho"]},
    ]

    const userRoles = roles || []

    const canSee = (item) => {
        if (!item.roles) return true
        return item.roles.some(r => userRoles.includes(r))
    }

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className='flex items-center gap-3'>
                        <img src={mixer} className="w-8 h-8 rounded-full shrink-0" alt="logo" />
                        <div className="sidebar-collapsible group-data-[collapsible=icon]:hidden">
                            <h3 className="font-bold text-sm">Central de Herramientas</h3>
                            <p className="text-xs text-gray-400">Inventario & Gestión</p>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className='flex-1'>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {items.filter(canSee).map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            if (!item.childrens) {
                                return (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link to={item.path} className='flex items-center gap-2'>
                                                <Icon className='size-4' />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className='flex items-center w-full px-2 py-2 hover:bg-accent gap-2'
                                        onClick={() =>
                                            setOpenMenu(openMenu === item.title ? null : item.title)
                                        }
                                        data-state={openMenu === item.title ? "open" : "closed"}
                                    >
                                        <Icon className='size-5 shrink-0' />
                                        <span className='truncate group-data-[state=collapsed]:hidden'>{item.title}</span>
                                    </SidebarMenuButton>

                                    {openMenu === item.title && (
                                        <SidebarMenuSub>
                                            {item.childrens.filter(canSee).map((child) => {
                                                const ChildrenIcon = child.icon
                                                const isActive = location.pathname === child.path
                                                return (
                                                    <SidebarMenuSubItem key={child.path}>
                                                        <SidebarMenuSubButton asChild isActive={isActive}>
                                                            <Link to={child.path} className='flex items-center gap-2'>
                                                                <ChildrenIcon className='size-4' />
                                                                <span>{child.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={logout}>
                            <a className="flex items-center w-full gap-3">
                                <LogOut className="size-5 shrink-0" />
                                <span className="truncate group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}

export default PrivateSidebar
