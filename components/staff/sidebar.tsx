"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  User,
  UserPlus,
  X,
} from "lucide-react"

const navigation = [
  { name: "Queue Dashboard", href: "/staff", icon: LayoutDashboard },
  { name: "Walk-in Registration", href: "/staff/walk-in", icon: UserPlus },
  { name: "Customer Feedback", href: "/staff/feedback", icon: MessageSquare },
  { name: "Profile", href: "/staff/profile", icon: User },
]

const mobileNavigation = [
  { name: "Queue", href: "/staff", icon: LayoutDashboard },
  { name: "Walk-in", href: "/staff/walk-in", icon: UserPlus },
  { name: "Feedback", href: "/staff/feedback", icon: MessageSquare },
  { name: "Profile", href: "/staff/profile", icon: User },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobile?: boolean
  isBottomNav?: boolean
}

export function StaffSidebar({ collapsed, onToggle, isMobile = false, isBottomNav = false }: SidebarProps) {
  const pathname = usePathname()

  if (isBottomNav) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
        <nav className="flex justify-around items-center py-2 px-2">
          {mobileNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-w-0 flex-1",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-border flex flex-col transition-all duration-300 h-full",
        !isMobile && "relative",
        !isMobile && (collapsed ? "w-16" : "w-64"),
        isMobile && "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="E-Queue Logo" width={32} height={32} className="rounded-full" />
              <div>
                <h2 className="font-semibold text-primary">Staff Portal</h2>
                <p className="text-xs text-muted-foreground">Registrar Office</p>
              </div>
            </div>
          )}
          {collapsed && !isMobile && (
            <Image src="/images/logo.png" alt="E-Queue Logo" width={32} height={32} className="rounded-full mx-auto" />
          )}

          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onToggle} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    isMobile && "py-4",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  onClick={isMobile ? onToggle : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {(!collapsed || isMobile) && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Ana Rodriguez</p>
              <p className="text-xs text-muted-foreground truncate">Staff Member</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            isMobile && "py-3",
            collapsed && !isMobile && "justify-center",
          )}
        >
          <LogOut className="w-4 h-4" />
          {(!collapsed || isMobile) && <span className="ml-2">Logout</span>}
        </Button>
      </div>

      {!isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border bg-white shadow-md hover:bg-muted z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      )}
    </div>
  )
}