'use client';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardNav } from "./dashboard-nav";
import { DashboardHeader } from "./dashboard-header";
import { FirebaseClientProvider, useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


function DashboardCore({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  
  const superUsuariosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'super_usuarios');
  }, [firestore]);

  const { data: superUsuarios, isLoading: isSuperUsuariosLoading } = useCollection(superUsuariosQuery);


  useEffect(() => {
    // Wait until all loading is finished
    if (isUserLoading || isSuperUsuariosLoading) {
      return;
    }

    // If there is no user, redirect to login page.
    if (!user) {
      router.push('/login');
      return;
    }

    // After loading, if there is a user but no super_usuarios documents exist,
    // redirect to the setup page.
    if (user && superUsuarios && superUsuarios.length === 0) {
        router.push('/setup');
    }

  }, [user, isUserLoading, router, superUsuarios, isSuperUsuariosLoading]);

  // This loading state will cover both auth and the initial super user check
  if (isUserLoading || isSuperUsuariosLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }
  
  // If no user, useEffect will redirect. Show a message in the meantime.
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Redirigiendo al login...</p>
      </div>
    );
  }
  
  // If we are still loading super-user data, or if we need to redirect to setup, show a loading state.
  if (!superUsuarios) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Verificando configuración...</p>
        </div>
    );
  }

  // If there's a user but no super_usuarios, we should be redirecting to /setup
  if(superUsuarios.length === 0) {
     return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Redirigiendo a configuración inicial...</p>
        </div>
    );
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <DashboardNav />
        </Sidebar>
        <div className="flex flex-1 flex-col">
           <DashboardHeader />
           <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <DashboardCore>{children}</DashboardCore>
    </FirebaseClientProvider>
  );
}
