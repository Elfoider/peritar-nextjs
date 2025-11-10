'use client';

import { Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const notifications = [
    { id: 1, title: 'Informe Recibido', description: 'El perito subió el informe para el caso SIN-004.', time: 'hace 5 min' },
    { id: 2, title: 'Presupuesto Recibido', description: 'El taller envió el presupuesto para el caso SIN-001.', time: 'hace 2 horas' },
    { id: 3, title: 'Siniestro Cerrado', description: 'El caso SIN-003 ha sido finalizado con éxito.', time: 'hace 1 día' },
];

export function NotificationBell() {
    const unreadCount = notifications.length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notificaciones</span>
                    <Button variant="ghost" size="sm" className="text-xs">Marcar todas como leídas</Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map(notification => (
                     <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-1">
                            <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                     </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="justify-center text-sm text-muted-foreground hover:text-primary">
                    Ver todas las notificaciones
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
