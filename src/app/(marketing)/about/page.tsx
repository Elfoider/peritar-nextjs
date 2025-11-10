import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, Eye, Handshake } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  { name: 'Juan Pérez', role: 'CEO & Fundador', avatar: 'https://picsum.photos/seed/juan/100/100' },
  { name: 'María García', role: 'Directora de Operaciones', avatar: 'https://picsum.photos/seed/maria/100/100' },
  { name: 'Carlos Rodriguez', role: 'Jefe de Peritos', avatar: 'https://picsum.photos/seed/carlos/100/100' },
  { name: 'Ana Martínez', role: 'Gerente de Cuentas', avatar: 'https://picsum.photos/seed/ana/100/100' },
];

export default function AboutPage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-1 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Nuestra Historia: Pasión por la Precisión
                </h1>
                <p className="max-w-3xl mx-auto text-muted-foreground md:text-xl">
                  PERITAR nació de la necesidad de modernizar y agilizar el proceso de peritaje de vehículos. Conoce nuestro viaje y los principios que nos guían.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Image
              src="https://picsum.photos/seed/aboutus/600/550"
              width={600}
              height={550}
              alt="Oficina de PERITAR"
              data-ai-hint="office meeting"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            />
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">De una idea a la revolución del sector</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Fundada en 2023 por un grupo de expertos en seguros y tecnología, PERITAR se propuso resolver los cuellos de botella en la gestión de siniestros. Nuestra plataforma integra a todos los actores clave —aseguradoras, talleres, peritos y clientes— en un ecosistema digital fluido, reduciendo tiempos y aumentando la satisfacción.
              </p>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hoy, somos un referente de innovación, comprometidos con la transparencia y la excelencia en cada interacción.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Nuestros Pilares</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              La base de nuestro éxito y la guía para nuestro futuro.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-8 pt-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader className="items-center space-y-3">
                <div className="rounded-full bg-primary/10 p-3">
                    <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Misión</CardTitle>
                <p className="text-sm text-muted-foreground">Proveer una plataforma tecnológica que simplifique y transparente la gestión de siniestros, aportando valor a cada parte involucrada.</p>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="items-center space-y-3">
                <div className="rounded-full bg-primary/10 p-3">
                    <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Visión</CardTitle>
                <p className="text-sm text-muted-foreground">Consolidarnos como el estándar de la industria en peritaje digital a nivel nacional, expandiendo nuestros servicios y manteniendo la vanguardia tecnológica.</p>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="items-center space-y-3">
                 <div className="rounded-full bg-primary/10 p-3">
                    <Handshake className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Objetivos</CardTitle>
                <p className="text-sm text-muted-foreground">Reducir los tiempos de gestión en un 50%, alcanzar un 98% de satisfacción del cliente y digitalizar 100,000 peritajes para finales de año.</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Conoce a Nuestro Equipo Directivo</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Los líderes que impulsan nuestra visión y garantizan la excelencia de PERITAR.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="grid gap-4 text-center">
                <Avatar className="mx-auto h-24 w-24">
                  <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="portrait person"/>
                  <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
