import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const peritajes = [
    { id: 'PER-112', vehiculo: 'Renault Sandero', ubicacion: 'Taller AutoFix', estado: 'Pendiente', asignado: '2023-10-27' },
    { id: 'PER-111', vehiculo: 'Mazda 3', ubicacion: 'Domicilio Cliente', estado: 'Completado', asignado: '2023-10-26' },
    { id: 'PER-110', vehiculo: 'Nissan Versa', ubicacion: 'Taller Veloz', estado: 'En Progreso', asignado: '2023-10-26' },
]

export default function PeritosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Panel de Perito
        </h2>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div className="flex items-center gap-4">
                <ClipboardList className="h-8 w-8 text-primary" />
                <CardTitle>Peritajes Asignados</CardTitle>
            </div>
            <Button>Sincronizar</Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Revisa y actualiza el estado de tus peritajes asignados.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Peritaje</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Asignación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peritajes.map((peritaje) => (
                <TableRow key={peritaje.id}>
                  <TableCell className="font-medium">{peritaje.id}</TableCell>
                  <TableCell>{peritaje.vehiculo}</TableCell>
                  <TableCell>{peritaje.ubicacion}</TableCell>
                  <TableCell>
                    <Badge variant={peritaje.estado === 'Completado' ? 'secondary' : 'default'}>{peritaje.estado}</Badge>
                  </TableCell>
                  <TableCell>{peritaje.asignado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
