import React from 'react'
import Lightlogo from '@/img/CdH-Logo.png'
import Darklogo from '@/img/CdH-Logo-Oscuro.png'
import { Hammer, Truck, Shield, Clock, Handshake } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function AboutUs() {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";
    return (
        <div className='px-10 py-10'>
            <header className='text-center py-10 pb-16 border-b-2 border-border mb-10'>
                <h1 className='text-3xl md:text-4xl font-bold mb-15 text-primary'>
                    Acerca de nosotros
                </h1>
                <p className='text-md mb-8 text-popoverforeground'>
                    En central de Herramientas nos especializamos en la venta, alquiler y reparación de herramientas y equipos de construcción,
                    ofreciendo soluciones confiables y de calidad para profesionales, empresas y proyectos de todo tamaño.
                    <br /> <br />
                    Desde nuestros inicios, hemos trabajado con el compromiso de brindar a nuestros clientes  no solo productos de alto
                    rendimiento, sino también un servicio cercano, ágil y responsable. Nuestro objetivo es facilitar cada etapa de la construcción,
                    asegurando que siempre cuentes con el equipo adecuando cuando lo necesites.
                    <br /> <br />
                    Contamos con un amplio catálogo de herramientas y equipos de marcas reconocidas, que abarca desde soluciones básicas para
                    el trabajo diario hasta maquinaria especializada para proyectos de mayor exigencia. Además, nuestro equipo técnico capacitado
                    se encarga de realizar mantenimiento y reparación con dedicación y profecionalismo, para que tus herramientas sigan rindiendo
                    al máximo.
                    <br /> <br />
                    En Central de Herramientas no solo somos proveedores: somos aliados de tu proyecto, acompañandote con soluciones prácticas y
                    un servicio en el que puedes confiar.
                </p>
            </header>

            <section className='flex items-center justify-between mb-10 py-8'>
                <div>
                    <h2 className='text-lg md:text-2xl font-bold mb-6 text-primary'>Nuestra Misión y Visión</h2>
                    <p className='mb-6 text-popoverforeground'>
                        <strong>Misión:</strong> Facilitar el trabajo de nuestros clientes ofreciendo un amplio catálogo de herramientas y equipos
                        confiables, junto con un servicio cercano y responsable que asegura el éxito de cada proyecto.
                    </p>
                    <p className='mb-6 text-popoverforeground'>
                        <strong>Visión:</strong> Convertirnos en la primera opción en soluciones para la construcción, reconocidos por la variedad
                        de productos, la calidad de nuestro servicio y la confianza que generamos en cada cliente.
                    </p>
                </div>

                <img
                    src={isDark ? Darklogo : Lightlogo}
                    alt="Logo claro de la empresa"
                    className="w-96 transition-all duration-300"
                />
            </section>
            <Separator />
            <section className='flex flex-col mb-10 py-8 items-center'>
                <h2 className='text-lg md:text-2xl font-bold mb-6 text-primary'>Nuestros valores</h2>
                <div className='w-full max-w-6xl'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
                        <Card>
                            <CardHeader className='flex items-center gap-6 text-center justify-center'>
                                <Clock size={35} className="text-primary" />
                                <CardTitle className='text-lg md:text-xl font-bold text-popoverforeground'>Experiencia comprobada</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-secondary-foreground text-center'>Más de 10 años respaldan nuestro compromiso con la industria de la construcción.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex items-center gap-6 text-center justify-center'>
                                <Hammer size={35} className="text-primary" />
                                <CardTitle className='text-lg md:text-xl font-bold text-popoverforeground'>Servicio integral</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-secondary-foreground text-center'>Venta, alquiler y reparación de equipos en un mismo lugar, con soluciones prácticas para cada necesidad.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex items-center gap-6 text-center justify-center'>
                                <Truck size={35} className="text-primary" />
                                <CardTitle className='text-lg md:text-xl font-bold text-popoverforeground'>Entrega flexible y logística confiable</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-secondary-foreground text-center'>
                                    Llevamos los equipos directamente a tu obra o, si prefieres, puedes recogerlos en nuestras instalaciones. Siempre de forma rápida y segura.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
                        <Card>
                            <CardHeader className='flex items-center gap-6 text-center justify-center'>
                                <Shield size={35} className="text-primary" />
                                <CardTitle className='text-lg md:text-xl font-bold text-popoverforeground'>Calidad y seguridad garantizadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-secondary-foreground text-center'>Cada herramienta y equipo pasa por controles de mantenimiento que aseguran su rendimiento y un uso seguro en obra.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className='flex items-center gap-6 text-center justify-center'>
                                <Handshake size={35} className="text-primary" />
                                <CardTitle className='text-lg md:text-xl font-bold text-popoverforeground'>Atención cercana e innovadora</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-secondary-foreground text-center'>Escuchamos y atendemos tus necesidades, ofreciendo soluciones prácticas, modernas y confiables para facilitar tu trabajo.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <Separator />
            <section className='mt-5 flex items-center justify-between'>
                <div className='flex flex-col'>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">¿Listo para empezar tu proyecto?</h2>
                    <div className="flex flex-col gap-4 mt-10">
                        <p className="text-popoverforeground text-xl md:text-2xl font-semibold">
                            Visítanos o contactanos hoy mismo.
                        </p>
                        <p className="text-popoverforeground">
                            Estamos ubicados en:
                            <strong> Esparza, al lado de la central 06 de taxis de San Juan Chiquito.</strong>
                        </p>
                        <p className="text-popoverforeground">
                            Teléfono: <strong>+506 8888 8888</strong>
                        </p>
                        <p className="text-popoverforeground">
                            Envianos un correo a: <strong>centralherr@gmail.com</strong>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutUs