import React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

function ThemeButton() {
    const { theme, setTheme, systemTheme } = useTheme()
    const currentTheme = theme === "system" ? systemTheme : theme
    const isDark = currentTheme === "dark"

    const changeTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <Button
            variant="outline"
            className="rounded-full"
            onClick={changeTheme}
        >
            {isDark ? <Moon /> : <Sun/>}
        </Button>
    )
}

export default ThemeButton