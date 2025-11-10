'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ClientesAdminPage() {
  const firestore = useFirestore();

  const clientesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'clientes');
  }, [firestore]);

  const { data: clientes, isLoading } = useCollection(clientesQuery);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
            <p className="text-muted-foreground">Visualiza y administra los clientes con siniestros registrados.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Clientes Asegurados</CardTitle>
          <CardDescription>
            Un total de {clientes?.length || 0} clientes registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5}>Cargando...</TableCell></TableRow>}
              {!isLoading && clientes?.length === 0 && <TableRow><TableCell colSpan={5}>No hay clientes registrados.</TableCell></TableRow>}
              {clientes?.map(cliente => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.firstName}</TableCell>
                  <TableCell>{cliente.lastName}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.phone || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Ver Casos</Button>
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
