'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ClipboardCheck, CalendarDays, FileWarning, Bell } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { List, ListItem } from "@/components/ui/list";


const peritajes = [
    { id: 'PER-112', siniestro: 'SIN-004', aseguradora: 'Seguros LATAM', ubicacion: 'Taller AutoFix', estado: 'Pendiente', asignado: '2023-10-27' },
    { id: 'PER-111', siniestro: 'SIN-002', aseguradora: 'Protección Total', ubicacion: 'Domicilio Cliente', estado: 'Completado', asignado: '2023-10-26' },
    { id: 'PER-110', siniestro: 'SIN-001', aseguradora: 'Mi Seguro', ubicacion: 'Taller Veloz', estado: 'Informe Cargado', asignado: '2023-10-26' },
];

const statCards = [
    { title: "Peritajes Asignados (Hoy)", value: "3", icon: <CalendarDays className="h-6 w-6 text-muted-foreground" /> },
    { title: "Pendientes de Subir Informe", value: "1", icon: <FileWarning className="h-6 w-6 text-muted-foreground" /> },
    { title: "Completados (Hoy)", value: "5", icon: <ClipboardCheck className="h-6 w-6 text-muted-foreground" /> },
];

const notifications = [
    { id: 1, title: 'Nuevo Siniestro Asignado', description: 'Revisa tu calendario para el caso SIN-004.', time: 'hace 10 min' },
    { id: 2, title: 'Inspección Confirmada', description: 'El cliente confirmó la cita para mañana a las 10am.', time: 'hace 1 hora' },
    { id: 3, title: 'Recordatorio', description: 'No olvides cargar el informe para el caso SIN-001.', time: 'hace 3 horas' },
];

const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case 'Completado': return 'outline';
        case 'Pendiente': return 'default';
        case 'Informe Cargado': return 'secondary';
        default: return 'default';
    }
}

export default function PeritoPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Panel de Perito
        </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Próximas Citas de Inspección</CardTitle>
              <CardDescription>Tu agenda para los próximos días.</CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar
                    mode="single"
                    selected={new Date()}
                    className="rounded-md border"
                />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Notificaciones Recientes</CardTitle>
                <CardDescription>Alertas sobre tus casos.</CardDescription>
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
      </div>

       <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="flex items-center gap-4">
                    <div>
                    <CardTitle>Últimos Peritajes Asignados</CardTitle>
                    <CardDescription>Revisa y actualiza el estado de tus peritajes.</CardDescription>
                    </div>
                </div>
                <Button asChild><Link href="/dashboard/perito/peritajes">Ver Todos</Link></Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>N° Siniestro</TableHead>
                    <TableHead>Aseguradora</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {peritajes.slice(0, 3).map((peritaje) => (
                    <TableRow key={peritaje.id}>
                    <TableCell className="font-medium">{peritaje.siniestro}</TableCell>
                    <TableCell>{peritaje.aseguradora}</TableCell>
                    <TableCell>{peritaje.ubicacion}</TableCell>
                    <TableCell>
                        <Badge variant={getBadgeVariant(peritaje.estado)}>{peritaje.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/perito/peritajes/informe/${peritaje.id}`}>
                                {peritaje.estado === 'Pendiente' ? 'Cargar Informe' : 'Ver Informe'}
                            </Link>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  );
}
