"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "./notification-bell"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        {/* Can add breadcrumbs or title here */}
      </div>
      <div className="flex flex-1 justify-end items-center gap-2 md:gap-4">
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar siniestros, clientes..."
              className="w-full appearance-none bg-card pl-8 shadow-none md:w-full lg:w-96"
            />
          </div>
        </form>
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  )
}
