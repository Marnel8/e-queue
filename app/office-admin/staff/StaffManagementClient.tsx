"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";

type StaffStatus = "Online" | "Break" | "Offline";

type Staff = {
  id: string;
  name: string;
  email: string;
  position: string;
  status: StaffStatus;
  shift?: string;
  queuesHandled?: number;
  avgServiceTime?: string;
  lastActive?: string;
  assignedLane?: string | null;
  assignedDesk?: string | null;
  deskId?: number | null;
  office: string;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    Online: "bg-green-100 text-green-800",
    Break: "bg-yellow-100 text-yellow-800",
    Offline: "bg-gray-100 text-gray-800",
  };
  return variants[status] || "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Online":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "Break":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    default:
      return <User className="w-4 h-4 text-gray-600" />;
  }
};

const AddStaffSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  position: z.string().min(2, "Position is required"),
  status: z.enum(["Online", "Break", "Offline"]),
  shift: z.string().optional(),
  assignedLane: z.string().optional(),
});
type AddStaffForm = z.infer<typeof AddStaffSchema>;

const EditStaffSchema = z.object({
  name: z.string().min(2, "Name is required"),
  position: z.string().min(2, "Position is required"),
  status: z.enum(["Online", "Break", "Offline"]),
  shift: z.string().optional(),
  assignedLane: z.string().optional(),
});
type EditStaffForm = z.infer<typeof EditStaffSchema>;

