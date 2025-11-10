'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const siniestroSchema = z.object({
  // Cliente
  clienteNombre: z.string().min(2, 'El nombre es requerido'),
  clienteApellido: z.string().min(2, 'El apellido es requerido'),
  clienteEmail: z.string().email('Email inválido'),
  clienteTelefono: z.string().min(8, 'Teléfono inválido'),
  
  // Vehículo
  vehiculoMarca: z.string().min(2, 'La marca es requerida'),
  vehiculoModelo: z.string().min(2, 'El modelo es requerido'),
  vehiculoPatente: z.string().min(6, 'La patente no es válida').max(10),
  vehiculoAno: z.coerce.number().min(1950, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  
  // Siniestro
  fechaSiniestro: z.date({ required_error: 'La fecha es requerida' }),
  descripcion: z.string().min(10, 'La descripción es muy corta').optional(),
  
  // Informe Aseguradora
  informeDetalles: z.string().optional(),
  informeDocumentos: z.array(z.object({ url: z.string().url('Debe ser una URL válida.') })).optional(),
});

type SiniestroFormValues = z.infer<typeof siniestroSchema>;

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

export default function NuevoSiniestroPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SiniestroFormValues>({
    resolver: zodResolver(siniestroSchema),
    defaultValues: {
      clienteNombre: '',
      clienteApellido: '',
      clienteEmail: '',
      clienteTelefono: '',
      vehiculoMarca: '',
      vehiculoModelo: '',
      vehiculoPatente: '',
      vehiculoAno: new Date().getFullYear(),
      informeDocumentos: [{ url: '' }],
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "informeDocumentos",
  });

  const onSubmit = async (values: SiniestroFormValues) => {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debe estar autenticado para crear un siniestro.' });
        return;
    }

    setIsSubmitting(true);
    try {
        const siniestrosCollection = collection(firestore, 'siniestros');
        const clienteId = `cliente_${Date.now()}`; 

        const newSiniestro: any = {
            aseguradoraId: user.uid,
            clienteId: clienteId, 
            estado: "INICIADO",
            clienteInfo: {
                nombre: values.clienteNombre,
                apellido: values.clienteApellido,
                email: values.clienteEmail,
                telefono: values.clienteTelefono,
            },
            vehiculo: {
                marca: values.vehiculoMarca,
                modelo: values.vehiculoModelo,
                patente: values.vehiculoPatente.toUpperCase(),
                ano: values.vehiculoAno,
            },
            fechaSiniestro: values.fechaSiniestro.toISOString(),
            descripcion: values.descripcion || '',
            peritoId: null,
            tallerId: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        if (values.informeDetalles && values.informeDetalles.length > 0) {
            newSiniestro.informeAseguradora = {
                detalles: values.informeDetalles,
                documentos: values.informeDocumentos?.map(d => d.url).filter(url => url) || [],
                fecha: new Date().toISOString(),
            };
        }

        const docRef = await addDoc(siniestrosCollection, newSiniestro);
        
        await logAuditEvent(firestore, user, 'aseguradora', 'create_siniestro', {
            description: `Se creó el siniestro N° ${docRef.id} para el cliente ${values.clienteNombre} ${values.clienteApellido}.`,
            targetId: docRef.id
        });
        
        toast({
            title: 'Siniestro Creado Exitosamente',
            description: `El caso N° ${docRef.id} ha sido registrado.`,
        });

        router.push('/dashboard/aseguradora');

    } catch (error) {
        console.error("Error creating siniestro: ", error);
        toast({
            variant: 'destructive',
            title: 'Error al crear el siniestro',
            description: 'Hubo un problema al guardar los datos. Por favor, intente de nuevo.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Nuevo Siniestro</CardTitle>
          <CardDescription>
            Complete los detalles para registrar un nuevo siniestro en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* SECCIÓN CLIENTE */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos del Cliente</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField name="clienteNombre" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="clienteApellido" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Apellido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField name="clienteEmail" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="clienteTelefono" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              {/* SECCIÓN VEHÍCULO */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos del Vehículo</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                   <FormField name="vehiculoMarca" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Marca</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField name="vehiculoModelo" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField name="vehiculoPatente" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Patente</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="vehiculoAno" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Año</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              {/* SECCIÓN SINIESTRO */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detalles del Siniestro</h3>
                 <FormField
                    control={form.control}
                    name="fechaSiniestro"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Fecha del Siniestro</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Seleccionar fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    name="descripcion"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción Breve del Siniestro</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Ej: Colisión frontal leve en ciudad..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              </div>

               {/* SECCIÓN INFORME ASEGURADORA */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informe de la Aseguradora (Opcional)</h3>
                 <FormField
                    name="informeDetalles"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Detalles del Informe</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Añadir detalles del informe, denuncia, etc." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                <FormLabel>Documentos Adjuntos (URLs)</FormLabel>
                <div className="space-y-4 pt-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`informeDocumentos.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="https://ejemplo.com/documento.pdf" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1 && form.getValues(`informeDocumentos.${index}.url`) === ''}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ url: '' })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar otro Documento
                  </Button>
                </div>
              </div>
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {isSubmitting ? 'Guardando...' : 'Guardar Siniestro'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
