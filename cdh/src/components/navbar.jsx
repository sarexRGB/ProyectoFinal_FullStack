import { Button } from "@/components/ui/button";
import Lightlogo from'@/img/CdH-Logo.png'
import Darklogo from '@/img/CdH-Logo-Oscuro.png'
import { useTheme } from "next-themes";
import ThemeButton from "./ThemeButton";
import { Package, Phone, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";


  return (
    <nav className="h-30 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/">
          <img
            src={isDark ? Darklogo : Lightlogo}
            alt="Logo claro de la empresa"
            className="w-60 transition-all duration-300"
          />
        </Link>
        <p className="flex gap-1 text-secondary-foreground">
          <Phone size={18}/>
          +506 88888888
        </p>
        <p className="flex gap-1 text-secondary-foreground">
          <Mail size={18}/>
          centralherramientas@gmail.com
        </p>

        <Link
            to="/about"
            className="text-primary font-semibold hover:underline text-base"
          >
            Acerca de nosotros
          </Link>

        <div className="">
          <ThemeButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
