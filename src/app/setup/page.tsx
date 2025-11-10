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
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useAuth, useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(2, "El nombre es requerido."),
  lastName: z.string().min(2, "El apellido es requerido."),
  email: z.string().email("Por favor, introduce un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SetupPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  
  const superUsuariosQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'super_usuarios');
  }, [firestore]);
  
  const { data: superUsuarios, isLoading: isSuperUsuariosLoading } = useCollection(superUsuariosQuery);

  useEffect(() => {
    // If super users exist and loading is complete, redirect non-super-users away
    if (!isSuperUsuariosLoading && superUsuarios && superUsuarios.length > 0) {
      if (!user && !isUserLoading) {
        // If not logged in, send to login page
        router.push('/login');
      } else if (user) {
        // If a user is logged in (even the one we are about to create), and a super user doc exists, go to dashboard
        router.push('/dashboard');
      }
    }
  }, [superUsuarios, isSuperUsuariosLoading, user, isUserLoading, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (superUsuarios && superUsuarios.length > 0) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Ya existe un super usuario. Por favor, inicia sesión.",
        });
        router.push('/login');
        return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const newUser = userCredential.user;

      const superUsuarioData = {
        id: newUser.uid,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // This is the critical part: ensure the document is created before proceeding.
      await setDoc(doc(firestore, "super_usuarios", newUser.uid), superUsuarioData);

      toast({
        title: "¡Cuenta Creada!",
        description: "El Super Usuario ha sido creado exitosamente. Redirigiendo...",
      });

      // Now that we are sure the doc is created, we can redirect.
      router.push('/dashboard');

    } catch (error: any) {
      console.error("Error creating super user:", error);
       let description = "Ocurrió un error inesperado.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este email ya está registrado. Por favor, intenta iniciar sesión.";
      }
      toast({
        variant: "destructive",
        title: "Error al crear la cuenta",
        description,
      });
       setIsSubmitting(false);
    } 
  }

  if (isSuperUsuariosLoading || isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Verificando configuración...</p>
        </div>
    );
  }
  
  if (superUsuarios && superUsuarios.length > 0) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>El super usuario ya existe. Redirigiendo...</p>
        </div>
    );
  }

  return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
            <Link href="/" className="inline-block mb-4">
                <Logo className="mx-auto h-12 w-auto" />
            </Link>
            <CardTitle className="text-2xl">Configuración Inicial</CardTitle>
            <CardDescription>
                Crea la cuenta principal de Super Usuario para administrar PERITAR.
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
                                <Input placeholder="Admin" {...field} />
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
                                <Input placeholder="General" {...field} />
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
                            <Input type="email" placeholder="admin@peritar.com" {...field} />
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
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creando cuenta..." : "Crear Super Usuario"}
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
