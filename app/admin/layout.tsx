"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, BarChart3, Settings, Search, Bell, Menu, X, LayoutDashboard } from "lucide-react"
import { Suspense } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Office Management", href: "/admin/offices", icon: Building2 },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-[#071952] transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-[#088395]/20">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="E-Queue" className="w-8 h-8" />
                <span className="text-xl font-bold text-white">E-Queue</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-[#088395]/20 p-2"
            >
              {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#088395] text-white shadow-sm"
                      : "text-gray-300 hover:bg-[#088395]/20 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-[#088395]/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#37B7C3] rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">SA</span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">System Admin</p>
                  <p className="text-xs text-gray-300 truncate">admin@omsc.edu.ph</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Header */}
      <Suspense fallback={null}>
        <div
          className={`fixed top-0 right-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 ${
            collapsed ? "left-16" : "left-64"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200 focus:bg-white" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </Suspense>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"} pt-16`}>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
