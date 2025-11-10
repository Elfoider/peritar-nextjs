'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const casos = [
    { id: 'PRE-098', siniestro: 'SIN-078', aseguradora: 'Seguros ABC', estado: 'Pendiente' },
    { id: 'PRE-097', siniestro: 'SIN-077', aseguradora: 'Protección Total', estado: 'Aprobado' },
    { id: 'PRE-096', siniestro: 'SIN-076', aseguradora: 'Mi Seguro', estado: 'Rechazado' },
    { id: 'PRE-095', siniestro: 'SIN-075', aseguradora: 'Seguros ABC', estado: 'Pendiente' },
    { id: 'PRE-094', siniestro: 'SIN-074', aseguradora: 'Protección Total', estado: 'Aprobado' },
]

const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case 'Aprobado': return 'secondary';
        case 'Rechazado': return 'destructive';
        case 'Pendiente': return 'default';
        default: return 'outline';
    }
}

export default function PresupuestosPendientesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Gestión de Presupuestos</h2>
       <Card>
        <CardHeader>
          <CardTitle>Listado de Casos Asignados</CardTitle>
          <CardDescription>
            Vehículos que requieren un presupuesto de reparación o cuyo presupuesto está en revisión.
          </CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por N° Siniestro, Aseguradora..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/2 lg:w-1/3"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Siniestro</TableHead>
                <TableHead>Aseguradora</TableHead>
                <TableHead>Estado del Presupuesto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {casos.map((caso) => (
                <TableRow key={caso.id}>
                  <TableCell className="font-medium">{caso.siniestro}</TableCell>
                  <TableCell>{caso.aseguradora}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(caso.estado)}>{caso.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {caso.estado === 'Pendiente' ? (
                      <Button size="sm">Generar Presupuesto</Button>
                    ) : (
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
