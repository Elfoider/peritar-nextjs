import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { User, Car } from "lucide-react";

export default function ClientesPage() {
  const steps = [
    { name: 'Siniestro Reportado', status: 'complete' },
    { name: 'Peritaje Asignado', status: 'complete' },
    { name: 'Vehículo en Taller', status: 'current' },
    { name: 'Reparación Finalizada', status: 'upcoming' },
    { name: 'Vehículo Entregado', status: 'upcoming' },
  ]

  function getStatusClasses(status: string) {
    switch (status) {
      case 'complete':
        return 'bg-primary border-primary text-primary-foreground';
      case 'current':
        return 'bg-accent border-accent text-accent-foreground';
      default:
        return 'bg-muted border-muted-foreground/20';
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Mi Siniestro
        </h2>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <User className="h-8 w-8 text-primary" />
            <div className="grid">
                <CardTitle>Seguimiento de Reparación</CardTitle>
                <CardDescription>Vehículo: Toyota Corolla - Placa: XYZ-123</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-8">
            Aquí puedes ver el estado actual de la reparación de tu vehículo.
          </p>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 h-full w-0.5 bg-border -translate-x-1/2" />
            <ol className="space-y-8">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative flex items-start">
                  <div className="flex-shrink-0">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${getStatusClasses(step.status)}`}>
                        <Car className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="ml-4 min-w-0">
                    <h3 className="text-lg font-medium">{step.name}</h3>
                    {step.status === 'current' && <p className="text-sm text-muted-foreground">Tu vehículo está siendo reparado. Tiempo estimado: 3 días.</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
