import React from 'react'
import { Package, ShoppingCart, Wrench, Clock, Shield, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function Inicio() {
  return (
    <div className='px-5 py-8'>
      <section className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-popover-foreground mb-2'>Tu socio en <span className='text-primary'>Construcción</span></h1>
        <p className='text-lg mx-auto max-w-xl mb-8 text-secondary-foreground landing-relaxed'>
          Encuentra las mejores herramientas y equipos para tus proyectos. <br />
          Alquiler, venta y reparación con la calidad que necesitas.
        </p>
      </section>
      <section className='max-w-5xl mx-auto mb-12'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold mb-1 text-popover-foreground'>Nuestros servicios</h2>
          <p className='text-base text-secondary-foreground'>
            Ofrecemos soluciones completas para todos tus proyectos de construcción
          </p>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center'>
          <Card className='text-center shadow-sm border rounded-xl'>
            <CardHeader>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Package size={32} className='text-popover' />
              </div>
              <CardTitle className='text-popover-foreground'>Alquiler de Equipos</CardTitle>
              <CardDescription className='text-secondary-foreground'>
                Amplio catálogo de herramientas y maquinaria disponible.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='text-center shadow-sm border rounded-xl'>
            <CardHeader>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <ShoppingCart size={32} className='text-popover' />
              </div>
              <CardTitle className='text-popover-foreground'>Venta de Equipos</CardTitle>
              <CardDescription className='text-secondary-foreground'>
                Herramientas nuevas y usadas, con garantía y soporte.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='text-center shadow-sm border rounded-xl'>
            <CardHeader>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Wrench size={32} className='text-popover' />
              </div>
              <CardTitle className='text-popover-foreground'>Reparación y mantenimiento</CardTitle>
              <CardDescription className='text-secondary-foreground'>
                servicio técnico especializado para tus equipos.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className='max-w-6xl mx-auto mb-20'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-popover-foreground mb-2'>
            ¿Por qué elegirnos?
          </h2>
          <p className='text-secondary-foreground'>
            Características que nos distinguen
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card className='text-center'>
            <CardHeader>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Clock size={32} className='text-popover' />
              </div>
              <CardTitle className='text-popover-foreground'>Entrega rápida</CardTitle>
              <CardDescription className='text-secondary-foreground'>
                Te llevamos los equipos en el menor tiempo posible.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='text-center'>
            <CardHeader>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Shield size={32} className='text-popover' />
              </div>
              <CardTitle className='text-popover-foreground'>Equipos certificados</CardTitle>
              <CardDescription className='text-secondary-foreground'>
                Todos nuestros equipos están verificados y en optimas condiciones.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className='text-center'>
            <CardHeader>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Star size={32} className='text-popover' />
              </div>
              <CardTitle className='text-popover-foreground'>Calidad garantizada</CardTitle>
              <CardDescription className='text-secondary-foreground'>
                Más de 10 años de experiencia nos respaldan.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Inicio