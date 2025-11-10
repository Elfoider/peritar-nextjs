'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SiniestrosDisponiblesPage() {
    const firestore = useFirestore();

    const siniestrosQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'siniestros'), 
            where('estado', '==', 'INICIADO'),
            where('peritoId', '==', null)
        );
    }, [firestore]);

    const { data: siniestros, isLoading } = useCollection(siniestrosQuery);

    return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Siniestros Disponibles</h2>
      <Card>
        <CardHeader>
          <CardTitle>Bandeja de Siniestros sin Asignar</CardTitle>
          <CardDescription>
            Estos son los casos nuevos que esperan a que un perito los tome.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha Reporte</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">Cargando siniestros disponibles...</TableCell>
                    </TableRow>
                )}
                {!isLoading && siniestros?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">No hay siniestros disponibles por el momento.</TableCell>
                    </TableRow>
                )}
                {siniestros?.map((siniestro) => (
                    <TableRow key={siniestro.id}>
                        <TableCell>
                            {format(new Date(siniestro.fechaSiniestro), 'dd MMM yyyy', { locale: es })}
                        </TableCell>
                        <TableCell className="font-medium">{siniestro.vehiculo.marca} {siniestro.vehiculo.modelo} ({siniestro.vehiculo.patente})</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{siniestro.descripcion}</TableCell>
                        <TableCell className="text-right">
                            <Button asChild variant="default" size="sm">
                                <Link href={`/dashboard/perito/peritajes/informe/${siniestro.id}`}>
                                    Ver y Asignar
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
