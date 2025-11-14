import { ThemeProvider as NextThemesProvider } from "next-themes";


function ThemeProvider({
    children,
    ...props
}) {
    return (
        <NextThemesProvider
            {...props}
            attribute="class"
            defaultTheme="system"
            enableSystem
        >
            {children}
        </NextThemesProvider>
    )
}

export default ThemeProvider