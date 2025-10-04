"use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Shield, User, Building2 } from "lucide-react"
import { UserData } from "@/app/actions/auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"

const addUserSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  role: z.enum(["system-admin", "office-admin", "staff", "customer"]),
  officeId: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
}).refine((data) => {
  // Office assignment is required for office-admin and staff roles
  if ((data.role === "office-admin" || data.role === "staff") && !data.officeId) {
    return false
  }
  return true
}, {
  message: "Office assignment is required for this role",
  path: ["officeId"]
})

type AddUserFormValues = z.infer<typeof addUserSchema>

// Role-based permission definitions
const rolePermissions = {
  "system-admin": [
    "Manage Users",
    "Manage Offices", 
    "View System Reports",
    "Manage System Settings",
    "Manage Violations",
    "Full System Access"
  ],
  "office-admin": [
    "Manage Staff",
    "Manage Services", 
    "Manage Queue Lanes",
    "View Office Reports",
    "Handle Feedback",
    "Create Announcements",
    "Manage Logbook",
    "Manage Evaluations",
    "Manage Violations"
  ],
  "staff": [
    "Manage Queue",
    "Register Walk-ins",
    "View Archives",
    "Basic Operations"
  ],
  "customer": [
    "View Queue",
    "Book Tickets", 
    "Manage Tickets",
    "Submit Feedback",
    "View Violations"
  ]
}

// Get permissions for a specific role
const getPermissionsForRole = (role: string) => {
  return rolePermissions[role as keyof typeof rolePermissions] || []
}

// Check if a role can have custom permissions
const canCustomizePermissions = (role: string) => {
  return role === "system-admin" || role === "office-admin" || role === "staff"
}

const permissionsSchema = z.object({
  permissions: z.array(z.string()).optional().default([]),
})
type PermissionsFormValues = z.infer<typeof permissionsSchema>

interface OfficeOption { id: string; name: string }

const getRoleIcon = (role: string) => {
  switch (role) {
    case "system-admin":
      return <Shield className="w-4 h-4" />
    case "office-admin":
      return <Building2 className="w-4 h-4" />
    default:
      return <User className="w-4 h-4" />
  }
}

