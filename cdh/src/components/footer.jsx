import { Separator } from "@/components/ui/separator";
import { Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from '@/img/mixer.png'
import DarkLogo from '@/img/mixer-dark.png'
import { useTheme } from "next-themes";

const Footer = () => {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";
  return (
    <footer className='border-t bg-background'>
      <div className='max-w-7xl mx-auto'>
        <div className='py-12 flex flex-col sm:flex-row gap-10 justify-between'>
          <div>
            <div className="flex items-center gap-3">
              <div>
                <img
                  src={isDark ? DarkLogo : Logo}
                  alt="Central de Herramientas Logo"
                  className='w-15 h-15 object-contain rounded-full'
                />
              </div>
              <h3 className="text-xl font-bold text-popover-foreground">
                Central de Herramientas
              </h3>
            </div>
            <p className="text-secondary-foreground">
              Tu socio confiable en herramientas de construcción. <br />
              Alquiler, venta y reparación con más de 10 años de experiencia.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-popover-foreground mb-3">
              Contacto
            </h3>

            <div className="flex items-start gap-2 text-secondary-foreground mb-2">
              <Phone size={18} />
              <p>+506 8888 8888</p>
            </div>

            <div className="flex items-start gap-2 text-secondary-foreground">
              <MapPin size={28} />
              <p>
                Al lado de la central 06 de taxis de San Juan Chiquito, Esparza, Costa Rica
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-popover-foreground mb-3">
              Horarios
            </h3>
            <p className="text-secondary-foreground">Lunes a Sábado: 7:30 AM - 4:30 PM</p>
            <p className="text-secondary-foreground">Domingos: Cerrado</p>
          </div>
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Central de Herramientas. Todos los derechos reservados.
          </p>
          <Link
            to="/about"
            className="text-primary font-semibold hover:underline"
          >
            Acerca de nosotros
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
