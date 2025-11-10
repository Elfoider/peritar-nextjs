import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "./contact-form";
import Image from "next/image";

export default function ContactPage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Contáctanos</h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                ¿Tienes alguna pregunta o quieres saber más sobre nuestros servicios? Estamos aquí para ayudarte.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Nuestra Oficina</h2>
              <p className="text-muted-foreground">
                Visítanos o envíanos una carta. Siempre es un placer recibirte.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Dirección</h3>
                    <p className="text-muted-foreground">Av. del Libertador 498, Buenos Aires, Argentina</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Teléfono</h3>
                    <p className="text-muted-foreground">(+54) 11 5555-PERITAR</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">contacto@peritar.com.ar</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-80 w-full overflow-hidden rounded-lg">
                <Image 
                    src="https://picsum.photos/seed/map/800/400"
                    width={800}
                    height={400}
                    data-ai-hint="city map"
                    alt="Mapa de ubicación"
                    className="w-full h-full object-cover"
                />
            </div>
          </div>
          <Card className="p-2 lg:p-6">
            <CardContent className="p-0 lg:p-4">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
