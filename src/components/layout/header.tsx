"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogIn, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";
import { useAuth, useUser, useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Quiénes Somos" },
  { href: "/services", label: "Servicios" },
  { href: "/contact", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/');
  }

  const handleAuthClick = () => {
    setIsChecking(true);
    if (!firestore) {
      console.error("Firestore not available");
      setIsChecking(false);
      return;
    }
    const superUsuariosCollection = collection(firestore, 'super_usuarios');
    
    getDocs(superUsuariosCollection)
      .then(snapshot => {
        if (snapshot.empty) {
          router.push('/setup');
        } else {
          router.push('/login');
        }
      })
      .catch(error => {
        // Create the rich, contextual error.
        const permissionError = new FirestorePermissionError({
          path: superUsuariosCollection.path,
          operation: 'list',
        });
        
        // Emit the error for the global listener to catch and display.
        errorEmitter.emit('permission-error', permissionError);
        
        // As a fallback, we can still redirect to login, 
        // but the error overlay will be the primary feedback.
        router.push('/login');
      })
      .finally(() => {
        setIsChecking(false);
      });
  };


  const NavLink = ({ href, label, isMobile = false }: { href: string; label: string; isMobile?: boolean }) => {
    const isActive = pathname === href;
    return (
        <Link
          href={href}
          className={cn(
            "font-medium transition-colors hover:text-primary",
             isMobile ? "text-lg" : "text-sm",
             isActive ? "text-primary" : isMobile ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            {user && (
              <NavLink href="/dashboard" label="Dashboard" />
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="mb-8 flex items-center">
                <Logo className="h-10 w-auto" />
              </Link>
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                   <SheetClose asChild key={link.href}>
                     <NavLink {...link} isMobile />
                   </SheetClose>
                ))}
                 {user && (
                    <SheetClose asChild>
                      <NavLink href="/dashboard" label="Dashboard" isMobile />
                    </SheetClose>
                  )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
           <ThemeToggle />
          {!isUserLoading && (
            user ? (
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
              </Button>
            ) : (
              <Button onClick={handleAuthClick} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isChecking}>
                {isChecking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Autenticarse
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
