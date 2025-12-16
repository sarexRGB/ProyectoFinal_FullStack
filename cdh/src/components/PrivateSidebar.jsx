import React, { useContext, useState, useEffect } from 'react'
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
    useSidebar,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import mixer from "../img/mixer.png"
import { useLocation } from "react-router-dom"
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
    Briefcase,
    ChevronRight,
    CalendarCheck,
} from "lucide-react"
import { Link } from 'react-router-dom'
import { AuthContext } from '@/services/AuthContext'

function PrivateSidebar() {
    const location = useLocation()
    const { roles, logout } = useContext(AuthContext)
    const [openMenu, setOpenMenu] = useState(null)

    const items = [
        { title: "Admin Dasboard", path: "/admin", icon: ChartColumn, roles: ["Administrador"] },
        {
            title: "Inventario",
            icon: Package,
            roles: ["Administrador", "Despacho"],
            childrens: [
                { title: "Productos", path: "/admin/inventario?tab=productos", icon: Package },
                { title: "Piezas", path: "/admin/inventario?tab=piezas", icon: Wrench },
                { title: "Vehículos", path: "/admin/inventario?tab=vehiculos", icon: ShoppingCart },
            ]
        },
        {
            title: "Historial",
            icon: FileText,
            roles: ["Administrador", "Despacho"],
            childrens: [
                { title: "Alquileres", path: "/admin/historial?tab=alquileres", icon: Wrench },
                { title: "Ventas", path: "/admin/historial?tab=ventas", icon: ShoppingCart },
                { title: "Entregas", path: "/admin/historial?tab=entregas", icon: Package },
                { title: "Mantenimientos", path: "/admin/mantenimientos", icon: Wrench },
            ]
        },
        { title: "Personal", path: "/admin/personal", icon: Users, roles: ["Administrador"] },
        { title: "Asistencias", path: "/admin/asistencias", icon: CalendarCheck, roles: ["Administrador"] },
        { title: "Clientes", path: "/admin/clientes", icon: Briefcase, roles: ["Administrador", "Despacho"] },
        {
            title: "Catálogos", icon: BookOpen, roles: ["Administrador", "Despacho"], childrens: [
                { title: "Alquiler", path: "/admin/alquiler", icon: Wrench },
                { title: "Venta", path: "/admin/venta", icon: ShoppingCart },
            ]
        },
        { title: "Dasboard", path: "/empleado", icon: ChartColumn, roles: ["Mecánico", "Chofer", "Despacho"] },
        { title: "Tareas", path: "/empleado/tareas", icon: List, roles: ["Mecánico", "Chofer", "Despacho"] },
        { title: "Calendario", path: "/empleado/calendario", icon: CalendarCheck, roles: ["Chofer"] },
        { title: "Perfil", path: "/empleado/perfil", icon: User, roles: ["Mecánico", "Chofer", "Despacho"] },
    ]

    useEffect(() => {
        items.forEach((item, index) => {
            if (item.childrens) {
                const hasActiveChild = item.childrens.some(child => {
                    const childPath = child.path.split('?')[0]
                    const currentPath = location.pathname
                    const currentSearch = location.search
                    return child.path === currentPath + currentSearch || childPath === currentPath
                })
                if (hasActiveChild && openMenu !== index) {
                    setOpenMenu(index)
                }
            }
        })
    }, [location.pathname, location.search])

    const userRoles = roles || []

    const canSee = (item) => {
        if (!item.roles) return true
        return item.roles.some(r => userRoles.includes(r))
    }

    const { state, isMobile } = useSidebar()

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
                <TooltipProvider delayDuration={0}>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-2">
                                {items.filter(canSee).map((item) => {
                                    const Icon = item.icon
                                    const isActive = location.pathname === item.path
                                    if (!item.childrens) {
                                        return (
                                            <SidebarMenuItem key={item.path}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <SidebarMenuButton asChild isActive={isActive}>
                                                            <Link to={item.path} className='flex items-center gap-3'>
                                                                <Icon className='size-4' />
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" hidden={state !== "collapsed" || isMobile}>
                                                        <p>{item.title}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </SidebarMenuItem>
                                        )
                                    }
                                    const currentFullPath = location.pathname + location.search
                                    const activeChild = item.childrens.find(child => child.path === currentFullPath)
                                    const tooltipText = activeChild ? activeChild.title : item.title

                                    return (<Collapsible
                                        key={item.title}
                                        open={openMenu === item.title}
                                        onOpenChange={() => setOpenMenu(openMenu === item.title ? null : item.title)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton className='gap-3' tooltip={item.title}>
                                                            <Icon className='size-4' />
                                                            <span>{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" hidden={state !== "collapsed" || isMobile}>
                                                    <p>{tooltipText}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.childrens.filter(canSee).map((child) => {
                                                        const ChildrenIcon = child.icon
                                                        const isActive = location.pathname + location.search === child.path ||
                                                            location.pathname === child.path
                                                        return (
                                                            <SidebarMenuSubItem key={child.path}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <SidebarMenuSubButton asChild isActive={isActive}>
                                                                            <Link to={child.path} className='flex items-center gap-3'>
                                                                                <ChildrenIcon className='size-4' />
                                                                                <span>{child.title}</span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="right" hidden={state !== "collapsed" || isMobile}>
                                                                        <p>{child.title}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </SidebarMenuSubItem>
                                                        )
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </TooltipProvider>
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
