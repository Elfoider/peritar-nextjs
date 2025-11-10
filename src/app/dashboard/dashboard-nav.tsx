'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  Briefcase,
  BookUser,
  Car,
  ClipboardList,
  LayoutGrid,
  LogOut,
  Settings,
  Shield,
  Wrench,
  Users,
  FileText,
  FileSearch,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const superUsuarioMenu = [
    { href: "/dashboard/super-usuario", label: "Dashboard", icon: <LayoutGrid /> },
    { href: "/dashboard/super-usuario/aseguradoras", label: "Aseguradoras", icon: <Shield /> },
    { href: "/dashboard/super-usuario/talleres", label: "Talleres", icon: <Wrench /> },
    { href: "/dashboard/super-usuario/peritos", label: "Peritos", icon: <ClipboardList /> },
    { href: "/dashboard/super-usuario/clientes", label: "Clientes", icon: <Users /> },
    { href: "/dashboard/super-usuario/auditoria", label: "Auditoría", icon: <BookUser /> },
]

const aseguradoraMenu = [
    { href: "/dashboard/aseguradora", label: "Dashboard", icon: <LayoutGrid /> },
    { href: "/dashboard/aseguradora/siniestros", label: "Mis Casos", icon: <Briefcase /> },
    { href: "/dashboard/aseguradora/siniestros/nuevo", label: "Nuevo Siniestro", icon: <Car /> },
]

const tallerMenu = [
    { href: "/dashboard/taller", label: "Dashboard", icon: <LayoutGrid /> },
    { href: "/dashboard/taller/presupuestos", label: "Presupuestos", icon: <FileText /> },
    { href: "/dashboard/taller/reparaciones", label: "Reparaciones", icon: <Wrench /> },
]

const peritoMenu = [
    { href: "/dashboard/perito", label: "Dashboard", icon: <LayoutGrid /> },
    { href: "/dashboard/perito/peritajes", label: "Asignados", icon: <ClipboardList /> },
    { href: "/dashboard/perito/peritajes/disponibles", label: "Siniestros Disponibles", icon: <FileSearch /> },
]

const clienteMenu = [
    { href: "/dashboard/cliente", label: "Mi Siniestro", icon: <Car /> },
]


// This is a placeholder for a real role detection logic
const useUserRole = () => {
    const { user } = useUser();
    const pathname = usePathname();
    
    // This is a placeholder for real role detection from Firestore/custom claims
    if (pathname.startsWith('/dashboard/super-usuario')) return 'super-usuario';
    if (pathname.startsWith('/dashboard/aseguradora')) return 'aseguradora';
    if (pathname.startsWith('/dashboard/taller')) return 'taller';
    if (pathname.startsWith('/dashboard/perito')) return 'perito';
    if (pathname.startsWith('/dashboard/cliente')) return 'cliente';
    
    // Default or based on user data
    return 'super-usuario';
}

const roleMenus: Record<string, {label: string, items: typeof superUsuarioMenu, user: { name: string, email: string, avatar: string, fallback: string }}> = {
    'super-usuario': { 
        label: 'Super Usuario',
        items: superUsuarioMenu,
        user: { name: 'Admin General', email: 'admin@peritar.com.ar', avatar: 'https://picsum.photos/seed/admin/100/100', fallback: 'AG' }
    },
    'aseguradora': { 
        label: 'Aseguradora',
        items: aseguradoraMenu,
        user: { name: 'Staff Aseguradora', email: 'staff@seguros.com', avatar: 'https://picsum.photos/seed/aseguradora/100/100', fallback: 'SA' }
    },
    'taller': { 
        label: 'Taller',
        items: tallerMenu,
        user: { name: 'Jefe de Taller', email: 'jefe@tallerauto.com', avatar: 'https://picsum.photos/seed/taller/100/100', fallback: 'JT' }
    },
    'perito': { 
        label: 'Perito',
        items: peritoMenu,
        user: { name: 'Perito Experto', email: 'perito@experto.com', avatar: 'https://picsum.photos/seed/perito/100/100', fallback: 'PE' }
    },
    'cliente': { 
        label: 'Cliente',
        items: clienteMenu,
        user: { name: 'Juan Cliente', email: 'juan@cliente.com', avatar: 'https://picsum.photos/seed/cliente/100/100', fallback: 'JC' }
    },
}

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


export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useUserRole();
  const { user: authUser } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { items, user, label } = roleMenus[role] || roleMenus['super-usuario'];
  const { isMobile } = useSidebar();
  const lastPathname = useRef(pathname);
  
  const handleLogout = async () => {
    if (!auth || !authUser) return;
    await logAuditEvent(firestore, authUser, role, 'user_logout', {
        description: `El usuario ${authUser.email} ha cerrado sesión.`
    });
    await auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    if (pathname !== lastPathname.current && authUser && firestore) {
      const currentRouteItem = Object.values(roleMenus)
        .flatMap(menu => menu.items)
        .find(item => item.href === pathname);
      
      if (currentRouteItem) {
        logAuditEvent(firestore, authUser, role, 'navigation', {
          description: `Navegó a la sección: ${currentRouteItem.label} (${pathname})`
        });
      }
      lastPathname.current = pathname;
    }
  }, [pathname, authUser, firestore, role]);

  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard/super-usuario" aria-label="Home" className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
        </Link>
         <div className="flex flex-col text-sm ml-2">
            <span className="font-semibold text-sidebar-foreground">{label}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, hidden: isMobile }}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
         <SidebarGroup>
            <div className="flex items-center gap-3">
                 <Avatar className="size-9">
                    <AvatarImage src={authUser?.photoURL || user.avatar} alt={authUser?.displayName || user.name} />
                    <AvatarFallback>{user.fallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">{authUser?.displayName || user.name}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">{authUser?.email || user.email}</span>
                </div>
            </div>
            <SidebarMenu className="mt-2">
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild size="sm" tooltip={{children: 'Configuración', hidden: isMobile}}>
                        <Link href="#">
                            <Settings />
                            <span>Configuración</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} asChild size="sm" tooltip={{children: 'Cerrar Sesión', hidden: isMobile}}>
                        <button type="button">
                            <LogOut />
                            <span>Cerrar Sesión</span>
                        </button>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
         </SidebarGroup>
      </SidebarFooter>
    </>
  );
}