const getRoleBadge = (role: string) => {
  const variants = {
    "system-admin": "bg-red-100 text-red-800",
    "office-admin": "bg-blue-100 text-blue-800",
    "staff": "bg-green-100 text-green-800",
    "customer": "bg-gray-100 text-gray-800",
  }
  return variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

const getRoleDisplayName = (role: string) => {
  const displayNames = {
    "system-admin": "System Admin",
    "office-admin": "Office Admin", 
    "staff": "Office Staff",
    "customer": "Customer",
  }
  return displayNames[role as keyof typeof displayNames] || role
}

const getPermissionCount = (user: any) => {
  if (user.role === "customer") {
    return getPermissionsForRole("customer").length
  }
  const customPermissions = user.permissions && Array.isArray(user.permissions) ? user.permissions.length : 0
  const rolePermissions = getPermissionsForRole(user.role).length
  return customPermissions > 0 ? customPermissions : rolePermissions
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [permOpen, setPermOpen] = useState(false)
  const [permUser, setPermUser] = useState<any | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmUser, setConfirmUser] = useState<any | null>(null)
  const [offices, setOffices] = useState<OfficeOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { role: "staff", officeId: null } as any,
  })

  const selectedRole = form.watch("role")

  const permForm = useForm<PermissionsFormValues>({
    resolver: zodResolver(permissionsSchema),
    defaultValues: { permissions: [] },
  })

  // Clear officeId when system-admin or customer is selected
  useEffect(() => {
    if (selectedRole === "system-admin" || selectedRole === "customer") {
      form.setValue("officeId", null)
    }
  }, [selectedRole, form])

  const officeNameById = useMemo(() => {
    const map = new Map<string, string>()
    offices.forEach((o) => map.set(o.id, o.name))
    return map
  }, [offices])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((user as any).phone && (user as any).phone.includes(searchQuery))
      
      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const formatLastLogin = (value?: string | null) => {
    if (!value) return "-"
    const date = new Date(value)
    if (isNaN(date.getTime())) return "-"
    return formatDistanceToNow(date, { addSuffix: true })
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [uRes, oRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/offices"),
        ])
        const u = await uRes.json()
        const o = await oRes.json()
        if (u?.success && u.users) setUsers(u.users as any)
        if (o?.success && o.offices) setOffices(o.offices.map((x: any) => ({ id: x.id, name: x.name })))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">Manage system users and their permissions</p>
      </div>

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Search users..." 
                className="pl-10 w-64 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-44 bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                <Filter className="w-4 h-4 mr-2 text-gray-600" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="system-admin">System Admin</SelectItem>
                <SelectItem value="office-admin">Office Admin</SelectItem>
                <SelectItem value="staff">Office Staff</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(async (values) => {
                  try {
                    // Clear officeId for system-admin and customer roles
                    const payload = {
                      name: values.name,
                      email: values.email,
                      password: values.password,
                      role: values.role,
                      officeId: (values.role === "system-admin" || values.role === "customer") ? null : values.officeId ?? null,
                      phone: values.phone ?? null,
                    }
                    
                    const res = await fetch("/api/auth/admin-create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    })
                    const data = await res.json()
                    if (!res.ok || !data.success) throw new Error(data.message || "Failed")
                    toast({ title: "Success", description: "User created." })
                    setOpen(false)
                    form.reset({ role: "staff", officeId: null } as any)
                    const uRes = await fetch("/api/users")
                    const u = await uRes.json()
                    if (u.success && u.users) setUsers(u.users as any)
                  } catch (e: any) {
                    toast({ title: "Error", description: e.message || "Failed to create user", variant: "destructive" })
                  }
                })}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5 w-full">
                    <Label className="text-gray-900 text-sm">Full name</Label>
                    <Input className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="e.g. Maria Santos" {...form.register("name")} />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <Label className="text-gray-900 text-sm">Email</Label>
                    <Input className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="e.g. maria@domain.com" type="email" {...form.register("email")} />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <Label className="text-gray-900 text-sm">Password</Label>
                    <Input className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="Min 6 characters" type="password" {...form.register("password")} />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <Label className="text-gray-900 text-sm">Phone (optional)</Label>
                    <Input 
                      className="w-full bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" 
                      placeholder="e.g. +63 900 000 0000" 
                      {...form.register("phone")} 
                    />
                    <p className="text-xs text-gray-500 break-words">Phone number is optional for all roles</p>
                  </div>
                  <div className="space-y-1.5 w-full">
                    <Label className="text-gray-900 text-sm">Role</Label>
                    <Select 
                      value={selectedRole} 
                      onValueChange={(v) => form.setValue("role", v as any)}
                    >
                      <SelectTrigger className="w-full bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system-admin">System Admin</SelectItem>
                        <SelectItem value="office-admin">Office Admin</SelectItem>
                        <SelectItem value="staff">Office Staff</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 w-full">
                    <Label className={`text-gray-900 text-sm ${(selectedRole === "system-admin" || selectedRole === "customer") ? "text-gray-500" : ""}`}>
                      Assign office {selectedRole === "customer" ? "(not applicable)" : selectedRole === "system-admin" ? "(not applicable)" : "(required)"}
                    </Label>
                    <Select 
                      value={selectedRole === "system-admin" || selectedRole === "customer" ? "" : form.watch("officeId") || ""}
                      onValueChange={(v) => form.setValue("officeId", v)} 
                      disabled={selectedRole === "system-admin" || selectedRole === "customer"}
                    >
                      <SelectTrigger className={`w-full border-gray-300 focus:ring-0 focus-visible:ring-[#088395] ${
                        (selectedRole === "system-admin" || selectedRole === "customer") 
                          ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60" 
                          : "bg-white text-gray-900"
                      }`}>
                        <SelectValue placeholder={
                          selectedRole === "system-admin" ? "Not applicable for system admin" : 
                          selectedRole === "customer" ? "Not applicable for customers" : 
                          "Choose an office"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {offices.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedRole === "system-admin" && (
                      <p className="text-xs text-gray-500 break-words">System admins have access to all offices</p>
                    )}
                    {selectedRole === "customer" && (
                      <p className="text-xs text-gray-500 break-words">Customers don't need office assignment</p>
                    )}
                    {selectedRole !== "system-admin" && selectedRole !== "customer" && (
                      <p className="text-xs text-gray-500 break-words">Office assignment is required for this role</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-gray-700">Cancel</Button>
                  <Button type="submit" className="gradient-primary text-white disabled:opacity-70" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Adding..." : "Add User"}
                  </Button>
                </div>
                <div className="text-sm text-red-600">
                  {form.formState.errors.name && (
                    <div>Name: {form.formState.errors.name.message}</div>
                  )}
                  {form.formState.errors.email && (
                    <div>Email: {form.formState.errors.email.message}</div>
                  )}
                  {form.formState.errors.password && (
                    <div>Password: {form.formState.errors.password.message}</div>
                  )}
                  {form.formState.errors.officeId && (
                    <div>Office: {form.formState.errors.officeId.message}</div>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Office</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">Loading users...</div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchQuery || roleFilter !== "all" 
                          ? "No users found matching your search criteria" 
                          : "No users found"
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: any) => (
                    <TableRow key={user.uid || user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadge(user.role)}>{getRoleDisplayName(user.role)}</Badge>
                      </TableCell>
                      <TableCell>{user.officeId ? (officeNameById.get(user.officeId) || '-') : '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{getPermissionCount(user)}</span>
                          <span className="text-xs text-gray-500">permissions</span>
                          {canCustomizePermissions(user.role) && user.permissions && Array.isArray(user.permissions) && user.permissions.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatLastLogin(user.lastLoginAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span
                                onClick={() => {
                                  setSelectedUser(user)
                                  setEditOpen(true)
                                }}
                              >
                                Edit User
                              </span>
                            </DropdownMenuItem>
                            {canCustomizePermissions(user.role) && (
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                <span
                                  onClick={() => {
                                    setPermUser(user)
                                    // Initialize with role-based permissions or existing custom permissions
                                    const roleBasedPermissions = getPermissionsForRole(user.role)
                                    const existingPermissions = (user.permissions as string[] | undefined) || []
                                    // If user has custom permissions, use them; otherwise use role defaults
                                    const initialPermissions = existingPermissions.length > 0 ? existingPermissions : roleBasedPermissions
                                    permForm.reset({ permissions: initialPermissions })
                                    setPermOpen(true)
                                  }}
                                >
                                  Manage Permissions
                                </span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {user.isActive ? (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span
                                  onClick={async () => {
                                    try {
                                      const adminUserId = user?.uid || ''
                                      const res = await fetch(`/api/users?id=${user.uid || user.id}&mode=deactivate&adminUserId=${adminUserId}`, { method: 'DELETE' })
                                      const data = await res.json()
                                      if (!res.ok || !data.success) throw new Error(data.message || 'Failed')
                                      toast({ title: 'Success', description: 'User deactivated.' })
                                      const uRes = await fetch('/api/users')
                                      const u = await uRes.json()
                                      if (u.success && u.users) setUsers(u.users as any)
                                    } catch (e: any) {
                                      toast({ title: 'Error', description: e.message || 'Failed to deactivate user', variant: 'destructive' })
                                    }
                                  }}
                                >
                                  Deactivate User
                                </span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                <span
                                  onClick={async () => {
                                    try {
                                      const res = await fetch('/api/users', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ uid: user.uid || user.id, updates: { isActive: true } }),
                                      })
                                      const data = await res.json()
                                      if (!res.ok || !data.success) throw new Error(data.message || 'Failed')
                                      toast({ title: 'Success', description: 'User reactivated.' })
                                      const uRes = await fetch('/api/users')
                                      const u = await uRes.json()
                                      if (u.success && u.users) setUsers(u.users as any)
                                    } catch (e: any) {
                                      toast({ title: 'Error', description: e.message || 'Failed to reactivate user', variant: 'destructive' })
                                    }
                                  }}
                                >
                                  Reactivate User
                                </span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-700">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span onClick={() => { setConfirmUser(user); setConfirmOpen(true) }}>Delete Permanently</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSaving(true)
                  const formData = new FormData(e.currentTarget as HTMLFormElement)
                  const payload: Record<string, any> = {
                    name: formData.get('name') || selectedUser.name,
                    role: formData.get('role') || selectedUser.role,
                    phone: formData.get('phone') || selectedUser.phone || null,
                    officeId: formData.get('officeId') || selectedUser.officeId || null,
                  }
                  try {
                    const res = await fetch('/api/users', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ uid: selectedUser.uid || selectedUser.id, updates: payload }),
                    })
                    const data = await res.json()
                    if (!res.ok || !data.success) throw new Error(data.message || 'Failed')
                    toast({ title: 'Success', description: 'User updated.' })
                    setEditOpen(false)
                    const uRes = await fetch('/api/users')
                    const u = await uRes.json()
                    if (u.success && u.users) setUsers(u.users as any)
                  } catch (e: any) {
                    toast({ title: 'Error', description: e.message || 'Failed to update user', variant: 'destructive' })
                  } finally {
                    setIsSaving(false)
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Full name</Label>
                    <Input name="name" defaultValue={selectedUser.name} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Role</Label>
                    <Select 
                      defaultValue={selectedUser.role} 
                      onValueChange={(v) => {
                        const hiddenInput = document.querySelector<HTMLInputElement>('input[name="role"]')
                        if (hiddenInput) hiddenInput.value = v
                      }}
                    >
                      <SelectTrigger className="bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                        <SelectValue />
                      </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system-admin">System Admin</SelectItem>
                          <SelectItem value="Office Admin">Office Admin</SelectItem>
                          <SelectItem value="staff">Office Staff</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                    </Select>
                    <input type="hidden" name="role" defaultValue={selectedUser.role} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Phone</Label>
                    <Input name="phone" defaultValue={selectedUser.phone || ''} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Assign office</Label>
                    <Select 
                      defaultValue={selectedUser.officeId || undefined} 
                      onValueChange={(v) => {
                        const hiddenInput = document.querySelector<HTMLInputElement>('input[name="officeId"]')
                        if (hiddenInput) hiddenInput.value = v
                      }}
                    >
                      <SelectTrigger className="bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                        <SelectValue placeholder="Choose an office" />
                      </SelectTrigger>
                      <SelectContent>
                        {offices.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="officeId" defaultValue={selectedUser.officeId || ''} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} className="text-gray-700" disabled={isSaving}>Cancel</Button>
                  <Button type="submit" className="gradient-primary text-white disabled:opacity-70" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Hard Delete */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete user permanently?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the user document. It will not remove the Firebase Auth credential.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={async () => {
                  if (!confirmUser) return
                  try {
                    const adminUserId = user?.uid || ''
                    const res = await fetch(`/api/users?id=${confirmUser.uid || confirmUser.id}&mode=hard&adminUserId=${adminUserId}`, { method: 'DELETE' })
                    const data = await res.json()
                    if (!res.ok || !data.success) throw new Error(data.message || 'Failed')
                    toast({ title: 'Success', description: 'User deleted permanently.' })
                    setConfirmOpen(false)
                    const uRes = await fetch('/api/users')
                    const u = await uRes.json()
                    if (u.success && u.users) setUsers(u.users as any)
                  } catch (e: any) {
                    toast({ title: 'Error', description: e.message || 'Failed to delete user', variant: 'destructive' })
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* Manage Permissions Dialog */}
        <Dialog open={permOpen} onOpenChange={setPermOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
              <p className="text-sm text-gray-600">
                {permUser && (
                  <>
                    Managing permissions for <strong>{permUser.name}</strong> ({getRoleDisplayName(permUser.role)})
                    {permUser.role === "customer" && (
                      <span className="block mt-1 text-amber-600">
                        ⚠️ Customers have fixed permissions that cannot be modified
                      </span>
                    )}
                  </>
                )}
              </p>
            </DialogHeader>
            {permUser && (
              <form
                className="space-y-4"
                onSubmit={permForm.handleSubmit(async (values) => {
                  try {
                    const res = await fetch('/api/users', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ uid: permUser.uid || permUser.id, updates: { permissions: values.permissions } }),
                    })
                    const data = await res.json()
                    if (!res.ok || !data.success) throw new Error(data.message || 'Failed')
                    toast({ title: 'Success', description: 'Permissions updated.' })
                    setPermOpen(false)
                    const uRes = await fetch('/api/users')
                    const u = await uRes.json()
                    if (u.success && u.users) setUsers(u.users as any)
                  } catch (e: any) {
                    toast({ title: 'Error', description: e.message || 'Failed to update permissions', variant: 'destructive' })
                  }
                })}
              >
                {permUser.role === "customer" ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Customer Fixed Permissions</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Customers have predefined permissions that cannot be modified:
                      </p>
                      <div className="space-y-2">
                        {getPermissionsForRole("customer").map((permission) => (
                          <div key={permission} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">Role: {getRoleDisplayName(permUser.role)}</h4>
                      <p className="text-sm text-blue-700">
                        Select the permissions for this user. You can customize from the default role permissions.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {getPermissionsForRole(permUser.role).map((permission) => {
                        const checked = permForm.watch('permissions')?.includes(permission)
                        return (
                          <label key={permission} className="flex items-center gap-3 text-gray-900 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              checked={!!checked}
                              onCheckedChange={(val) => {
                                const current = permForm.getValues('permissions') || []
                                if (val) {
                                  if (!current.includes(permission)) permForm.setValue('permissions', [...current, permission])
                                } else {
                                  permForm.setValue('permissions', current.filter((x) => x !== permission))
                                }
                              }}
                            />
                            <span className="flex-1">{permission}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={() => setPermOpen(false)} className="text-gray-700">
                    Cancel
                  </Button>
                  {permUser.role !== "customer" && (
                    <Button type="submit" className="gradient-primary text-white" disabled={permForm.formState.isSubmitting}>
                      {permForm.formState.isSubmitting ? 'Saving...' : 'Save Permissions'}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
        {/* User Statistics */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Users active today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Office staff & admins</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}
