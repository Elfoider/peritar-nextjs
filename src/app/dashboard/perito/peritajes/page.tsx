'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';


const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case 'INFORME_COMPLETADO': return 'outline';
        case 'PERITAJE_ASIGNADO': return 'default';
        case 'EN_REPARACION': return 'secondary';
        case 'CERRADO': return 'outline';
        default: return 'secondary';
    }
}

const getEstadoLabel = (estado: string) => {
    const labels: { [key: string]: string } = {
        'INICIADO': 'Iniciado',
        'PERITAJE_ASIGNADO': 'Peritaje Asignado',
        'INFORME_PENDIENTE': 'Informe Pendiente',
        'INFORME_COMPLETADO': 'Informe Completado',
        'PRESUPUESTO_PENDIENTE': 'Presupuesto Pendiente',
        'PRESUPUESTO_APROBADO': 'Presupuesto Aprobado',
        'EN_REPARACION': 'En Reparación',
        'REPARACION_FINALIZADA': 'Reparación Finalizada',
        'CERRADO': 'Cerrado'
    };
    return labels[estado] || estado;
}


export default function PeritajesAsignadosPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const peritajesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, 'siniestros'),
        where('peritoId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: peritajes, isLoading } = useCollection(peritajesQuery);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Mis Casos Asignados</h2>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Peritajes Activos</CardTitle>
          <CardDescription>
            Aquí se muestran todos los peritajes que tienes asignados para gestionar.
          </CardDescription>
           <div className="relative pt-2">
            <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por N° Siniestro, Cliente, Vehículo..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/2 lg:w-1/3"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Siniestro</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center">Cargando tus casos asignados...</TableCell>
                  </TableRow>
              )}
              {!isLoading && peritajes?.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center">No tienes siniestros asignados por el momento.</TableCell>
                  </TableRow>
              )}
              {peritajes?.map((peritaje) => (
                <TableRow key={peritaje.id}>
                  <TableCell className="font-medium truncate max-w-xs">{peritaje.id}</TableCell>
                  <TableCell>{peritaje.clienteInfo.nombre} {peritaje.clienteInfo.apellido}</TableCell>
                  <TableCell>{peritaje.vehiculo.marca} {peritaje.vehiculo.modelo}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(peritaje.estado)}>{getEstadoLabel(peritaje.estado)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/perito/peritajes/informe/${peritaje.id}`}>
                            {peritaje.estado === 'PERITAJE_ASIGNADO' ? 'Cargar Informe' : 'Ver Detalles'}
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
  )
}
