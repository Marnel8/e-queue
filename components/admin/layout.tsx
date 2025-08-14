"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      <header
        className={`fixed top-0 right-0 bg-white border-b border-border px-6 py-4 z-20 transition-all duration-300 ${
          sidebarCollapsed ? "left-16" : "left-64"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-64" />
            </div>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      <main
        className={`transition-all duration-300 pt-20 pb-6 px-6 min-h-screen overflow-y-auto ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  )
}

// Also export as default for compatibility
export default AdminLayout
