'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Wrench, Car, FileText, Banknote, Bell } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, ListItem } from "@/components/ui/list";

const trabajos = [
    { id: 'REP-056', vehiculo: 'Toyota Corolla', aseguradora: 'Seguros ABC', estado: 'En Reparación', ingreso: '2023-10-26' },
    { id: 'REP-057', vehiculo: 'Honda CR-V', aseguradora: 'Protección Total', estado: 'Pendiente Peritaje', ingreso: '2023-10-27' },
    { id: 'REP-058', vehiculo: 'Ford Focus', aseguradora: 'Mi Seguro', estado: 'Listo para Entrega', ingreso: '2023-10-20' },
    { id: 'REP-059', vehiculo: 'VW Gol', aseguradora: 'Seguros ABC', estado: 'Aprobado, Esperando Repuestos', ingreso: '2023-10-28' },
];

const pagosPendientes = [
    { factura: 'FAC-0987', monto: '$ 125,800.00' },
    { factura: 'FAC-0988', monto: '$ 210,500.00' },
    { factura: 'FAC-0989', monto: '$ 88,000.00' },
]

const notifications = [
    { id: 1, title: 'Presupuesto Aprobado', description: 'Puedes iniciar la reparación del caso REP-059.', time: 'hace 30 min' },
    { id: 2, title: 'Nuevo Vehículo Asignado', description: 'El caso REP-060 llegará a tu taller mañana.', time: 'hace 4 horas' },
];


const statCards = [
    { title: "Casos Pendientes de Presupuestar", value: "4", icon: <FileText className="h-6 w-6 text-muted-foreground" /> },
    { title: "Reparaciones en Curso", value: "12", icon: <Wrench className="h-6 w-6 text-muted-foreground" /> },
    { title: "Vehículos Listos para Entrega", value: "3", icon: <Car className="h-6 w-6 text-muted-foreground" /> },
];

const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case 'Listo para Entrega': return 'default';
        case 'Pendiente Peritaje': return 'destructive';
        case 'En Reparación': return 'secondary';
        default: return 'outline';
    }
}

export default function TallerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Panel de Taller
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
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="flex items-center gap-4">
                    <Wrench className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Órdenes de Trabajo Activas</CardTitle>
                        <CardDescription>Gestiona las reparaciones asignadas a tu taller.</CardDescription>
                    </div>
                </div>
                <Button asChild><Link href="/dashboard/taller/reparaciones">Ver Todas</Link></Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Aseguradora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Ingreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {trabajos.map((trabajo) => (
                    <TableRow key={trabajo.id}>
                    <TableCell className="font-medium">{trabajo.vehiculo}</TableCell>
                    <TableCell>{trabajo.aseguradora}</TableCell>
                    <TableCell>
                        <Badge variant={getBadgeVariant(trabajo.estado)}>{trabajo.estado}</Badge>
                    </TableCell>
                    <TableCell>{trabajo.ingreso}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver/Editar</Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
              <CardHeader>
                  <CardTitle>Pagos Pendientes</CardTitle>
                  <CardDescription>Facturas pendientes de cobro.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>N° Factura</TableHead>
                              <TableHead className="text-right">Monto</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {pagosPendientes.map(pago => (
                              <TableRow key={pago.factura}>
                                  <TableCell className="font-medium">{pago.factura}</TableCell>
                                  <TableCell className="text-right">{pago.monto}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Notificaciones Recientes</CardTitle>
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
    </div>
  );
}
