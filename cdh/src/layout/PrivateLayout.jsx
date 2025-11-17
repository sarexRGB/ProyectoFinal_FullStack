import React from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import PrivateSidebar from "@/components/PrivateSidebar"
import PrivateNavbar from "@/components/PrivateNavbar"
import ThemeButton from "@/components/ThemeButton"

function PrivateLayout() {
    return (
        <SidebarProvider>
            <PrivateSidebar />

            <div className="flex flex-col min-h-screen w-full max-w-screen">
                <PrivateNavbar />
                <main className="flex-1 p-2 relative overflow-auto">
                    <Outlet />
                    <aside className="fixed bottom-3 right-3">
                        <ThemeButton />
                    </aside>
                </main>
            </div>
        </SidebarProvider>
    )
}

export default PrivateLayout