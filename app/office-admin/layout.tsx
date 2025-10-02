"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OfficeAdminSidebar } from "@/components/office-admin/sidebar"
import { Menu, Search, Bell } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"

function OfficeAdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchParams = useSearchParams()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Suspense fallback={<div>Loading...</div>}>
          <OfficeAdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </Suspense>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white">
            <Suspense fallback={<div>Loading...</div>}>
              <OfficeAdminSidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} mobile />
            </Suspense>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`fixed top-0 right-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? "lg:left-16" : "lg:left-64"
        } left-0`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-4 h-4 text-gray-700" />
            </Button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} ml-0`}>
        <div className="p-6">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </div>
      </main>
    </div>
  )
}

export default function OfficeAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <OfficeAdminLayoutContent>{children}</OfficeAdminLayoutContent>
      </Suspense>
    </AuthProvider>
  )
}
