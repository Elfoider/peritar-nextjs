'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AuditoriaPage() {
  const firestore = useFirestore();

  const auditLogsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'audit_logs'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: auditLogs, isLoading } = useCollection(auditLogsQuery);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Registro de Auditoría</h2>
          <p className="text-muted-foreground">Monitorea todas las acciones realizadas en la plataforma.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Actividad del Sistema</CardTitle>
          <CardDescription>
            Un total de {auditLogs?.length || 0} eventos registrados.
          </CardDescription>
          <div className="flex flex-col md:flex-row gap-2 pt-4">
              <Input placeholder="Buscar por email o acción..." className="md:max-w-xs" />
              <Select>
                  <SelectTrigger className="md:w-[180px]">
                      <SelectValue placeholder="Filtrar por Rol" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="super-usuario">Super Usuario</SelectItem>
                      <SelectItem value="aseguradora">Aseguradora</SelectItem>
                      <SelectItem value="taller">Taller</SelectItem>
                      <SelectItem value="perito">Perito</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                  </SelectContent>
              </Select>
              <Button>Aplicar Filtros</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Cargando registros...</TableCell></TableRow>}
              {!isLoading && auditLogs?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No hay registros de auditoría.</TableCell></TableRow>}
              {auditLogs?.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.timestamp ? format(parseISO(log.timestamp.toDate().toISOString()), 'dd/MM/yyyy HH:mm', { locale: es }) : 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">{log.userEmail}</TableCell>
                  <TableCell>{log.userRole}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.details?.description || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
    