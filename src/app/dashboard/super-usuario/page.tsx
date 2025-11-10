
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  ClipboardCheck,
  ClipboardList,
  FileText,
  DollarSign,
  AlertTriangle,
  UserPlus,
  BarChart2,
  Settings,
  Shield,
  Wrench,
  Users,
  Loader2,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, CartesianGrid, XAxis, YAxis, Line, ComposedChart, LineChart } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { List, ListItem } from "@/components/ui/list";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';


const userCreationSchema = z.object({
  role: z.enum(["aseguradora", "taller", "perito"], { required_error: "Debes seleccionar un rol." }),
  name: z.string().min(3, "El nombre/razón social es requerido.").optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  contactEmail: z.string().email("Email de contacto inválido.").optional(),
  contactPhone: z.string().min(8, "El teléfono no es válido.").optional(),
  email: z.string().email("El email de acceso es requerido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
}).superRefine((data, ctx) => {
    if(data.role === 'perito') {
        if (!data.firstName || data.firstName.length < 2) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El nombre es requerido.", path: ["firstName"]});
        }
        if (!data.lastName || data.lastName.length < 2) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El apellido es requerido.", path: ["lastName"]});
        }
    } else if(data.role) { // For 'aseguradora' and 'taller'
        if (!data.name || data.name.length < 3) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El nombre/razón social es requerido.", path: ["name"]});
        }
    }
    if (data.role === 'taller' && (!data.address || data.address.length < 5)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La dirección es requerida.", path: ["address"]});
    }
});


type UserCreationForm = z.infer<typeof userCreationSchema>;

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


const casesData = [
  { date: '2023-10-01', created: 30, closed: 20 },
  { date: '2023-10-08', created: 45, closed: 35 },
  { date: '2023-10-15', created: 50, closed: 42 },
  { date: '2023-10-22', created: 48, closed: 40 },
  { date: '2023-10-29', created: 60, closed: 55 },
  { date: '2023-11-05', created: 58, closed: 50 },
  { date: '2023-11-12', created: 70, closed: 65 },
  { date: '2023-11-19', created: 75, closed: 70 },
  { date: '2023-11-26', created: 80, closed: 72 },
  { date: '2023-12-03', created: 85, closed: 78 },
  { date: '2023-12-10', created: 90, closed: 85 },
  { date: '2023-12-17', created: 95, closed: 90 },
];

