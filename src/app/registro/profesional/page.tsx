"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";

const formSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es requerido."),
  cuit: z.string().min(11, "El CUIT debe tener 11 dígitos.").max(11, "El CUIT debe tener 11 dígitos."),
  email: z.string().email("Por favor, introduce un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  role: z.string({ required_error: "Debes seleccionar un rol." }),
  specialty: z.string().optional(),
});

export default function RegisterProfesionalPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      cuit: "",
      email: "",
      password: "",
      specialty: "",
    },
  });

  const selectedRole = form.watch("role");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const professionalData = {
        name: values.fullName,
        cuit: values.cuit,
        email: values.email,
        role: values.role,
        specialty: values.specialty || '',
        status: 'pending_approval', // Professionals need to be approved
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const collectionName = values.role === 'perito' ? 'peritos' : 'talleres';
      await setDoc(doc(firestore, collectionName, user.uid), professionalData);

      toast({
        title: "Solicitud de Registro Enviada",
        description: "Hemos recibido tu solicitud. La revisaremos y te notificaremos por email cuando tu cuenta sea aprobada.",
      });
      form.reset();

    } catch (error: any) {
        console.error("Error registering professional:", error);
        let description = "Ocurrió un error inesperado.";
        if (error.code === 'auth/email-already-in-use') {
            description = "Este email ya está registrado. Por favor, inicia sesión.";
        }
        toast({
            variant: "destructive",
            title: "Error en el registro",
            description,
        });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
            <Link href="/" className="inline-block mb-4">
                <Logo className="mx-auto h-12 w-auto" />
            </Link>
            <CardTitle className="text-2xl">Registro de Profesionales</CardTitle>
            <CardDescription>
                Únete a la red de PERITAR. Completa el formulario para solicitar tu acceso.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Soy un</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar rol..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="perito">Perito</SelectItem>
                                <SelectItem value="taller">Taller</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre Completo o Razón Social</FormLabel>
                        <FormControl>
                            <Input placeholder="Tu nombre o el de tu empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cuit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CUIT</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: 20123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email de Contacto</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Crear Contraseña</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                {selectedRole && (
                    <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {selectedRole === 'perito' ? 'Especialidad(es)' : 'Servicios Ofrecidos'}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={
                                            selectedRole === 'perito'
                                            ? "Ej: Vehículos pesados, motos, daños por granizo..."
                                            : "Ej: Chapa y pintura, mecánica general, tren delantero..."
                                        }
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting || !selectedRole}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud de Registro"}
                </Button>
            </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="underline text-primary">
                    Inicia Sesión
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    