'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Info, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChatSiniestro } from './chat-siniestro';

const informeSchema = z.object({
  detalles: z.string().min(20, 'Los detalles del informe son requeridos y deben ser descriptivos.'),
  fotos: z.array(z.object({ url: z.string().url('Debe ser una URL válida.') })).min(1, 'Se requiere al menos una foto.'),
});

type InformeFormValues = z.infer<typeof informeSchema>;

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

export default function InformePeritajePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(null);


  const siniestroRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'siniestros', params.id);
  }, [firestore, params.id]);

  const { data: siniestro, isLoading } = useDoc(siniestroRef);

   useEffect(() => {
    if (siniestro && !siniestro.peritoId && user && siniestroRef) {
      const assignPerito = async () => {
        try {
          await updateDoc(siniestroRef, {
            peritoId: user.uid,
            estado: 'PERITAJE_ASIGNADO',
            updatedAt: serverTimestamp(),
          });
          
          await logAuditEvent(firestore, user, 'perito', 'assign_peritaje', {
            description: `El perito se auto-asignó el siniestro N° ${siniestroRef.id}.`,
            targetId: siniestroRef.id
          });

          setAssignmentMessage(`Este caso (N° ${params.id.substring(0, 7)}) te ha sido asignado. Ahora puedes completar el informe.`);
          
        } catch (error) {
          console.error("Error auto-assigning perito:", error);
          toast({
            variant: 'destructive',
            title: 'Error de Asignación',
            description: 'No se pudo asignar el caso. Por favor, intenta de nuevo.',
          });
        }
      };
      assignPerito();
    }
  }, [siniestro, user, siniestroRef, firestore, toast, params.id]);

  const form = useForm<InformeFormValues>({
    resolver: zodResolver(informeSchema),
    defaultValues: {
      detalles: '',
      fotos: [{ url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fotos',
  });

  const onSubmit = async (values: InformeFormValues) => {
    if (!siniestroRef || !user) return;
    setIsSubmitting(true);
    try {
      await updateDoc(siniestroRef, {
        informePeritaje: {
          detalles: values.detalles,
          fotos: values.fotos.map(f => f.url),
          fecha: new Date().toISOString(),
        },
        estado: 'INFORME_COMPLETADO',
        updatedAt: serverTimestamp(),
      });

      await logAuditEvent(firestore, user, 'perito', 'upload_informe_peritaje', {
          description: `El perito cargó el informe para el siniestro N° ${siniestroRef.id}.`,
          targetId: siniestroRef.id
      });

      toast({
        title: 'Informe Enviado',
        description: 'El informe de peritaje ha sido guardado y notificado a la aseguradora.',
      });

      router.push('/dashboard/perito');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: 'destructive',
        title: 'Error al enviar el informe',
        description: 'Hubo un problema al guardar los datos. Por favor, intente de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Cargando datos del siniestro...</div>;
  }

  if (!siniestro) {
    return <div className="p-8">No se encontró el siniestro con ID: {params.id}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Informe de Peritaje para Siniestro N° {params.id.substring(0, 7)}...</CardTitle>
                <CardDescription>
                  Detalla los daños, sube imágenes y finaliza el informe. El estado del caso cambiará a "INFORME_COMPLETADO".
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {assignmentMessage && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>¡Caso Asignado!</AlertTitle>
                    <AlertDescription>
                      {assignmentMessage}
                    </AlertDescription>
                  </Alert>
                )}
                 <Alert>
                  <AlertTitle>Datos del Caso</AlertTitle>
                  <AlertDescription>
                      <ul className="text-sm space-y-1 mt-2">
                          <li><strong>Cliente:</strong> {siniestro.clienteInfo.nombre} {siniestro.clienteInfo.apellido}</li>
                          <li><strong>Vehículo:</strong> {siniestro.vehiculo.marca} {siniestro.vehiculo.modelo}</li>
                          <li><strong>Patente:</strong> {siniestro.vehiculo.patente}</li>
                      </ul>
                  </AlertDescription>
                </Alert>

                <FormField
                  control={form.control}
                  name="detalles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detalles del Informe</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={8} placeholder="Describir en detalle los daños observados, piezas afectadas, y cualquier otra consideración relevante..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Fotos del Siniestro</FormLabel>
                  <CardDescription className="mb-4">Añade las URLs de las imágenes. Por ahora, no se pueden subir archivos directamente.</CardDescription>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`fotos.${index}.url`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder="https://ejemplo.com/imagen.jpg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
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
                      Agregar otra Foto
                    </Button>
                  </div>
                </div>

              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Enviando...' : 'Enviar Informe'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <ChatSiniestro siniestroId={params.id} />

      </div>
    </div>
  );
}

    