import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, Car, FileSearch, Wrench } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const processSteps = [
  {
    icon: <FileSearch className="h-10 w-10 text-primary" />,
    title: '1. Siniestro',
    description: 'El proceso comienza con la notificación del siniestro a través de nuestra plataforma.',
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: '2. Peritaje',
    description: 'Asignamos un perito y se realiza la evaluación del vehículo de forma ágil y digital.',
  },
  {
    icon: <Wrench className="h-10 w-10 text-primary" />,
    title: '3. Reparación',
    description: 'El taller designado realiza la reparación con seguimiento en tiempo real hasta la entrega.',
  },
];

const partnerLogos = [
  "https://picsum.photos/seed/logo1/150/50",
  "https://picsum.photos/seed/logo2/150/50",
  "https://picsum.photos/seed/logo3/150/50",
  "https://picsum.photos/seed/logo4/150/50",
  "https://picsum.photos/seed/logo5/150/50",
  "https://picsum.photos/seed/logo6/150/50",
  "https://picsum.photos/seed/logo7/150/50",
  "https://picsum.photos/seed/logo8/150/50",
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center">
        <Image
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Hero image showing a car being inspected"
            data-ai-hint="car inspection"
            fill
            className="object-cover -z-10 brightness-50"
        />
        <div className="container mx-auto px-4 text-white">
            <div className="flex flex-col items-center space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-shadow-lg">
                    PERITAR: La Plataforma que Conecta tu Gestión de Siniestros.
                </h1>
                <p className="max-w-3xl text-lg md:text-xl text-shadow">
                    Aseguradoras, Peritos y Talleres en un solo lugar. Optimizamos cada paso, desde el reporte hasta la reparación, con tecnología y transparencia.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/registro/profesional">
                            Regístrate Ahora <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Decile adiós a la gestión tradicional de siniestros.
              </h2>
              <p className="text-muted-foreground text-lg">
                La fragmentación, la falta de comunicación y los procesos manuales generan demoras, costos innecesarios y frustración para todas las partes. La gestión tradicional es un laberinto de llamados, emails y papeles.
              </p>
              <p className="text-foreground font-semibold text-lg">
                PERITAR centraliza, digitaliza y automatiza el flujo de trabajo, conectando a aseguradoras, talleres y peritos en un ecosistema digital colaborativo que reduce los tiempos de gestión en hasta un 70%.
              </p>
            </div>
            <div>
              <Image
                src="https://picsum.photos/seed/solution/600/400"
                width={600}
                height={400}
                alt="Diagrama de solución"
                data-ai-hint="infographic chart"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Carousel */}
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-foreground mb-2">
            Aseguradoras que Confían en Nosotros
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Nuestra plataforma es la elegida por las compañías líderes del mercado.
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {partnerLogos.map((logo, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5 flex items-center justify-center">
                    <Image
                      src={logo}
                      alt={`Logo Aseguradora ${index + 1}`}
                      width={150}
                      height={50}
                      data-ai-hint="company logo"
                      className="object-contain grayscale transition-all hover:grayscale-0"
                    />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-foreground mb-12">
            Un Proceso Simple y Transparente
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {processSteps.map((step) => (
              <Card key={step.title} className="text-center transition-transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary/50">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {step.icon}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
