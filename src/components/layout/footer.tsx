import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <Logo className="h-10 w-auto" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} PERITAR. Todos los derechos reservados.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-primary">Quiénes Somos</Link>
          <Link href="/services" className="hover:text-primary">Servicios</Link>
          <Link href="/contact" className="hover:text-primary">Contacto</Link>
          <Link href="#" className="hover:text-primary">Términos y Condiciones</Link>
        </nav>
      </div>
    </footer>
  );
}
