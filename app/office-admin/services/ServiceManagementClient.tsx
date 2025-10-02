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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import {
	Plus,
	Search,
	MoreHorizontal,
	Edit,
	Trash2,
	Clock,
	FileText,
	CheckCircle,
	AlertCircle,
} from "lucide-react";

type Service = {
	id: string;
	name: string;
	description?: string;
	requirements: string[];
	estimatedTime?: string;
	status: "Active" | "Inactive";
	dailyRequests?: number;
	avgWaitTime?: string;
	office: string;
};

const getStatusBadge = (status: string) => {
	return status === "Active"
		? "bg-green-100 text-green-800"
		: "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status: string) => {
	return status === "Active" ? (
		<CheckCircle className="w-4 h-4 text-green-600" />
	) : (
		<AlertCircle className="w-4 h-4 text-gray-600" />
	);
};

export default function ServiceManagementClient() {
	const { toast } = useToast();
	const [services, setServices] = useState<Service[]>([]);
	const [search, setSearch] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showReqsModal, setShowReqsModal] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdatingReqs, setIsUpdatingReqs] = useState(false);

	// Aligning with evaluation page pattern
	const currentAdmin = { office: "Registrar Office" };

	const ServiceFormSchema = z.object({
		name: z.string().min(2, "Service name is required"),
		description: z.string().optional(),
		requirementsText: z.string().optional(),
		estimatedTime: z.string().optional(),
		status: z.enum(["Active", "Inactive"]),
	});
	type ServiceForm = z.infer<typeof ServiceFormSchema>;

	const form = useForm<ServiceForm>({
		resolver: zodResolver(ServiceFormSchema),
		defaultValues: {
			name: "",
			description: "",
			requirementsText: "",
			estimatedTime: "",
			status: "Active",
		},
	});

	const EditServiceSchema = z.object({
		name: z.string().min(2, "Service name is required"),
		description: z.string().optional(),
		estimatedTime: z.string().optional(),
		status: z.enum(["Active", "Inactive"]),
	});
	type EditServiceForm = z.infer<typeof EditServiceSchema>;

	const editForm = useForm<EditServiceForm>({
		resolver: zodResolver(EditServiceSchema),
		defaultValues: {
			name: "",
			description: "",
			estimatedTime: "",
			status: "Active",
		},
	});

	const RequirementsSchema = z.object({
		requirementsText: z.string().optional(),
	});
	type RequirementsForm = z.infer<typeof RequirementsSchema>;

	const requirementsForm = useForm<RequirementsForm>({
		resolver: zodResolver(RequirementsSchema),
		defaultValues: { requirementsText: "" },
	});

	const filteredServices = useMemo(() => {
		const t = search.trim().toLowerCase();
		if (!t) return services;
		return services.filter((s) =>
			s.name.toLowerCase().includes(t) || (s.description ?? "").toLowerCase().includes(t)
		);
	}, [services, search]);

	const totalServices = services.length;
	const activeServices = services.filter((s) => s.status === "Active").length;
	const totalRequestsToday = services.reduce((sum, s) => sum + (s.dailyRequests ?? 0), 0);
	const avgProcessingMinutes = useMemo(() => {
		const toMinutes = (value?: string) => {
			if (!value || typeof value !== "string") return NaN;
			const v = value.trim().toLowerCase();
			// Pattern 1: range like "15-20 minutes"
			const rangeMatch = v.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
			if (rangeMatch) {
				const a = parseFloat(rangeMatch[1]);
				const b = parseFloat(rangeMatch[2]);
				if (!isNaN(a) && !isNaN(b)) return (a + b) / 2;
			}
			// Pattern 2: number with optional 'm' or 'min'
			const singleMatch = v.match(/(\d+(?:\.\d+)?)/);
			if (singleMatch) {
				const n = parseFloat(singleMatch[1]);
				if (!isNaN(n)) return n; // assume minutes
			}
			return NaN;
		};

		// Prefer explicit avgWaitTime if parsable; else fall back to estimatedTime
		const minutes: number[] = [];
		for (const s of services) {
			const fromAvg = toMinutes(s.avgWaitTime);
			const fromEstimated = toMinutes(s.estimatedTime);
			const val = !isNaN(fromAvg) ? fromAvg : fromEstimated;
			if (!isNaN(val)) minutes.push(val);
		}
		if (minutes.length === 0) return "N/A";
		const avg = minutes.reduce((a, b) => a + b, 0) / minutes.length;
		return `${avg.toFixed(1)}m`;
	}, [services]);

	const loadServices = async () => {
		try {
			const res = await fetch(`/api/office-admin/services?office=${encodeURIComponent(currentAdmin.office)}`, { cache: "no-store" });
			const json = await res.json();
			if (json?.success && Array.isArray(json.services)) {
				setServices(
					json.services.map((s: any) => ({
						id: s.id,
						name: s.name,
						description: s.description ?? "",
						requirements: Array.isArray(s.requirements) ? s.requirements : [],
						estimatedTime: s.estimatedTime ?? "",
						fee: s.fee ?? "",
						status: s.status,
						dailyRequests: s.dailyRequests ?? 0,
						avgWaitTime: s.avgWaitTime ?? "N/A",
						office: s.office ?? currentAdmin.office,
					}))
				);
			} else {
				setServices([]);
			}
		} catch (e) {
			setServices([]);
		}
	};

	useEffect(() => {
		loadServices();
	}, []);

	const onSubmit = async (values: ServiceForm) => {
		setIsSaving(true);
		try {
			const requirements = (values.requirementsText ?? "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			const payload = {
				name: values.name,
				description: values.description ?? "",
				requirements,
				estimatedTime: values.estimatedTime ?? "",
				status: values.status,
				office: currentAdmin.office,
			};
			const res = await fetch("/api/office-admin/services", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Service created", description: "New service saved successfully." });
				setShowAddModal(false);
				form.reset();
				await loadServices();
			} else {
				toast({ title: "Failed to save", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Failed to save", description: "Network error.", variant: "destructive" });
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (serviceId: string) => {
		if (!confirm("Delete this service?")) return;
		try {
			const res = await fetch(`/api/office-admin/services/${serviceId}`, { method: "DELETE" });
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Deleted", description: "Service removed." });
				await loadServices();
			} else {
				toast({ title: "Delete failed", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Delete failed", description: "Network error.", variant: "destructive" });
		}
	};

	const openEditService = (service: Service) => {
		setEditingService(service);
		editForm.reset({
			name: service.name,
			description: service.description ?? "",
			estimatedTime: service.estimatedTime ?? "",
			status: service.status,
		});
		setShowEditModal(true);
	};

	const openManageRequirements = (service: Service) => {
		setEditingService(service);
		requirementsForm.reset({
			requirementsText: (service.requirements || []).join(", "),
		});
		setShowReqsModal(true);
	};

	const submitEditService = async (values: EditServiceForm) => {
		if (!editingService) return;
		setIsUpdating(true);
		try {
			const payload = {
				name: values.name,
				description: values.description ?? "",
				estimatedTime: values.estimatedTime ?? "",
				status: values.status,
			};
			const res = await fetch(`/api/office-admin/services/${editingService.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Service updated", description: "Changes saved successfully." });
				setShowEditModal(false);
				setEditingService(null);
				await loadServices();
			} else {
				toast({ title: "Update failed", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Update failed", description: "Network error.", variant: "destructive" });
		} finally {
			setIsUpdating(false);
		}
	};

	const submitRequirements = async (values: RequirementsForm) => {
		if (!editingService) return;
		setIsUpdatingReqs(true);
		try {
			const requirements = (values.requirementsText ?? "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			const res = await fetch(`/api/office-admin/services/${editingService.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ requirements }),
			});
			const json = await res.json();
			if (json?.success) {
				toast({ title: "Requirements updated", description: "Requirements saved successfully." });
				setShowReqsModal(false);
				setEditingService(null);
				await loadServices();
			} else {
				toast({ title: "Update failed", description: json?.message ?? "Please try again.", variant: "destructive" });
			}
		} catch (e) {
			toast({ title: "Update failed", description: "Network error.", variant: "destructive" });
		} finally {
			setIsUpdatingReqs(false);
		}
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071952]">
					Service Management
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Manage office services and requirements
				</p>
			</div>

			{/* Header Actions */}
			<div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-between">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
					<Input
						placeholder="Search services..."
						className="pl-10 w-full sm:w-72 md:w-80 bg-white border border-gray-300 placeholder:text-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<Button className="gradient-primary text-white" onClick={() => setShowAddModal(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Add Service
				</Button>
			</div>

			{/* Service Statistics */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Services
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalServices}</div>
						<p className="text-xs text-muted-foreground">Available services</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Services
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{activeServices}</div>
						<p className="text-xs text-muted-foreground">Currently available</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Today's Requests
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalRequestsToday}</div>
						<p className="text-xs text-muted-foreground">Service requests</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Avg Processing
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{avgProcessingMinutes}</div>
						<p className="text-xs text-muted-foreground">Average time</p>
					</CardContent>
				</Card>
			</div>

			{/* Services Table */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base sm:text-lg">
						Office Services
					</CardTitle>
					<CardDescription className="text-xs sm:text-sm">
						Manage services offered by your office
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="min-w-48">Service</TableHead>
									<TableHead className="min-w-32 hidden sm:table-cell">
										Requirements
									</TableHead>
									<TableHead className="min-w-28">Processing Time</TableHead>
									
									<TableHead className="min-w-20">Status</TableHead>
									<TableHead className="min-w-28 hidden md:table-cell">
										Performance
									</TableHead>
									<TableHead className="text-right min-w-20">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredServices.map((service) => (
									<TableRow key={service.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
													{getStatusIcon(service.status)}
												</div>
												<div className="min-w-0">
													<div className="font-medium text-sm">
														{service.name}
													</div>
													<div className="text-xs text-muted-foreground line-clamp-1">
														{service.description}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<div className="space-y-1">
												{service.requirements.slice(0, 2).map((req, index) => (
													<Badge
														key={index}
														variant="outline"
														className="text-xs mr-1"
													>
														{req}
													</Badge>
												))}
												{service.requirements.length > 2 && (
													<Badge variant="outline" className="text-xs">
														+{service.requirements.length - 2} more
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell className="text-xs">
											{service.estimatedTime}
										</TableCell>
										
										<TableCell>
											<Badge className={getStatusBadge(service.status)}>
												{service.status}
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell">
											<div className="text-xs">
												<div>{service.dailyRequests ?? 0} requests today</div>
												<div className="text-muted-foreground">
													{service.avgWaitTime ?? "N/A"} avg wait
												</div>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem onClick={() => openEditService(service)}>
														<Edit className="mr-2 h-4 w-4" />
														Edit Service
													</DropdownMenuItem>
												<DropdownMenuItem onClick={() => openManageRequirements(service)}>
														<FileText className="mr-2 h-4 w-4" />
														Manage Requirements
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-red-600" onClick={() => handleDelete(service.id)}>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete Service
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

			{/* Service Performance */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base sm:text-lg">
						Service Performance Today
					</CardTitle>
					<CardDescription className="text-xs sm:text-sm">
						Real-time performance metrics for active services
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3 sm:space-y-4">
						{services
							.filter((service) => service.status === "Active")
							.map((service) => (
								<div
									key={service.id}
									className="flex items-center justify-between p-3 sm:p-4 border rounded-lg"
								>
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
											<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
										</div>
										<div className="min-w-0">
											<p className="font-medium text-sm sm:text-base truncate">
												{service.name}
											</p>
											<p className="text-xs sm:text-sm text-muted-foreground">
												{service.estimatedTime}
											</p>
										</div>
									</div>
									<div className="text-right shrink-0">
										<p className="font-medium text-sm sm:text-base">
											{service.dailyRequests ?? 0} requests
										</p>
										<p className="text-xs sm:text-sm text-muted-foreground">
											{service.avgWaitTime ?? "N/A"} avg wait
										</p>
									</div>
								</div>
							))}
					</div>
				</CardContent>
			</Card>

			{/* Add Service Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Add Service</h2>
								<Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
									Close
								</Button>
							</div>

							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<div>
									<Label htmlFor="name">Service Name</Label>
									<Input id="name" {...form.register("name")} placeholder="e.g., Transcript Request" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
									{form.formState.errors.name && (
										<p className="text-xs text-red-600 mt-1">{form.formState.errors.name.message as string}</p>
									)}
								</div>

								<div>
									<Label htmlFor="description">Description</Label>
									<Textarea id="description" rows={3} {...form.register("description")} placeholder="Brief description" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
								</div>

								<div>
									<Label htmlFor="requirementsText">Requirements (comma-separated)</Label>
									<Input id="requirementsText" {...form.register("requirementsText")} placeholder="Valid ID, Request Form, Payment Receipt" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<div>
										<Label htmlFor="estimatedTime">Processing Time</Label>
										<Input id="estimatedTime" {...form.register("estimatedTime")} placeholder="e.g., 15-20 minutes" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
									</div>
									
									<div>
										<Label>Status</Label>
										<Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as any)}>
										<SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Active">Active</SelectItem>
												<SelectItem value="Inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="flex gap-3 pt-2">
									<Button type="submit" className="flex-1" disabled={isSaving}>
										{isSaving ? "Saving..." : "Save Service"}
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

			{/* Edit Service Modal */}
			{showEditModal && editingService && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Edit Service</h2>
								<Button variant="outline" size="sm" onClick={() => { setShowEditModal(false); setEditingService(null); }}>
									Close
								</Button>
							</div>

							<form onSubmit={editForm.handleSubmit(submitEditService)} className="space-y-4">
								<div>
									<Label htmlFor="edit-name">Service Name</Label>
									<Input id="edit-name" {...editForm.register("name")} className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
									{editForm.formState.errors.name && (
										<p className="text-xs text-red-600 mt-1">{editForm.formState.errors.name.message as string}</p>
									)}
								</div>
								<div>
									<Label htmlFor="edit-description">Description</Label>
									<Textarea id="edit-description" rows={3} {...editForm.register("description")} className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<div>
										<Label htmlFor="edit-estimatedTime">Processing Time</Label>
										<Input id="edit-estimatedTime" {...editForm.register("estimatedTime")} className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
									</div>
									
									<div>
										<Label>Status</Label>
										<Select value={editForm.watch("status")} onValueChange={(v) => editForm.setValue("status", v as any)}>
										<SelectTrigger className="border border-gray-300 focus:ring-2 focus:ring-blue-500">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Active">Active</SelectItem>
												<SelectItem value="Inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex gap-3 pt-2">
									<Button type="submit" className="flex-1" disabled={isUpdating}>
										{isUpdating ? "Saving..." : "Save Changes"}
									</Button>
									<Button type="button" variant="outline" className="flex-1" onClick={() => { setShowEditModal(false); setEditingService(null); }}>
										Cancel
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Manage Requirements Modal */}
			{showReqsModal && editingService && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Manage Requirements</h2>
								<Button variant="outline" size="sm" onClick={() => { setShowReqsModal(false); setEditingService(null); }}>
									Close
								</Button>
							</div>

							<form onSubmit={requirementsForm.handleSubmit(submitRequirements)} className="space-y-4">
								<div>
									<Label htmlFor="reqs-text">Requirements (comma-separated)</Label>
									<Textarea id="reqs-text" rows={4} {...requirementsForm.register("requirementsText")} placeholder="Valid ID, Request Form, Payment Receipt" className="border border-gray-300 focus:ring-2 focus:ring-blue-500" />
									<p className="text-xs text-muted-foreground mt-1">Separate items with commas. Example: Valid ID, Application Form, Payment</p>
								</div>
								<div className="flex gap-3 pt-2">
									<Button type="submit" className="flex-1" disabled={isUpdatingReqs}>
										{isUpdatingReqs ? "Saving..." : "Save Requirements"}
									</Button>
									<Button type="button" variant="outline" className="flex-1" onClick={() => { setShowReqsModal(false); setEditingService(null); }}>
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


