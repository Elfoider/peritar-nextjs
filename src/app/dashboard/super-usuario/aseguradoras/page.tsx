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

const aseguradoraSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  contactEmail: z.string().email("Email de contacto inválido."),
  contactPhone: z.string().min(8, "El teléfono no es válido."),
  email: z.string().email("El email de acceso es requerido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

type AseguradoraForm = z.infer<typeof aseguradoraSchema>;

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

export default function AseguradorasAdminPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user: superUser } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const aseguradorasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'aseguradoras');
  }, [firestore]);

  const { data: aseguradoras, isLoading } = useCollection(aseguradorasQuery);

  const form = useForm<AseguradoraForm>({
    resolver: zodResolver(aseguradoraSchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      contactPhone: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AseguradoraForm) => {
    if (!firestore || !auth || !superUser) return;
    setIsSubmitting(true);
    
    try {
      // NOTE: We cannot create users and set documents in a transaction.
      // We are not using a transaction here.
      // We first create the user.
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Then, we create the document in Firestore with the user's UID.
      const aseguradoraData = {
        id: user.uid,
        name: values.name,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = doc(firestore, "aseguradoras", user.uid);
      await setDoc(docRef, aseguradoraData);

      await logAuditEvent(firestore, superUser, 'super-usuario', 'create_user', {
          description: `Se creó el usuario aseguradora: ${values.name} (${values.email})`,
          targetId: user.uid,
          targetCollection: 'aseguradoras'
      });

      toast({
        title: "Aseguradora Creada",
        description: "La nueva aseguradora y su usuario han sido registrados.",
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
        title: "Error al crear aseguradora",
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
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Aseguradoras</h2>
            <p className="text-muted-foreground">Administra las aseguradoras registradas en la plataforma.</p>
        </div>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Agregar Aseguradora</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Nueva Aseguradora</DialogTitle>
                    <DialogDescription>
                        Complete los datos para registrar una nueva compañía y crear su usuario de acceso.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la Aseguradora</FormLabel>
                                    <FormControl><Input placeholder="Seguros LATAM" {...field} /></FormControl>
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
                                        <FormControl><Input type="email" placeholder="contacto@seguro.com" {...field} /></FormControl>
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
                                        <FormControl><Input placeholder="+54 11..." {...field} /></FormControl>
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
                                        <FormControl><Input type="email" placeholder="usuario@seguro.com" {...field} /></FormControl>
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
                                {isSubmitting ? 'Guardando...' : 'Guardar Aseguradora'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Aseguradoras</CardTitle>
          <CardDescription>
            Un total de {aseguradoras?.length || 0} aseguradoras registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email de Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={4}>Cargando...</TableCell></TableRow>}
              {!isLoading && aseguradoras?.length === 0 && <TableRow><TableCell colSpan={4}>No hay aseguradoras registradas.</TableCell></TableRow>}
              {aseguradoras?.map(aseguradora => (
                <TableRow key={aseguradora.id}>
                  <TableCell className="font-medium">{aseguradora.name}</TableCell>
                  <TableCell>{aseguradora.contactEmail}</TableCell>
                  <TableCell>{aseguradora.contactPhone}</TableCell>
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
