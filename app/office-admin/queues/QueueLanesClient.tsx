"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import {
	Plus,
	ArrowUp,
	ArrowDown,
	Edit,
	Trash2,
} from "lucide-react";

type LaneType = "all" | "priority" | "regular";

type Lane = {
	id: string;
	name: string;
	description?: string;
	services: string[];
	currentQueue: number;
	avgWaitTime?: string;
	status: "active" | "maintenance";
	order: number;
	type: LaneType;
	allowedCourses: string[];
	allowedYearLevels: string[];
	office: string;
};

const getStatusBadge = (status: string) => {
	return status === "active"
		? "bg-green-100 text-green-800"
		: "bg-yellow-100 text-yellow-800";
};

export default function QueueLanesClient() {
	const { toast } = useToast();
	const [lanes, setLanes] = useState<Lane[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingLane, setEditingLane] = useState<Lane | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	// Resolve current office from auth context; ensure it is always a stable, non-empty string
	const { userData } = useAuth();
	const [resolvedOffice, setResolvedOffice] = useState<string>("Registrar Office");

	useEffect(() => {
		const candidateOrder = [
			(userData as any)?.officeName,
			(userData as any)?.office,
		];
		const next = candidateOrder.find((c) => typeof c === "string" && c.trim() !== "");
		if (typeof next === "string" && next.trim() !== "" && next !== resolvedOffice) {
			setResolvedOffice(next);
		}
		// If none are valid strings, keep previous resolvedOffice to avoid flicker
	}, [userData, resolvedOffice]);

	const AddLaneSchema = z.object({
		name: z.string().min(2, "Lane name is required"),
		description: z.string().optional(),
		type: z.enum(["all", "priority", "regular" as const]),
		services: z.array(z.string()).default([]),
		allowedCourses: z.array(z.string()).default([]),
		allowedYearLevels: z.array(z.string()).default([]),
		status: z.enum(["active", "maintenance"]),
	});
	type AddLaneForm = z.infer<typeof AddLaneSchema>;

	const addForm = useForm<AddLaneForm>({
		resolver: zodResolver(AddLaneSchema),
		defaultValues: {
			name: "",
			description: "",
			type: "all",
    services: [],
			allowedCourses: [],
			allowedYearLevels: [],
			status: "active",
		},
	});

	const EditLaneSchema = z.object({
		name: z.string().min(2, "Lane name is required"),
		description: z.string().optional(),
		type: z.enum(["all", "priority", "regular" as const]),
		services: z.array(z.string()).default([]),
		allowedCourses: z.array(z.string()).default([]),
		allowedYearLevels: z.array(z.string()).default([]),
		status: z.enum(["active", "maintenance"]),
	});
	type EditLaneForm = z.infer<typeof EditLaneSchema>;

	const editForm = useForm<EditLaneForm>({
		resolver: zodResolver(EditLaneSchema),
		defaultValues: {
			name: "",
			description: "",
			type: "all",
    services: [],
			allowedCourses: [],
			allowedYearLevels: [],
			status: "active",
		},
	});

	const sortedLanes = useMemo(() => {
		return [...lanes].sort((a, b) => a.order - b.order);
	}, [lanes]);

	const [availableServices, setAvailableServices] = useState<{ id: string; name: string }[]>([]);
	const [availableCourses, setAvailableCourses] = useState<string[]>(["BSIT", "BEED", "BSFM", "BSOM"]);
	const [availableYearLevels, setAvailableYearLevels] = useState<string[]>(["1", "2", "3", "4"]);

	const loadAvailableServices = async () => {
		const office = resolvedOffice;
		if (!office || typeof office !== "string" || office.trim() === "") return;
		try {
			const res = await fetch(`/api/office-admin/services?office=${encodeURIComponent(office)}`, { cache: "no-store" });
			const json = await res.json();
			if (json?.success && Array.isArray(json.services)) {
				setAvailableServices(json.services.map((s: any) => ({ id: s.id, name: s.name })));
			} else {
				// keep previous to avoid flicker
			}
		} catch (e) {
			// keep previous to avoid flicker
		}
	};

	const loadLanes = async () => {
		const office = resolvedOffice;
		if (!office || typeof office !== "string" || office.trim() === "") return;
		setIsLoading(true);
		try {
			const res = await fetch(`/api/office-admin/lanes?office=${encodeURIComponent(office)}`, { cache: "no-store" });
			const json = await res.json();
			if (json?.success && Array.isArray(json.lanes)) {
				setLanes(
					json.lanes.map((l: any) => ({
						id: l.id,
						name: l.name,
						description: l.description ?? "",
						services: Array.isArray(l.services) ? l.services : [],
						currentQueue: typeof l.currentQueue === "number" ? l.currentQueue : 0,
						avgWaitTime: l.avgWaitTime ?? "N/A",
						status: (l.status as "active" | "maintenance") ?? "active",
						order: typeof l.order === "number" ? l.order : 0,
						type: (l.type as LaneType) ?? "all",
						allowedCourses: Array.isArray(l.allowedCourses) ? l.allowedCourses : [],
						allowedYearLevels: Array.isArray(l.allowedYearLevels) ? l.allowedYearLevels : [],
						office: l.office ?? office,
					}))
				);
			} else {
				// keep previous to avoid flicker
			}
		} catch (e) {
			// keep previous to avoid flicker
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadLanes();
		loadAvailableServices();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resolvedOffice]);

	const onAddLane = async (values: AddLaneForm) => {
		setIsSaving(true);
		try {
			const services = Array.isArray(values.services) ? values.services : [];
			const allowedCourses = Array.isArray(values.allowedCourses) ? values.allowedCourses : [];
			const allowedYearLevels = Array.isArray(values.allowedYearLevels) ? values.allowedYearLevels : [];
			const payload = {
				name: values.name,
				description: values.description ?? "",
				type: values.type,
				services,
				allowedCourses,
				allowedYearLevels,
				status: values.status,
				order: lanes.length + 1,
				office: resolvedOffice,
			};
			const res = await fetch("/api/office-admin/lanes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Lane created", description: "New lane saved successfully." });
				setShowAddModal(false);
				addForm.reset();
				await loadLanes();
			} else {
				toast({ title: "Failed to save", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Failed to save", description: "Network error.", variant: "destructive" });
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (laneId: string) => {
		if (!confirm("Delete this lane?")) return;
		try {
			const res = await fetch(`/api/office-admin/lanes/${laneId}`, { method: "DELETE" });
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Deleted", description: "Lane removed." });
				await loadLanes();
			} else {
				toast({ title: "Delete failed", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Delete failed", description: "Network error.", variant: "destructive" });
		}
	};

	const openEditLane = (lane: Lane) => {
		setEditingLane(lane);
		editForm.reset({
			name: lane.name,
			description: lane.description ?? "",
			type: lane.type,
			services: Array.isArray(lane.services) ? lane.services : [],
			allowedCourses: Array.isArray(lane.allowedCourses) ? lane.allowedCourses : [],
			allowedYearLevels: Array.isArray(lane.allowedYearLevels) ? lane.allowedYearLevels : [],
			status: lane.status,
		});
		setShowEditModal(true);
	};

	const submitEditLane = async (values: EditLaneForm) => {
		if (!editingLane) return;
		setIsUpdating(true);
		try {
			const services = Array.isArray(values.services) ? values.services : [];
			const allowedCourses = Array.isArray(values.allowedCourses) ? values.allowedCourses : [];
			const allowedYearLevels = Array.isArray(values.allowedYearLevels) ? values.allowedYearLevels : [];
			const payload = {
				name: values.name,
				description: values.description ?? "",
				type: values.type,
				services,
				allowedCourses,
				allowedYearLevels,
				status: values.status,
			};
			const res = await fetch(`/api/office-admin/lanes/${editingLane.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Lane updated", description: "Changes saved successfully." });
				setShowEditModal(false);
				setEditingLane(null);
				await loadLanes();
			} else {
				toast({ title: "Update failed", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Update failed", description: "Network error.", variant: "destructive" });
		} finally {
			setIsUpdating(false);
		}
	};

	const moveLane = async (laneId: string, direction: "up" | "down") => {
		const list = sortedLanes;
		const index = list.findIndex((l) => l.id === laneId);
		if (index === -1) return;
		const swapWith = direction === "up" ? index - 1 : index + 1;
		if (swapWith < 0 || swapWith >= list.length) return;
		const a = list[index];
		const b = list[swapWith];
		try {
			const [r1, r2] = await Promise.all([
				fetch(`/api/office-admin/lanes/${a.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ order: b.order }),
				}),
				fetch(`/api/office-admin/lanes/${b.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ order: a.order }),
				}),
			]);
			const ok = (await r1.json())?.success && (await r2.json())?.success;
			if (ok) {
				toast({ title: "Order updated", description: "Lane order changed." });
				await loadLanes();
			} else {
				toast({ title: "Reorder failed", description: "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Reorder failed", description: "Network error.", variant: "destructive" });
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Queue Lane Management</h1>
					<p className="text-gray-600">Manage queue lanes and eligibility filters</p>
				</div>
				<Button className="gradient-primary text-white" onClick={() => setShowAddModal(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Add Lane
				</Button>
			</div>

			<div className="space-y-4">
					<div className="text-xs sm:text-sm text-muted-foreground">
						<span>Office: </span>
						<span className="font-medium text-foreground">{resolvedOffice || "Registrar Office"}</span>
						<span className="mx-2">•</span>
						<span>Lanes: </span>
						<span className="font-medium text-foreground">{sortedLanes.length}</span>
					</div>
					<Card>
						<CardHeader>
							<CardTitle>Queue Lanes</CardTitle>
							<CardDescription>Manage and organize your queue lanes</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{isLoading && <p className="text-sm text-muted-foreground">Loading lanes...</p>}
								{!isLoading && sortedLanes.length === 0 && (
									<p className="text-sm text-muted-foreground">No lanes yet. Create one to get started.</p>
								)}
								{sortedLanes.map((lane) => (
									<div key={lane.id} className="border rounded-lg p-4 space-y-3">
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold text-gray-900">{lane.name}</h3>
													<Badge variant={lane.status === "active" ? "default" : "secondary"}>{lane.status}</Badge>
													<Badge variant="outline" className="text-xs">
														{lane.type === "all" ? "All" : lane.type === "priority" ? "Priority" : "Regular"}
													</Badge>
												</div>
												<p className="text-sm text-gray-600">{lane.description}</p>
											</div>
											<div className="flex items-center gap-2">
												<Button variant="ghost" size="sm" onClick={() => moveLane(lane.id, "up")}>
													<ArrowUp className="w-4 h-4" />
												</Button>
												<Button variant="ghost" size="sm" onClick={() => moveLane(lane.id, "down")}>
													<ArrowDown className="w-4 h-4" />
												</Button>
												<Button variant="ghost" size="sm" onClick={() => openEditLane(lane)}>
													<Edit className="w-4 h-4" />
												</Button>
												<Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(lane.id)}>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
											<div>
												<p className="text-gray-600">Current Queue</p>
												<p className="font-semibold">{lane.currentQueue} people</p>
											</div>
											<div>
												<p className="text-gray-600">Avg Wait Time</p>
												<p className="font-semibold">{lane.avgWaitTime ?? "N/A"}</p>
											</div>
											<div>
												<p className="text-gray-600">Services</p>
												<p className="font-semibold">{lane.services.length} services</p>
											</div>
										</div>

										<div>
											<p className="text-sm text-gray-600 mb-2">Available Services:</p>
											<div className="flex flex-wrap gap-2">
												{lane.services.map((service, index) => (
													<Badge key={index} variant="outline" className="text-xs">{service}</Badge>
												))}
											</div>
										</div>

										{lane.type === "regular" && (lane.allowedCourses.length > 0 || lane.allowedYearLevels.length > 0) && (
											<div className="text-xs text-muted-foreground">
												<p>Eligible: courses [{lane.allowedCourses.join(", ") || "any"}] years [{lane.allowedYearLevels.join(", ") || "any"}]</p>
											</div>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
			</div>

			{/* Add Lane Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Add Lane</h2>
								<Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>Close</Button>
							</div>

							<form onSubmit={addForm.handleSubmit(onAddLane)} className="space-y-5">
								<div>
									<Label htmlFor="name" className="mb-1.5 block">Lane Name</Label>
									<Input id="name" {...addForm.register("name")} placeholder="e.g., Priority Lane" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
									{addForm.formState.errors.name && (
										<p className="text-xs text-red-600 mt-1">{addForm.formState.errors.name.message as string}</p>
									)}
								</div>

								<div>
									<Label htmlFor="description" className="mb-1.5 block">Description</Label>
									<Textarea id="description" rows={3} {...addForm.register("description")} placeholder="Brief description" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<div>
										<Label className="mb-1.5 block">Type</Label>
										<Select value={addForm.watch("type")} onValueChange={(v) => addForm.setValue("type", v as any)}>
											<SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All</SelectItem>
												<SelectItem value="priority">Priority</SelectItem>
												<SelectItem value="regular">Regular</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label className="mb-1.5 block">Status</Label>
										<Select value={addForm.watch("status")} onValueChange={(v) => addForm.setValue("status", v as any)}>
											<SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="maintenance">Maintenance</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

					<div>
						<Label className="mb-1.5 block">Services</Label>
						<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-md p-3 bg-gray-50">
						{availableServices.length === 0 && (
							<p className="text-xs text-muted-foreground">No services available. Create services first.</p>
						)}
						{availableServices.map((svc) => {
							const selected = addForm.watch("services");
							const checked = selected.includes(svc.name);
							return (
									<label key={svc.id} className="flex items-center gap-2 text-sm">
									<Checkbox
											className="h-4 w-4"
											checked={checked}
										onCheckedChange={(v) => {
											const curr = addForm.getValues("services");
											addForm.setValue(
												"services",
												v ? Array.from(new Set([...curr, svc.name])) : curr.filter((n) => n !== svc.name),
												{ shouldDirty: true }
											);
										}}
									/>
									<span>{svc.name}</span>
								</label>
							);
						})}
					</div>
				</div>

				{addForm.watch("type") === "regular" && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div>
							<Label className="mb-1.5 block">Allowed Courses</Label>
							<div className="mt-3 grid grid-cols-1 gap-2.5 border rounded-md p-3 bg-gray-50">
								{availableCourses.map((course) => {
									const selected = addForm.watch("allowedCourses");
									const checked = selected.includes(course);
									return (
										<label key={course} className="flex items-center gap-2 text-sm">
											<Checkbox
												className="h-4 w-4"
													checked={checked}
													onCheckedChange={(v) => {
														const curr = addForm.getValues("allowedCourses");
														addForm.setValue(
															"allowedCourses",
															v ? Array.from(new Set([...curr, course])) : curr.filter((n) => n !== course),
															{ shouldDirty: true }
														);
													}}
											/>
											<span>{course}</span>
										</label>
									);
								})}
							</div>
						</div>
						<div>
							<Label className="mb-1.5 block">Allowed Year Levels</Label>
							<div className="mt-3 grid grid-cols-2 gap-3 border rounded-md p-3 bg-gray-50">
								{availableYearLevels.map((yl) => {
									const selected = addForm.watch("allowedYearLevels");
									const checked = selected.includes(yl);
									return (
										<label key={yl} className="flex items-center gap-2 text-sm">
											<Checkbox
												className="h-4 w-4"
													checked={checked}
													onCheckedChange={(v) => {
														const curr = addForm.getValues("allowedYearLevels");
														addForm.setValue(
															"allowedYearLevels",
															v ? Array.from(new Set([...curr, yl])) : curr.filter((n) => n !== yl),
															{ shouldDirty: true }
														);
													}}
											/>
											<span>{yl}</span>
										</label>
									);
								})}
							</div>
						</div>
					</div>
				)}

								<div className="flex gap-3 pt-2">
									<Button type="submit" className="flex-1" disabled={isSaving}>
										{isSaving ? "Saving..." : "Save Lane"}
									</Button>
									<Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
										Cancel
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Edit Lane Modal */}
			{showEditModal && editingLane && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Edit Lane</h2>
								<Button variant="outline" size="sm" onClick={() => { setShowEditModal(false); setEditingLane(null); }}>Close</Button>
							</div>

							<form onSubmit={editForm.handleSubmit(submitEditLane)} className="space-y-5">
								<div>
									<Label htmlFor="edit-name" className="mb-1.5 block">Lane Name</Label>
									<Input id="edit-name" {...editForm.register("name")} className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
									{editForm.formState.errors.name && (
										<p className="text-xs text-red-600 mt-1">{editForm.formState.errors.name.message as string}</p>
									)}
								</div>

								<div>
									<Label htmlFor="edit-description" className="mb-1.5 block">Description</Label>
									<Textarea id="edit-description" rows={3} {...editForm.register("description")} className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<div>
										<Label className="mb-1.5 block">Type</Label>
										<Select value={editForm.watch("type")} onValueChange={(v) => editForm.setValue("type", v as any)}>
											<SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All</SelectItem>
												<SelectItem value="priority">Priority</SelectItem>
												<SelectItem value="regular">Regular</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label className="mb-1.5 block">Status</Label>
										<Select value={editForm.watch("status")} onValueChange={(v) => editForm.setValue("status", v as any)}>
											<SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="maintenance">Maintenance</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

					<div>
						<Label className="mb-1.5 block">Services</Label>
						<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-md p-3 bg-gray-50">
						{availableServices.length === 0 && (
							<p className="text-xs text-muted-foreground">No services available. Create services first.</p>
						)}
						{availableServices.map((svc) => {
							const selected = editForm.watch("services");
							const checked = selected.includes(svc.name);
							return (
									<label key={svc.id} className="flex items-center gap-2 text-sm">
									<Checkbox
											className="h-4 w-4"
											checked={checked}
										onCheckedChange={(v) => {
											const curr = editForm.getValues("services");
											editForm.setValue(
												"services",
												v ? Array.from(new Set([...curr, svc.name])) : curr.filter((n) => n !== svc.name),
												{ shouldDirty: true }
											);
										}}
									/>
									<span>{svc.name}</span>
								</label>
							);
						})}
					</div>
				</div>

				{editForm.watch("type") === "regular" && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<Label className="mb-1.5 block">Allowed Courses</Label>
								<div className="mt-3 grid grid-cols-1 gap-2.5 border rounded-md p-3 bg-gray-50">
								{availableCourses.map((course) => {
									const selected = editForm.watch("allowedCourses");
									const checked = selected.includes(course);
									return (
										<label key={course} className="flex items-center gap-2 text-sm">
												<Checkbox
													className="h-4 w-4"
													checked={checked}
													onCheckedChange={(v) => {
														const curr = editForm.getValues("allowedCourses");
														editForm.setValue(
															"allowedCourses",
															v ? Array.from(new Set([...curr, course])) : curr.filter((n) => n !== course),
															{ shouldDirty: true }
														);
													}}
											/>
											<span>{course}</span>
										</label>
									);
								})}
							</div>
						</div>
							<div>
								<Label className="mb-1.5 block">Allowed Year Levels</Label>
								<div className="mt-3 grid grid-cols-2 gap-3 border rounded-md p-3 bg-gray-50">
								{availableYearLevels.map((yl) => {
									const selected = editForm.watch("allowedYearLevels");
									const checked = selected.includes(yl);
									return (
										<label key={yl} className="flex items-center gap-2 text-sm">
												<Checkbox
													className="h-4 w-4"
													checked={checked}
													onCheckedChange={(v) => {
														const curr = editForm.getValues("allowedYearLevels");
														editForm.setValue(
															"allowedYearLevels",
															v ? Array.from(new Set([...curr, yl])) : curr.filter((n) => n !== yl),
															{ shouldDirty: true }
														);
													}}
											/>
											<span>{yl}</span>
										</label>
									);
								})}
							</div>
						</div>
					</div>
				)}

								<div className="flex gap-3 pt-2">
									<Button type="submit" className="flex-1" disabled={isUpdating}>
										{isUpdating ? "Saving..." : "Save Changes"}
									</Button>
									<Button type="button" variant="outline" className="flex-1" onClick={() => { setShowEditModal(false); setEditingLane(null); }}>
										Cancel
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}


