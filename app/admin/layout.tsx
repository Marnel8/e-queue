"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Users, Building2, BarChart3, Settings, Search, Bell, Menu, X, LayoutDashboard, LogOut, Shield, User, Megaphone, Clock, ArrowRight, Check, Trash2, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Suspense } from "react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Office Management", href: "/admin/offices", icon: Building2 },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
  { name: "My Profile", href: "/admin/profile", icon: Shield },
]

interface SearchResult {
  id: string
  type: string
  title: string
  subtitle: string
  description: string
  href: string
  icon: string
  data: any
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  isArchived: boolean
  userId?: string
  officeId?: string
  createdAt: string
  updatedAt: string
}

function AdminContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { user, userData, signOut, loading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true)
      router.push("/login")
    }
  }, [user, loading, router])

  // Search functionality
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
        const data = await response.json()
        
        if (data.success) {
          setSearchResults(data.results)
          setShowSearchResults(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(search, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
      if (event.key === "Escape") {
        setShowSearchResults(false)
        setShowNotifications(false)
        setSearchQuery("")
        inputRef.current?.blur()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return
      
      setIsLoadingNotifications(true)
      try {
        const response = await fetch("/api/admin/notifications?limit=20")
        const data = await response.json()
        
        if (data.success) {
          setNotifications(data.notifications)
          setUnreadCount(data.notifications.filter((n: Notification) => !n.isRead).length)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      } finally {
        setIsLoadingNotifications(false)
      }
    }

    loadNotifications()
  }, [user])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setShowSignOutDialog(false)
    await signOut()
  }

  const handleSearchResultClick = (result: SearchResult) => {
    setShowSearchResults(false)
    setSearchQuery("")
    router.push(result.href)
  }

  const getSearchIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-4 h-4" />
      case "office":
        return <Building2 className="w-4 h-4" />
      case "announcement":
        return <Megaphone className="w-4 h-4" />
      case "violation":
        return <Shield className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "system":
        return <Settings className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      await Promise.all(
        unreadNotifications.map(n => 
          fetch(`/api/admin/notifications/${n.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true })
          })
        )
      )

      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        setUnreadCount(prev => {
          const deletedNotification = notifications.find(n => n.id === notificationId)
          return deletedNotification && !deletedNotification.isRead ? prev - 1 : prev
        })
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Show loading state while checking authentication
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (redirecting)
  if (!user) {
    return null
  }

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
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#37B7C3] rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-300 truncate">
                    {userData?.email || user?.email || "No email"}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#088395]/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out? You will need to log in again to access the admin panel.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {collapsed && (
              <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-gray-300 hover:text-white hover:bg-[#088395]/20 p-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out? You will need to log in again to access the admin panel.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
              <div className="relative max-w-md" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Search users, offices, violations... (Ctrl+K)" 
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 mb-2 px-2">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                      </div>
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSearchResultClick(result)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-primary">
                              {getSearchIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {result.title}
                              </div>
                              <div className="text-sm text-gray-600 truncate">
                                {result.subtitle}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {result.description}
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-gray-400 group-hover:text-primary">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No Results */}
                {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No results found for "{searchQuery}"</p>
                      <p className="text-sm">Try searching for users, offices, or announcements</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" ref={notificationRef}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Mark all as read
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {isLoadingNotifications ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                          Loading notifications...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              !notification.isRead ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                      {notification.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(notification.priority)}`}>
                                        {notification.priority}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatTimeAgo(notification.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {!notification.isRead && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="h-6 w-6 p-0 text-gray-400 hover:text-green-600"
                                      >
                                        <Check className="w-3 h-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteNotification(notification.id)}
                                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => {
                            setShowNotifications(false)
                            // Navigate to full notifications page if needed
                          }}
                        >
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  )
}
