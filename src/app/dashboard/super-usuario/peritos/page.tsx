'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { errorEmitter, FirestorePermissionError } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const peritoSchema = z.object({
  firstName: z.string().min(2, "El nombre es requerido."),
  lastName: z.string().min(2, "El apellido es requerido."),
  email: z.string().email("El email de acceso es requerido."),
  phone: z.string().min(8, "El teléfono no es válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

type PeritoForm = z.infer<typeof peritoSchema>;

async function logAuditEvent(firestore: any, user: any, role: string, action: string, details: object) {
    if (!firestore || !user) return;
    try {
        await addDoc(collection(firestore, 'audit_logs'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            userEmail: user.email,
            userRole: role,
            action: action,
            details: details
        });
    } catch (error) {
        console.error("Error logging audit event:", error);
    }
}

export default function PeritosAdminPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user: superUser } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const peritosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'peritos');
  }, [firestore]);

  const { data: peritos, isLoading } = useCollection(peritosQuery);

  const form = useForm<PeritoForm>({
    resolver: zodResolver(peritoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: ""
    },
  });

  const onSubmit = async (values: PeritoForm) => {
    if (!firestore || !auth || !superUser) return;
    setIsSubmitting(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const peritoData = {
        id: user.uid,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(doc(firestore, "peritos", user.uid), peritoData);

      await logAuditEvent(firestore, superUser, 'super-usuario', 'create_user', {
          description: `Se creó el usuario perito: ${values.firstName} ${values.lastName} (${values.email})`,
          targetId: user.uid,
          targetCollection: 'peritos'
      });

      toast({
        title: "Perito Creado",
        description: "El nuevo perito y su usuario han sido registrados.",
      });
      form.reset();
      setOpen(false);

    } catch (error: any) {
      console.error(error);
      let description = "Ocurrió un error inesperado.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este email ya está en uso por otro usuario.";
      }
      toast({
        variant: "destructive",
        title: "Error al crear perito",
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Peritos</h2>
          <p className="text-muted-foreground">Administra los peritos registrados en la plataforma.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
              <Button>Agregar Perito</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                  <DialogTitle>Nuevo Perito</DialogTitle>
                  <DialogDescription>
                      Complete los datos para registrar un nuevo perito y crear su usuario de acceso.
                  </DialogDescription>
              </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl><Input placeholder="Juan" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl><Input placeholder="Pérez" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                      <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Teléfono</FormLabel>
                                  <FormControl><Input placeholder="+54 11 5555-5555" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <div className="space-y-2 pt-4 border-t">
                          <h4 className="font-medium text-sm">Credenciales de Acceso</h4>
                          <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Email de Acceso</FormLabel>
                                      <FormControl><Input type="email" placeholder="perito@dominio.com" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Contraseña</FormLabel>
                                      <FormControl><Input type="password" placeholder="Mínimo 8 caracteres" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                        <DialogFooter>
                          <DialogClose asChild>
                              <Button variant="outline" type="button">Cancelar</Button>
                          </DialogClose>
                          <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {isSubmitting ? 'Guardando...' : 'Guardar Perito'}
                          </Button>
                      </DialogFooter>
                  </form>
              </Form>
          </DialogContent>
      </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Peritos</CardTitle>
          <CardDescription>
             Un total de {peritos?.length || 0} peritos registrados.
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
              {!isLoading && peritos?.length === 0 && <TableRow><TableCell colSpan={5}>No hay peritos registrados.</TableCell></TableRow>}
              {peritos?.map(perito => (
                <TableRow key={perito.id}>
                  <TableCell className="font-medium">{perito.firstName}</TableCell>
                  <TableCell>{perito.lastName}</TableCell>
                  <TableCell>{perito.email}</TableCell>
                  <TableCell>{perito.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
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
