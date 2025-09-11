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

const addUserSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  role: z.enum(["System Admin", "Office Admin", "Office Staff", "Customer"]),
  officeId: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  workStart: z.string().optional().nullable(),
  workEnd: z.string().optional().nullable(),
})

type AddUserFormValues = z.infer<typeof addUserSchema>

const allowedPermissions = [
  "Manage Staff",
  "View Reports",
  "Manage Services",
  "Handle Feedback",
  "Create Announcements",
]

const permissionsSchema = z.object({
  permissions: z.array(z.enum(allowedPermissions as [string, ...string[]])).optional().default([]),
})
type PermissionsFormValues = z.infer<typeof permissionsSchema>

interface OfficeOption { id: string; name: string }

const getRoleIcon = (role: string) => {
  switch (role) {
    case "System Admin":
      return <Shield className="w-4 h-4" />
    case "Office Admin":
      return <Building2 className="w-4 h-4" />
    default:
      return <User className="w-4 h-4" />
  }
}

const getRoleBadge = (role: string) => {
  const variants = {
    "System Admin": "bg-red-100 text-red-800",
    "Office Admin": "bg-blue-100 text-blue-800",
    "Office Staff": "bg-green-100 text-green-800",
    Customer: "bg-gray-100 text-gray-800",
  }
  return variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800"
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
  const { toast } = useToast()

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { role: "Office Staff", officeId: null } as any,
  })

  const permForm = useForm<PermissionsFormValues>({
    resolver: zodResolver(permissionsSchema),
    defaultValues: { permissions: [] },
  })

  const officeNameById = useMemo(() => {
    const map = new Map<string, string>()
    offices.forEach((o) => map.set(o.id, o.name))
    return map
  }, [offices])

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
              <Input placeholder="Search users..." className="pl-10 w-64 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
            </div>

            <Select>
              <SelectTrigger className="w-44 bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                <Filter className="w-4 h-4 mr-2 text-gray-600" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="system-admin">System Admin</SelectItem>
                <SelectItem value="office-admin">Office Admin</SelectItem>
                <SelectItem value="office-staff">Office Staff</SelectItem>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(async (values) => {
                  try {
                    const res = await fetch("/api/auth/admin-create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        password: values.password,
                        role: values.role,
                        officeId: values.officeId ?? null,
                        phone: values.phone ?? null,
                        address: values.address ?? null,
                        bio: values.bio ?? null,
                        department: values.department ?? null,
                        position: values.position ?? null,
                        workStart: values.workStart ?? null,
                        workEnd: values.workEnd ?? null,
                      }),
                    })
                    const data = await res.json()
                    if (!res.ok || !data.success) throw new Error(data.message || "Failed")
                    toast({ title: "Success", description: "User created." })
                    setOpen(false)
                    form.reset({ role: "Office Staff", officeId: null } as any)
                    const uRes = await fetch("/api/users")
                    const u = await uRes.json()
                    if (u.success && u.users) setUsers(u.users as any)
                  } catch (e: any) {
                    toast({ title: "Error", description: e.message || "Failed to create user", variant: "destructive" })
                  }
                })}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Full name</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="e.g. Maria Santos" {...form.register("name")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Email</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="e.g. maria@domain.com" type="email" {...form.register("email")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Password</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="Min 6 characters" type="password" {...form.register("password")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Phone (optional)</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="e.g. +63 900 000 0000" {...form.register("phone")} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-gray-900">Address (optional)</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="Street, City, Province" {...form.register("address")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Position (optional)</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="e.g. Office Administrator" {...form.register("position")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Department (optional)</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="e.g. Registrar Office" {...form.register("department")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Work start (optional)</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="08:00" {...form.register("workStart")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Work end (optional)</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="17:00" {...form.register("workEnd")} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-gray-900">Bio (optional)</Label>
                    <Input className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" placeholder="Short description" {...form.register("bio")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Role</Label>
                    <Select onValueChange={(v) => form.setValue("role", v as any)}>
                      <SelectTrigger className="bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="System Admin">System Admin</SelectItem>
                        <SelectItem value="Office Admin">Office Admin</SelectItem>
                        <SelectItem value="Office Staff">Office Staff</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Assign office (optional)</Label>
                    <Select onValueChange={(v) => form.setValue("officeId", v)}>
                      <SelectTrigger className="bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                        <SelectValue placeholder="Choose an office" />
                      </SelectTrigger>
                      <SelectContent>
                        {offices.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-gray-700">Cancel</Button>
                  <Button type="submit" className="gradient-primary text-white disabled:opacity-70" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Adding..." : "Add User"}
                  </Button>
                </div>
                <div className="text-sm text-red-600">
                  {Object.values(form.formState.errors).map((e: any, idx) => (
                    <div key={idx}>{e.message}</div>
                  ))}
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
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(loading ? [] : users).map((user: any) => (
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
                      <Badge className={getRoleBadge(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{(user.officeId && officeNameById.get(user.officeId)) || '-'}</TableCell>
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
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            <span
                              onClick={() => {
                                setPermUser(user)
                                permForm.reset({ permissions: (user.permissions as string[] | undefined) || [] })
                                setPermOpen(true)
                              }}
                            >
                              Manage Permissions
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.isActive ? (
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/users?id=${user.uid || user.id}`, { method: 'DELETE' })
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
                ))}
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
                  const formData = new FormData(e.currentTarget as HTMLFormElement)
                  const payload: Record<string, any> = {
                    name: formData.get('name') || selectedUser.name,
                    role: formData.get('role') || selectedUser.role,
                    phone: formData.get('phone') || selectedUser.phone || null,
                    address: formData.get('address') || selectedUser.address || null,
                    department: formData.get('department') || selectedUser.department || null,
                    position: formData.get('position') || selectedUser.position || null,
                    workStart: formData.get('workStart') || selectedUser.workStart || null,
                    workEnd: formData.get('workEnd') || selectedUser.workEnd || null,
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
                    <Select defaultValue={selectedUser.role} onValueChange={(v) => (document.querySelector<HTMLInputElement>('input[name="roleHidden"]')!.value = v)}>
                      <SelectTrigger className="bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="System Admin">System Admin</SelectItem>
                        <SelectItem value="Office Admin">Office Admin</SelectItem>
                        <SelectItem value="Office Staff">Office Staff</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="role" defaultValue={selectedUser.role} id="roleHidden" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Phone</Label>
                    <Input name="phone" defaultValue={selectedUser.phone || ''} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Address</Label>
                    <Input name="address" defaultValue={selectedUser.address || ''} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Department</Label>
                    <Input name="department" defaultValue={selectedUser.department || ''} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Position</Label>
                    <Input name="position" defaultValue={selectedUser.position || ''} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Work start</Label>
                    <Input name="workStart" defaultValue={selectedUser.workStart || ''} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Work end</Label>
                    <Input name="workEnd" defaultValue={selectedUser.workEnd || ''} className="bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-[#088395]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-900">Assign office</Label>
                    <Select defaultValue={selectedUser.officeId || undefined} onValueChange={(v) => (document.querySelector<HTMLInputElement>('input[name="officeIdHidden"]')!.value = v)}>
                      <SelectTrigger className="bg-white text-gray-900 border border-gray-300 focus:ring-0 focus-visible:ring-[#088395]">
                        <SelectValue placeholder="Choose an office" />
                      </SelectTrigger>
                      <SelectContent>
                        {offices.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="officeId" defaultValue={selectedUser.officeId || ''} id="officeIdHidden" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setEditOpen(false)} className="text-gray-700">Cancel</Button>
                  <Button type="submit" className="gradient-primary text-white">Save</Button>
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
                    const res = await fetch(`/api/users?id=${confirmUser.uid || confirmUser.id}&mode=hard`, { method: 'DELETE' })
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
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
                <div className="space-y-3">
                  {allowedPermissions.map((p) => {
                    const checked = permForm.watch('permissions')?.includes(p)
                    return (
                      <label key={p} className="flex items-center gap-3 text-gray-900">
                        <Checkbox
                          checked={!!checked}
                          onCheckedChange={(val) => {
                            const current = permForm.getValues('permissions') || []
                            if (val) {
                              if (!current.includes(p)) permForm.setValue('permissions', [...current, p])
                            } else {
                              permForm.setValue('permissions', current.filter((x) => x !== p))
                            }
                          }}
                        />
                        <span>{p}</span>
                      </label>
                    )
                  })}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setPermOpen(false)} className="text-gray-700">Cancel</Button>
                  <Button type="submit" className="gradient-primary text-white" disabled={permForm.formState.isSubmitting}>
                    {permForm.formState.isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
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