export default function StaffManagementClient() {
  const { toast } = useToast();
  const { userData } = useAuth();

  const [resolvedOffice, setResolvedOffice] = useState<string>("Registrar Office");
  useEffect(() => {
    const candidateOrder = [(userData as any)?.officeName, (userData as any)?.office];
    const next = candidateOrder.find((c) => typeof c === "string" && c.trim() !== "");
    if (typeof next === "string" && next.trim() !== "" && next !== resolvedOffice) {
      setResolvedOffice(next);
    }
  }, [userData, resolvedOffice]);

  const [staff, setStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableLanes, setAvailableLanes] = useState<{ id: string; name: string }[]>([]);

  const shiftOptions = [
    "Morning (8:00 AM - 4:00 PM)",
    "Afternoon (12:00 PM - 8:00 PM)",
    "Evening (4:00 PM - 12:00 AM)",
    "Night (12:00 AM - 8:00 AM)",
  ];

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    if (!t) return staff;
    return staff.filter((s) =>
      s.name.toLowerCase().includes(t) || s.email.toLowerCase().includes(t)
    );
  }, [staff, search]);

  const addForm = useForm<AddStaffForm>({
    resolver: zodResolver(AddStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      status: "Online",
      shift: "",
      assignedLane: "",
    },
  });

  const editForm = useForm<EditStaffForm>({
    resolver: zodResolver(EditStaffSchema),
    defaultValues: {
      name: "",
      position: "",
      status: "Online",
      shift: "",
      assignedLane: "",
    },
  });

  const loadStaff = async () => {
    const office = resolvedOffice;
    if (!office || typeof office !== "string" || office.trim() === "") return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/office-admin/staff?office=${encodeURIComponent(office)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (json?.success && Array.isArray(json.staff)) {
        setStaff(
          json.staff.map((s: any) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            position: s.position,
            status: s.status as StaffStatus,
            shift: s.shift ?? "",
            queuesHandled: typeof s.queuesHandled === "number" ? s.queuesHandled : 0,
            avgServiceTime: s.avgServiceTime ?? "N/A",
            lastActive: s.lastActive ?? "",
            assignedLane: s.assignedLane ?? null,
            assignedDesk: s.assignedDesk ?? null,
            deskId: typeof s.deskId === "number" ? s.deskId : null,
            office: s.office ?? office,
          }))
        );
      } else {
        setStaff([]);
      }
    } catch (_e) {
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLanes = async () => {
    const office = resolvedOffice;
    if (!office || typeof office !== "string" || office.trim() === "") return;
    try {
      const res = await fetch(`/api/office-admin/lanes?office=${encodeURIComponent(office)}`, { cache: "no-store" });
      const json = await res.json();
      if (json?.success && Array.isArray(json.lanes)) {
        setAvailableLanes(json.lanes.map((l: any) => ({ id: l.id, name: l.name })));
      }
    } catch (_e) {
      // ignore
    }
  };

  useEffect(() => {
    loadStaff();
    loadLanes();
  }, [resolvedOffice]);

  const onAdd = async (values: AddStaffForm) => {
    setIsSaving(true);
    try {
      const payload = {
        ...values,
        assignedLane: addForm.getValues("assignedLane") || null,
        office: resolvedOffice,
      };
      const res = await fetch("/api/office-admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json?.success) {
        toast({ title: "Staff created", description: "New staff saved successfully." });
        setShowAddModal(false);
        addForm.reset();
        await loadStaff();
      } else {
        toast({
          title: "Failed to save",
          description: json?.message ?? "Please try again.",
          variant: "destructive",
        });
      }
    } catch (_e) {
      toast({ title: "Failed to save", description: "Network error.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (s: Staff) => {
    setEditingStaff(s);
    editForm.reset({
      name: s.name,
      position: s.position,
      status: s.status,
      shift: s.shift ?? "",
      assignedLane: isValidLaneName(s.assignedLane) ? (s.assignedLane as string) : "",
    });
    setShowEditModal(true);
  };

  const submitEdit = async (values: EditStaffForm) => {
    if (!editingStaff) return;
    setIsUpdating(true);
    try {
      const payload = {
        name: values.name,
        position: values.position,
        status: values.status,
        shift: values.shift ?? "",
        assignedLane: values.assignedLane ?? "",
      };
      const res = await fetch(`/api/office-admin/staff/${editingStaff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json?.success) {
        toast({ title: "Staff updated", description: "Changes saved successfully." });
        setShowEditModal(false);
        setEditingStaff(null);
        await loadStaff();
      } else {
        toast({ title: "Update failed", description: json?.message ?? "Please try again.", variant: "destructive" });
      }
    } catch (_e) {
      toast({ title: "Update failed", description: "Network error.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    try {
      const res = await fetch(`/api/office-admin/staff/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json?.success) {
        toast({ title: "Removed", description: "Staff deleted." });
        await loadStaff();
      } else {
        toast({ title: "Delete failed", description: json?.message ?? "Please try again.", variant: "destructive" });
      }
    } catch (_e) {
      toast({ title: "Delete failed", description: "Network error.", variant: "destructive" });
    }
  };

  const totalStaff = staff.length;
  const onlineCount = staff.filter((s) => s.status === "Online").length;
  const onBreakCount = staff.filter((s) => s.status === "Break").length;
  const avgService = useMemo(() => {
    const toMin = (v?: string) => {
      if (!v) return NaN;
      const m = (v + "").match(/(\d+(?:\.\d+)?)/);
      return m ? parseFloat(m[1]) : NaN;
    };
    const mins = staff
      .map((s) => toMin(s.avgServiceTime))
      .filter((n) => !isNaN(n));
    if (mins.length === 0) return "N/A";
    const avg = mins.reduce((a, b) => a + b, 0) / mins.length;
    return `${avg.toFixed(1)}m`;
  }, [staff]);

  const isValidLaneName = (value: string | null | undefined) => {
    if (!value) return false;
    return availableLanes.some((l) => l.name === value);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071952]">Staff Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your office staff and their schedules</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search staff members..."
            className="pl-10 w-full sm:w-72 h-10 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-md shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button className="gradient-primary text-white" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Assigned to office</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
            <p className="text-xs text-muted-foreground">Active right now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Break</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{onBreakCount}</div>
            <p className="text-xs text-muted-foreground">Taking break</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgService}</div>
            <p className="text-xs text-muted-foreground">Service time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Staff Members</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Manage your office staff and monitor their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading && (
              <p className="text-sm text-muted-foreground">Loading staff...</p>
            )}
            {!isLoading && filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No staff yet. Add one to get started.</p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-48">Staff Member</TableHead>
                  <TableHead className="min-w-24">Position</TableHead>
                  <TableHead className="min-w-20">Status</TableHead>
                  <TableHead className="min-w-24 hidden sm:table-cell">Assigned Lane</TableHead>
                  <TableHead className="min-w-32 hidden md:table-cell">Shift</TableHead>
                  <TableHead className="min-w-28 hidden lg:table-cell">Performance</TableHead>
                  <TableHead className="min-w-24 hidden xl:table-cell">Last Active</TableHead>
                  <TableHead className="text-right min-w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                          {getStatusIcon(s.status)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{s.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{s.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.position}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(s.status)}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {isValidLaneName(s.assignedLane) ? (
                        <span className="text-xs">{s.assignedLane}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs hidden md:table-cell">{s.shift}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-xs">
                        <div>{s.queuesHandled ?? 0} queues handled</div>
                        <div className="text-muted-foreground">{s.avgServiceTime ?? "N/A"} avg time</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">{s.lastActive ?? ""}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEdit(s)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Staff
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(s.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Staff
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Staff Performance Overview</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Individual performance metrics for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {staff.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{s.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{s.position}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm sm:text-base">{s.queuesHandled ?? 0} queues</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{s.avgServiceTime ?? "N/A"} avg time</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add Staff</h2>
                <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>Close</Button>
              </div>

              <form onSubmit={addForm.handleSubmit(onAdd)} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="mb-1.5 block">Full Name</Label>
                  <Input id="name" {...addForm.register("name")} placeholder="e.g., Ana Rodriguez" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                  {addForm.formState.errors.name && (
                    <p className="text-xs text-red-600 mt-1">{addForm.formState.errors.name.message as string}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block">Email</Label>
                  <Input id="email" type="email" {...addForm.register("email")} placeholder="name@example.com" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                  {addForm.formState.errors.email && (
                    <p className="text-xs text-red-600 mt-1">{addForm.formState.errors.email.message as string}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="position" className="mb-1.5 block">Position</Label>
                  <Input id="position" {...addForm.register("position")} placeholder="e.g., Staff Member" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                  {addForm.formState.errors.position && (
                    <p className="text-xs text-red-600 mt-1">{addForm.formState.errors.position.message as string}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block">Status</Label>
                    <select className="w-full border border-gray-300 rounded-md h-9 px-3" value={addForm.watch("status")} onChange={(e) => addForm.setValue("status", e.target.value as any)}>
                      <option value="Online">Online</option>
                      <option value="Break">Break</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="shift" className="mb-1.5 block">Shift</Label>
                    <Select value={addForm.watch("shift") || ""} onValueChange={(v) => addForm.setValue("shift", v)}>
                      <SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shiftOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignedLane" className="mb-1.5 block">Assigned Lane</Label>
                    <Select value={addForm.watch("assignedLane") || ""} onValueChange={(v) => addForm.setValue("assignedLane", v)}>
                      <SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select lane" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLanes.map((ln) => (
                          <SelectItem key={ln.id} value={ln.name}>{ln.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1" disabled={isSaving}>{isSaving ? "Saving..." : "Save Staff"}</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Staff</h2>
                <Button variant="outline" size="sm" onClick={() => { setShowEditModal(false); setEditingStaff(null); }}>Close</Button>
              </div>

              <form onSubmit={editForm.handleSubmit(submitEdit)} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" className="mb-1.5 block">Full Name</Label>
                  <Input id="edit-name" {...editForm.register("name")} className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                  {editForm.formState.errors.name && (
                    <p className="text-xs text-red-600 mt-1">{editForm.formState.errors.name.message as string}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-position" className="mb-1.5 block">Position</Label>
                  <Input id="edit-position" {...editForm.register("position")} className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                  {editForm.formState.errors.position && (
                    <p className="text-xs text-red-600 mt-1">{editForm.formState.errors.position.message as string}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5 block">Status</Label>
                    <select className="w-full border border-gray-300 rounded-md h-9 px-3" value={editForm.watch("status")} onChange={(e) => editForm.setValue("status", e.target.value as any)}>
                      <option value="Online">Online</option>
                      <option value="Break">Break</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-shift" className="mb-1.5 block">Shift</Label>
                    <Select value={editForm.watch("shift") || ""} onValueChange={(v) => editForm.setValue("shift", v)}>
                      <SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {shiftOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                  <div>
                    <Label htmlFor="edit-assignedLane" className="mb-1.5 block">Assigned Lane</Label>
                    <Select value={editForm.watch("assignedLane") || ""} onValueChange={(v) => editForm.setValue("assignedLane", v)}>
                      <SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select lane" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLanes.map((ln) => (
                          <SelectItem key={ln.id} value={ln.name}>{ln.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1" disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowEditModal(false); setEditingStaff(null); }}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


