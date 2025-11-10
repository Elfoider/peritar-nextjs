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
import { useAuth, useFirestore, useUser } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  firstName: z.string().min(2, "El nombre es requerido."),
  lastName: z.string().min(2, "El apellido es requerido."),
  docType: z.string({ required_error: "Seleccione un tipo de documento."}),
  docNumber: z.string().min(7, "El número de documento no es válido."),
  email: z.string().email("Por favor, introduce un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  policyNumber: z.string().min(5, "El número de póliza es requerido."),
  claimNumber: z.string().min(5, "El número de siniestro es requerido."),
});

export default function RegisterClientePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      docNumber: "",
      email: "",
      password: "",
      policyNumber: "",
      claimNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const clientData = {
        id: user.uid,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: '', // Phone is optional in the new schema, so we can leave it empty
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(firestore, "clientes", user.uid), clientData);

      toast({
        title: "Registro Exitoso",
        description: "Tu siniestro ha sido registrado. Ya puedes iniciar sesión.",
      });

      router.push("/dashboard/cliente");

    } catch (error: any) {
      console.error("Error registering client:", error);
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
            <CardTitle className="text-2xl">Registro de Cliente Asegurado</CardTitle>
            <CardDescription>
                Completa tus datos para registrar el siniestro y hacer el seguimiento.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="Juan" {...field} />
                            </FormControl>
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
                            <FormControl>
                                <Input placeholder="Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="docType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tipo de Documento</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="DNI">DNI</SelectItem>
                                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                    <SelectItem value="LC">LC</SelectItem>
                                    <SelectItem value="LE">LE</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="docNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Número de Documento</FormLabel>
                            <FormControl>
                                <Input placeholder="30123456" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="policyNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Número de Póliza</FormLabel>
                            <FormControl>
                                <Input placeholder="POL-98765" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="claimNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Número de Siniestro</FormLabel>
                            <FormControl>
                                <Input placeholder="SIN-12345" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Registrando..." : "Registrar Siniestro"}
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
