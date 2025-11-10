import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const trabajos = [
    { id: 'REP-056', vehiculo: 'Toyota Corolla', aseguradora: 'Seguros ABC', estado: 'En Reparación', ingreso: '2023-10-26' },
    { id: 'REP-057', vehiculo: 'Honda CR-V', aseguradora: 'Protección Total', estado: 'Pendiente Peritaje', ingreso: '2023-10-27' },
    { id: 'REP-058', vehiculo: 'Ford Focus', aseguradora: 'Mi Seguro', estado: 'Listo para Entrega', ingreso: '2023-10-20' },
]

export default function TalleresPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Panel de Taller
        </h2>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div className="flex items-center gap-4">
                <Wrench className="h-8 w-8 text-primary" />
                <CardTitle>Órdenes de Trabajo</CardTitle>
            </div>
            <Button>Nueva Orden</Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Gestiona las reparaciones asignadas a tu taller.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Reparación</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Aseguradora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trabajos.map((trabajo) => (
                <TableRow key={trabajo.id}>
                  <TableCell className="font-medium">{trabajo.id}</TableCell>
                  <TableCell>{trabajo.vehiculo}</TableCell>
                  <TableCell>{trabajo.aseguradora}</TableCell>
                  <TableCell>
                    <Badge variant={trabajo.estado === 'Listo para Entrega' ? 'outline' : 'default'}>{trabajo.estado}</Badge>
                  </TableCell>
                  <TableCell>{trabajo.ingreso}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
