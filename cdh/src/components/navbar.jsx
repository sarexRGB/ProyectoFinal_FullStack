import { Button } from "@/components/ui/button";
import Lightlogo from'@/img/CdH-Logo.png'
import Darklogo from '@/img/CdH-Logo-Oscuro.png'
import { useTheme } from "next-themes";
import ThemeButton from "./ThemeButton";
import { Package, Phone, Mail } from "lucide-react";

const Navbar = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <nav className="h-30 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo dinámico */}
        <div>
          <img
            src={isDark ? Darklogo : Lightlogo}
            alt="Logo claro de la empresa"
            className="w-60 transition-all duration-300"
          />
        </div>
        <div>
          <Button>
            <Package/>
            Catalogos
          </Button>
        </div>
        <div className="items-center grid gap-y-5">
          <p className="flex gap-1">
            <Phone/>
            +506 88888888
          </p>
          <p className="flex gap-1">
            <Mail/>
            centralherramientas@gmail.com
          </p>
        </div>
        <div className="">
          <ThemeButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
