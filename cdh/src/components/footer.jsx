import { Separator } from "@/components/ui/separator";
import Logo from '@/img/mixer.png'

const Footer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow bg-muted" />
      <footer className="border-t">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div
            className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2">
              {/* Logo */}
              <img
                src={Logo}
                alt="Logo de la empresa"
                className="rounded-full size-15"
              />

              <p className="mt-4 text-muted-foreground">
                Tu socio confiable en herramientas y equipos de construcción. <br /> Alquiler, venta y reparación con más de 10 años de experiencia.
              </p>
            </div>

            
          </div>
          <Separator />
          <div
            className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            

            <div className="flex items-center gap-5 text-muted-foreground">
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