const chartConfig = {
  created: {
    label: "Creados",
    color: "hsl(var(--primary))",
  },
  closed: {
    label: "Cerrados",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const statCards = [
  {
    title: "Casos Activos",
    value: "1,234",
    icon: <FileText className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Nuevos Registros (30d)",
    value: "152",
    icon: <UserPlus className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Facturación Procesada",
    value: "$1.2M",
    icon: <DollarSign className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Casos Críticos",
    value: "18",
    icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
  },
];

const pendingValidations = [
    { name: "Taller Rápido SRL", type: "Taller", icon: <Wrench className="h-5 w-5 text-muted-foreground" /> },
    { name: "Peritajes del Sur", type: "Perito", icon: <ClipboardList className="h-5 w-5 text-muted-foreground" /> },
    { name: "Autoservice Norte", type: "Taller", icon: <Wrench className="h-5 w-5 text-muted-foreground" /> },
]

const topPeritos = [
    { name: "Carlos Rodriguez", cases: 128 },
    { name: "Ana Martínez", cases: 112 },
    { name: "Pedro Gomez", cases: 98 },
    { name: "Lucía Fernández", cases: 95 },
    { name: "Miguel Torres", cases: 89 },
]


export default function SuperUsuarioPage() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user: superUser } = useUser();

  const form = useForm<UserCreationForm>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: {
        role: undefined,
        name: "",
        firstName: "",
        lastName: "",
        address: "",
        contactEmail: "",
        contactPhone: "",
        email: "",
        password: ""
    }
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (values: UserCreationForm) => {
    if (!firestore || !auth || !superUser) return;
    setIsSubmitting(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      let collectionName = "";
      let entityData: any = {
        id: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      let userNameForLog = '';

      if (values.role === "aseguradora") {
        collectionName = "aseguradoras";
        entityData = { ...entityData, name: values.name, contactEmail: values.contactEmail, contactPhone: values.contactPhone };
        userNameForLog = values.name!;
      } else if (values.role === "taller") {
        collectionName = "talleres";
        entityData = { ...entityData, name: values.name, address: values.address, contactEmail: values.contactEmail, contactPhone: values.contactPhone };
        userNameForLog = values.name!;
      } else if (values.role === "perito") {
        collectionName = "peritos";
        entityData = { ...entityData, firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.contactPhone };
        userNameForLog = `${values.firstName} ${values.lastName}`;
      }
      
      await setDoc(doc(firestore, collectionName, user.uid), entityData);

      await logAuditEvent(firestore, superUser, 'super-usuario', 'create_user', {
          description: `Se creó el usuario ${values.role}: ${userNameForLog} (${values.email})`,
          targetId: user.uid,
          targetCollection: collectionName
      });

      toast({
        title: "Usuario Creado",
        description: `El nuevo ${values.role} y su usuario han sido registrados.`,
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
        title: "Error al crear usuario",
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">
        Dashboard Super Usuario
      </h2>
      
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.title === 'Casos Críticos' ? 'text-destructive' : ''}`}>{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Graph */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Casos Creados vs. Cerrados (90 días)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                 <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <LineChart accessibilityLayer data={casesData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line dataKey="created" type="monotone" stroke="var(--color-created)" strokeWidth={2} dot={false} />
                        <Line dataKey="closed" type="monotone" stroke="var(--color-closed)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>

        {/* Quick Actions & Metrics */}
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Tareas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button><UserPlus className="mr-2 h-4 w-4" /> Crear Nuevo Usuario</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Usuario Profesional</DialogTitle>
                                <DialogDescription>
                                    Seleccione el rol y complete los datos para registrar un nuevo usuario en la plataforma.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                                     <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rol del Usuario</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar un rol..." /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="aseguradora">Aseguradora</SelectItem>
                                                        <SelectItem value="taller">Taller</SelectItem>
                                                        <SelectItem value="perito">Perito</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {selectedRole === 'perito' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                                <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input placeholder="Juan" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                                <FormItem><FormLabel>Apellido</FormLabel><FormControl><Input placeholder="Pérez" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        </div>
                                    ) : (
                                         selectedRole && <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem><FormLabel>Nombre / Razón Social</FormLabel><FormControl><Input placeholder="Mi Empresa S.A." {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    )}

                                    {selectedRole === 'taller' && (
                                         <FormField control={form.control} name="address" render={({ field }) => (
                                            <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input placeholder="Av. Siempre Viva 123" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                    )}
                                    
                                    { selectedRole && (
                                        <>
                                            <FormField control={form.control} name="contactPhone" render={({ field }) => (
                                                <FormItem><FormLabel>Teléfono de Contacto</FormLabel><FormControl><Input placeholder="+54 11..." {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <div className="space-y-2 pt-4 border-t">
                                                <h4 className="font-medium text-sm">Credenciales de Acceso</h4>
                                                <FormField control={form.control} name="email" render={({ field }) => (
                                                    <FormItem><FormLabel>Email de Acceso</FormLabel><FormControl><Input type="email" placeholder="usuario@empresa.com" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                                <FormField control={form.control} name="password" render={({ field }) => (
                                                    <FormItem><FormLabel>Contraseña</FormLabel><FormControl><Input type="password" placeholder="Mínimo 8 caracteres" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            </div>
                                        </>
                                    )}

                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="outline" type="button">Cancelar</Button></DialogClose>
                                        <Button type="submit" disabled={isSubmitting || !selectedRole}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isSubmitting ? 'Guardando...' : 'Crear Usuario'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                    <Button variant="secondary"><BarChart2 className="mr-2 h-4 w-4" /> Ver Reportes Avanzados</Button>
                    <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Ir a Configuración</Button>
                     <CardDescription className="pt-4 pb-2">Talleres/Peritos Pendientes de Validación</CardDescription>
                     <List>
                        {pendingValidations.map(item => (
                             <ListItem key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.type}</span>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8">Revisar</Button>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Métricas Clave</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Tiempo Promedio de Gestión (TPA)</p>
                            <p className="text-xl font-bold">5.2 días</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tiempo Promedio de Peritaje (TPE)</p>
                            <p className="text-xl font-bold">24 horas</p>
                        </div>
                         <CardDescription className="pt-2 pb-1">Top 5 Peritos (Casos Cerrados)</CardDescription>
                         <List>
                            {topPeritos.map(perito => (
                                <ListItem key={perito.name} className="flex justify-between items-center text-sm">
                                    <span>{perito.name}</span>
                                    <span className="font-bold">{perito.cases}</span>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
