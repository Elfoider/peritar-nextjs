'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Shield, FileText, Clock, CheckCircle, Bell } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, ListItem } from "@/components/ui/list";

const siniestros = [
    { id: 'SIN-001', cliente: 'Juan Pérez', vehiculo: 'Toyota Corolla', estado: 'En Taller', fecha: '2023-10-26' },
    { id: 'SIN-002', cliente: 'María García', vehiculo: 'Honda CR-V', estado: 'Peritaje Asignado', fecha: '2023-10-25' },
    { id: 'SIN-003', cliente: 'Carlos Rodriguez', vehiculo: 'Ford Focus', estado: 'Cerrado', fecha: '2023-10-24' },
    { id: 'SIN-004', cliente: 'Ana Martínez', vehiculo: 'Chevrolet Onix', estado: 'Pendiente Aprobación', fecha: '2023-10-27' },
    { id: 'SIN-005', cliente: 'Lucía Fernández', vehiculo: 'VW Gol', estado: 'En Taller', fecha: '2023-10-28' },
];

const statCards = [
    { title: "Siniestros Activos", value: "348", icon: <FileText className="h-6 w-6 text-muted-foreground" /> },
    { title: "Tiempo Medio de Cierre", value: "8.2 días", icon: <Clock className="h-6 w-6 text-muted-foreground" /> },
    { title: "Siniestros Cerrados (30d)", value: "124", icon: <CheckCircle className="h-6 w-6 text-muted-foreground" /> },
];

const notifications = [
    { id: 1, title: 'Informe Recibido', description: 'El perito subió el informe para el caso SIN-004.', time: 'hace 5 min' },
    { id: 2, title: 'Presupuesto Recibido', description: 'El taller envió el presupuesto para el caso SIN-001.', time: 'hace 2 horas' },
    { id: 3, title: 'Siniestro Cerrado', description: 'El caso SIN-003 ha sido finalizado con éxito.', time: 'hace 1 día' },
];

const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case 'Cerrado': return 'outline';
        case 'Pendiente Aprobación': return 'destructive';
        case 'En Taller': return 'default';
        default: return 'secondary';
    }
}

export default function AseguradoraPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard de Aseguradora
        </h2>
      </div>

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
      
       <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Gestión de Siniestros</CardTitle>
                        <CardDescription>Visualiza y gestiona todos los siniestros asociados a tu compañía.</CardDescription>
                    </div>
                </div>
                <Button asChild>
                    <Link href="/dashboard/aseguradora/siniestros/nuevo">Nuevo Siniestro</Link>
                </Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID Siniestro</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Reporte</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {siniestros.map((siniestro) => (
                    <TableRow key={siniestro.id}>
                    <TableCell className="font-medium">{siniestro.id}</TableCell>
                    <TableCell>{siniestro.cliente}</TableCell>
                    <TableCell>{siniestro.vehiculo}</TableCell>
                    <TableCell>
                        <Badge variant={getBadgeVariant(siniestro.estado)}>{siniestro.estado}</Badge>
                    </TableCell>
                    <TableCell>{siniestro.fecha}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver Detalles</Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones Recientes</CardTitle>
            <CardDescription>Últimas actualizaciones en tus casos.</CardDescription>
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

    </div>
  );
}
