"use client"

import type React from "react"
import { useState } from "react"
import { CustomerSidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CustomerLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function CustomerLayout({ children, title, description }: CustomerLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block",
          sidebarCollapsed ? "lg:w-16" : "lg:w-64",
        )}
      >
        <CustomerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <CustomerSidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} isMobile={true} />
      </div>

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          "lg:pl-64", // Desktop: padding-left for sidebar
          sidebarCollapsed && "lg:pl-16", // Desktop: reduced padding when collapsed
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-border px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button & Title */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-primary truncate">{title}</h1>
                {description && <p className="text-sm text-muted-foreground hidden sm:block">{description}</p>}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search - Hidden on mobile, shown on tablet+ */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 w-48 lg:w-64" />
              </div>

              {/* Search Button for Mobile */}
              <Button variant="ghost" size="sm" className="md:hidden p-2">
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                  1
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
      </div>

      <div className="lg:hidden">
        <CustomerSidebar collapsed={false} onToggle={() => {}} isBottomNav={true} />
      </div>
    </div>
  )
}
