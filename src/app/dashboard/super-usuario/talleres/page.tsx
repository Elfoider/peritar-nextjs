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

const tallerSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  address: z.string().min(5, "La dirección es requerida."),
  contactEmail: z.string().email("Email de contacto inválido."),
  contactPhone: z.string().min(8, "El teléfono no es válido."),
  email: z.string().email("El email de acceso es requerido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

type TallerForm = z.infer<typeof tallerSchema>;

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

export default function TalleresAdminPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user: superUser } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const talleresQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'talleres');
  }, [firestore]);

  const { data: talleres, isLoading } = useCollection(talleresQuery);

  const form = useForm<TallerForm>({
    resolver: zodResolver(tallerSchema),
    defaultValues: {
      name: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: TallerForm) => {
    if (!firestore || !auth || !superUser) return;
    setIsSubmitting(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const tallerData = {
        id: user.uid,
        name: values.name,
        address: values.address,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(doc(firestore, "talleres", user.uid), tallerData);

      await logAuditEvent(firestore, superUser, 'super-usuario', 'create_user', {
          description: `Se creó el usuario taller: ${values.name} (${values.email})`,
          targetId: user.uid,
          targetCollection: 'talleres'
      });

      toast({
        title: "Taller Creado",
        description: "El nuevo taller y su usuario han sido registrados.",
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
        title: "Error al crear taller",
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
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Talleres</h2>
            <p className="text-muted-foreground">Administra los talleres registrados en la plataforma.</p>
        </div>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Agregar Taller</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Taller</DialogTitle>
                    <DialogDescription>
                        Complete los datos para registrar un nuevo taller y crear su usuario de acceso.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Taller</FormLabel>
                                    <FormControl><Input placeholder="Taller Rápido SRL" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl><Input placeholder="Av. Corrientes 1234" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="contactEmail"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Email de Contacto</FormLabel>
                                      <FormControl><Input type="email" placeholder="contacto@taller.com" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="contactPhone"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Teléfono de Contacto</FormLabel>
                                      <FormControl><Input placeholder="+54 11 5555-5555" {...field} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                        </div>
                         <div className="space-y-2 pt-4 border-t">
                            <h4 className="font-medium text-sm">Credenciales de Acceso</h4>
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email de Acceso</FormLabel>
                                        <FormControl><Input type="email" placeholder="usuario@taller.com" {...field} /></FormControl>
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
                                {isSubmitting ? 'Guardando...' : 'Guardar Taller'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Talleres</CardTitle>
           <CardDescription>
            Un total de {talleres?.length || 0} talleres registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={5}>Cargando...</TableCell></TableRow>}
              {!isLoading && talleres?.length === 0 && <TableRow><TableCell colSpan={5}>No hay talleres registrados.</TableCell></TableRow>}
              {talleres?.map(taller => (
                <TableRow key={taller.id}>
                  <TableCell className="font-medium">{taller.name}</TableCell>
                  <TableCell>{taller.address}</TableCell>
                  <TableCell>{taller.contactEmail}</TableCell>
                  <TableCell>{taller.contactPhone}</TableCell>
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
