'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { User, Car, Wrench, CheckCircle, Phone, Mail, UserCog, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { List, ListItem } from "@/components/ui/list";

export default function ClientePage() {
  const steps = [
    { name: 'Denuncia Recibida', status: 'complete', icon: <UserCog /> },
    { name: 'Perito Asignado', status: 'complete', icon: <UserCog /> },
    { name: 'Vehículo en Taller', status: 'current', icon: <Wrench /> },
    { name: 'Reparación Finalizada', status: 'upcoming', icon: <CheckCircle /> },
    { name: 'Vehículo Entregado', status: 'upcoming', icon: <Car /> },
  ]

  const currentStepIndex = steps.findIndex(step => step.status === 'current');

  const notifications = [
    { id: 1, title: 'Reparación en curso', description: 'Su vehículo ha ingresado a la etapa de chapa y pintura.', time: 'hace 2 días' },
    { id: 2, title: 'Peritaje completado', description: 'El perito ha finalizado la evaluación de su vehículo.', time: 'hace 4 días' },
    { id: 3, title: 'Perito asignado', description: 'Carlos Rodriguez ha sido asignado a su caso.', time: 'hace 5 días' },
];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">
        Estado de Mi Siniestro
      </h2>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 space-y-0">
                    <User className="h-8 w-8 text-primary" />
                    <div className="grid">
                        <CardTitle>Seguimiento de Reparación</CardTitle>
                        <CardDescription>Vehículo: Toyota Corolla - Placa: XYZ-123. Siniestro N°: 789456</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-8">
                        Aquí puedes ver el estado actual de la reparación de tu vehículo en tiempo real.
                    </p>
                    
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex flex-col items-center text-center w-full relative">
                                    <div className={cn(
                                        "flex items-center justify-center w-12 h-12 rounded-full border-2 z-10",
                                        step.status === 'complete' ? "bg-primary border-primary text-primary-foreground" : "",
                                        step.status === 'current' ? "bg-accent border-accent text-accent-foreground" : "",
                                        step.status === 'upcoming' ? "bg-muted border-muted-foreground/30" : ""
                                    )}>
                                        {step.icon}
                                    </div>
                                    <p className={cn(
                                        "mt-2 text-xs md:text-sm font-medium",
                                        step.status === 'complete' || step.status === 'current' ? "text-foreground" : "text-muted-foreground"
                                    )}>{step.name}</p>

                                    {index < steps.length - 1 && (
                                        <div className={cn(
                                            "absolute top-6 left-1/2 w-full h-0.5",
                                            index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/30"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <Card className="mt-8 bg-card">
                        <CardHeader>
                            <CardTitle>Última Actualización: Tu vehículo está siendo reparado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold text-lg">Tiempo estimado restante: 3 días.</p>
                            <p className="text-muted-foreground mt-1">Los repuestos principales ya fueron instalados y estamos en la etapa de chapa y pintura.</p>
                        </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Notificaciones</CardTitle>
                    <CardDescription>Actualizaciones sobre tu caso.</CardDescription>
                </CardHeader>
                <CardContent>
                   <List>
                      {notifications.map(notification => (
                        <ListItem key={notification.id} className="items-start">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-3 flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                          </div>
                          <time className="text-xs text-muted-foreground">{notification.time}</time>
                        </ListItem>
                      ))}
                    </List>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Taller Asignado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <h3 className="font-semibold">Taller Rápido SRL</h3>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>(+54) 11 4444-TALLER</span>
                     </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>contacto@tallerrapido.com.ar</span>
                     </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Perito Asignado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <h3 className="font-semibold">Carlos Rodriguez</h3>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>(+54) 11 6666-PERITO</span>
                     </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>c.rodriguez@peritar.com.ar</span>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
