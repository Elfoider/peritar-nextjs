"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(1, "La contraseña es requerida."),
});

type FormValues = z.infer<typeof formSchema>;


async function getRoleForUser(firestore: any, user: User) {
    if (!firestore || !user) return 'desconocido';

    const roleCollections = ['super_usuarios', 'aseguradoras', 'talleres', 'peritos', 'clientes'];
    for (const collectionName of roleCollections) {
        const docRef = doc(firestore, collectionName, user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Firestore collection names are plural, we return the singular role name
            if (collectionName === 'super_usuarios') return 'super-usuario';
            return collectionName.slice(0, -1);
        }
    }
    return 'desconocido';
}


export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    // This effect redirects the user if they are already logged in.
    // The /dashboard route will handle the logic for /setup redirection if needed.
    if (!isUserLoading && user) {
        router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const loggedInUser = userCredential.user;

        // Log audit event
        if (firestore && loggedInUser) {
            const userRole = await getRoleForUser(firestore, loggedInUser);
            const auditLog = {
                timestamp: serverTimestamp(),
                userId: loggedInUser.uid,
                userEmail: loggedInUser.email,
                userRole: userRole,
                action: 'user_login',
                details: {
                    description: `El usuario ${loggedInUser.email} ha iniciado sesión.`
                }
            };
            await addDoc(collection(firestore, 'audit_logs'), auditLog);
        }
        
        // On successful login, the useEffect will trigger the redirection.
      } catch(error) {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "El email o la contraseña son incorrectos.",
        });
      } finally {
        setIsSubmitting(false);
      }
  };

  // While checking user auth state, or if user is logged in, show loading.
  // The useEffect will handle redirection.
  if (isUserLoading || user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Cargando...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="space-y-4 text-center">
          <Link href="/" className="inline-block">
            <Logo className="mx-auto h-12 w-auto" />
          </Link>
          <CardTitle className="text-2xl">Bienvenido de Nuevo</CardTitle>
          <CardDescription>
            Ingresa tu email y contraseña para acceder a tu panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email")}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" {...register("password")} />
               {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Cliente asegurado?{" "}
            <Link href="/registro/cliente" className="underline text-primary hover:text-primary/80">
              Registra tu siniestro aquí
            </Link>
          </div>
           <div className="mt-2 text-center text-sm">
            ¿Eres profesional?{" "}
            <Link href="/registro/profesional" className="underline text-primary hover:text-primary/80">
              Únete a nuestra red
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    