import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FilePen, Bot, Clock, UserCheck } from "lucide-react";

const services = [
  {
    icon: <FilePen className="h-10 w-10 text-primary" />,
    title: "Gestión de Siniestros 360",
    description: "Centralizamos toda la documentación e interacciones en una única plataforma, accesible 24/7 para todos los involucrados.",
    features: ["Documentación digital centralizada", "Canal de comunicación unificado", "Historial completo del caso"],
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "Asignación Inteligente de Peritos",
    description: "Nuestro algoritmo asigna automáticamente al perito más adecuado según su ubicación, disponibilidad y especialización, optimizando tiempos.",
    features: ["Geolocalización de peritos", "Balanceo de carga de trabajo", "Filtro por especialidad"],
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Trazabilidad en Tiempo Real",
    description: "Ofrecemos un seguimiento completo y transparente del estado del vehículo, desde la recepción del siniestro hasta su entrega final.",
    features: ["Actualizaciones de estado en vivo", "Notificaciones automáticas", "Línea de tiempo del siniestro"],
  },
  {
    icon: <UserCheck className="h-10 w-10 text-primary" />,
    title: "Portal del Cliente Asegurado",
    description: "Un portal exclusivo y simple para que el cliente final pueda consultar el estado de su caso en cualquier momento, mejorando su experiencia.",
    features: ["Acceso con número de siniestro", "Visualización de etapas", "Contacto directo con soporte"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Nuestros Servicios</h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Soluciones innovadoras diseñadas para optimizar cada etapa del proceso de siniestros.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col transition-shadow hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-start gap-4">
                     <div className="rounded-full bg-primary/10 p-3">
                        {service.icon}
                     </div>
                    <div className="grid gap-1">
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                  <ul className="grid gap-2 text-sm text-muted-foreground">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-accent"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
