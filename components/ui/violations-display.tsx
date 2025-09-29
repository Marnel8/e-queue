"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { logUserAction } from "@/app/actions/activity-log";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
	AlertTriangle,
	Shield,
	UserX,
	Lock,
	Clock,
	Search,
	Filter,
	Eye,
	Ban,
	CheckCircle,
	XCircle,
} from "lucide-react";

interface Violation {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	violation: string;
	details: string;
	type: "security" | "fraud" | "abuse" | "attendance" | "compliance";
	severity: "high" | "medium" | "low";
	status: "active" | "resolved" | "pending";
	reportedBy: string;
	reportedByName: string;
	createdAt: string;
	updatedAt: string;
	resolvedAt?: string;
	resolvedBy?: string;
	resolvedByName?: string;
	notes?: string;
}

interface ViolationsDisplayProps {
	userRole: "office-admin" | "customer";
	showActions?: boolean;
}

export function ViolationsDisplay({
	userRole,
	showActions = false,
}: ViolationsDisplayProps) {
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [severityFilter, setSeverityFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [violations, setViolations] = useState<Violation[]>([]);
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(true);

	// Load violations from Firebase
	useEffect(() => {
		const loadViolations = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/violations");
				if (response.ok) {
					const data = await response.json();
					setViolations(data.violations || []);
				} else {
					// Fallback to localStorage for backward compatibility
					if (typeof window !== "undefined") {
						try {
							const storedViolations = JSON.parse(
								localStorage.getItem("equeue_violations") || "[]"
							);
							const dynamicRows = storedViolations.map((d: any) => ({
								id: d.id,
								userId: d.userId || "unknown",
								userName: "Unknown User",
								userEmail: d.email || "unknown@email.com",
								violation: d.detail || d.type,
								details: d.detail,
								type: d.type === "login_attempts_exceeded" ? "security" : "compliance",
								severity: d.type === "login_attempts_exceeded" ? "high" : "medium",
								status: "active" as const,
								reportedBy: "system",
								reportedByName: "System",
								createdAt: new Date(d.when).toISOString(),
								updatedAt: new Date(d.when).toISOString(),
							}));
							setViolations(dynamicRows);
						} catch {
							setViolations([]);
						}
					}
				}
			} catch (error) {
				console.error("Error loading violations:", error);
				setViolations([]);
			} finally {
				setLoading(false);
				setMounted(true);
			}
		};

		loadViolations();
	}, []);

	// Filter violations based on filters
	const filteredViolations = violations.filter((violation) => {
		const matchesSearch =
			violation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			violation.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
			violation.violation.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || violation.status === statusFilter;
		const matchesSeverity =
			severityFilter === "all" || violation.severity === severityFilter;
		const matchesType = typeFilter === "all" || violation.type === typeFilter;

		return matchesSearch && matchesStatus && matchesSeverity && matchesType;
	});

	const getSeverityBadge = (severity: string) => {
		const variants = {
			high: "bg-red-100 text-red-800",
			medium: "bg-yellow-100 text-yellow-800",
			low: "bg-blue-100 text-blue-800",
		};
		return (
			variants[severity as keyof typeof variants] || "bg-gray-100 text-gray-800"
		);
	};

	const getTypeBadge = (type: string) => {
		const variants = {
			security: "bg-red-100 text-red-800",
			fraud: "bg-orange-100 text-orange-800",
			abuse: "bg-yellow-100 text-yellow-800",
			attendance: "bg-blue-100 text-blue-800",
			compliance: "bg-purple-100 text-purple-800",
		};
		return (
			variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800"
		);
	};

	const getStatusBadge = (status: string) => {
		const variants = {
			active: "bg-red-100 text-red-800",
			resolved: "bg-green-100 text-green-800",
			pending: "bg-yellow-100 text-yellow-800",
		};
		return (
			variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
		);
	};

	const handleResolveViolation = async (id: string) => {
		try {
			const response = await fetch(`/api/violations/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					status: "resolved",
					resolvedBy: "current-user", // This should come from auth context
					resolvedByName: "Current User"
				}),
			});

			if (response.ok) {
				// Log the activity
				await logUserAction(
					"current-user", // This should come from auth context
					"Resolved violation",
					"Violation Management",
					"update"
				);

				// Update local state
				setViolations((prev) =>
					prev.map((v) => (v.id === id ? { ...v, status: "resolved" as const } : v))
				);

				toast({
					title: "Violation resolved",
					description: "The violation has been successfully resolved."
				});
			} else {
				toast({
					title: "Error",
					description: "Failed to resolve violation.",
					variant: "destructive"
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Network error occurred.",
				variant: "destructive"
			});
		}
	};

	const handleBanUser = async (id: string) => {
		try {
			// Log the activity
			await logUserAction(
				"current-user", // This should come from auth context
				"Banned user due to violation",
				"User Management",
				"update"
			);

			toast({
				title: "User banned",
				description: "The user has been banned due to violation."
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to ban user.",
				variant: "destructive"
			});
		}
	};

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="w-5 h-5 text-blue-600" />
						Loading Violations
					</CardTitle>
					<CardDescription>
						Please wait while we load the violations data...
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (violations.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-green-600" />
						No Violations Found
					</CardTitle>
					<CardDescription>
						{userRole === "office-admin"
							? "All users are currently compliant with system rules."
							: "You have no violations on your account."}
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AlertTriangle className="w-5 h-5 text-red-600" />
					{userRole === "office-admin" ? "User Violations" : "Your Violations"}
				</CardTitle>
				<CardDescription>
					{userRole === "office-admin"
						? "Monitor and manage user violations and compliance issues"
						: "Review any violations on your account and their current status"}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<Input
							type="text"
							placeholder="Search violations..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full sm:w-32">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="resolved">Resolved</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
						</SelectContent>
					</Select>
					<Select value={severityFilter} onValueChange={setSeverityFilter}>
						<SelectTrigger className="w-full sm:w-32">
							<SelectValue placeholder="Severity" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Severity</SelectItem>
							<SelectItem value="high">High</SelectItem>
							<SelectItem value="medium">Medium</SelectItem>
							<SelectItem value="low">Low</SelectItem>
						</SelectContent>
					</Select>
					<Select value={typeFilter} onValueChange={setTypeFilter}>
						<SelectTrigger className="w-full sm:w-32">
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="security">Security</SelectItem>
							<SelectItem value="fraud">Fraud</SelectItem>
							<SelectItem value="abuse">Abuse</SelectItem>
							<SelectItem value="attendance">Attendance</SelectItem>
							<SelectItem value="compliance">Compliance</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Violations Table */}
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Violation</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Severity</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Status</TableHead>
								{showActions && <TableHead>Actions</TableHead>}
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredViolations.map((violation) => (
								<TableRow key={violation.id}>
									<TableCell>
										<div>
											<div className="font-medium">{violation.userName}</div>
											<div className="text-sm text-gray-500">
												{violation.userEmail}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="max-w-xs">
											<div className="font-medium">{violation.violation}</div>
											<div className="text-sm text-gray-500 truncate">
												{violation.details}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="text-sm">
											{mounted ? new Date(violation.createdAt).toLocaleDateString() : violation.createdAt}
										</div>
									</TableCell>
									<TableCell>
										<Badge className={getSeverityBadge(violation.severity)}>
											{violation.severity}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge className={getTypeBadge(violation.type)}>
											{violation.type}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge className={getStatusBadge(violation.status)}>
											{violation.status}
										</Badge>
									</TableCell>
									{showActions && (
										<TableCell>
											<div className="flex gap-2">
												{violation.status === "active" && (
													<>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																handleResolveViolation(violation.id)
															}
															className="h-8 px-2"
														>
															<CheckCircle className="w-3 h-3 mr-1" />
															Resolve
														</Button>
														<Button
															size="sm"
															variant="destructive"
															onClick={() => handleBanUser(violation.id)}
															className="h-8 px-2"
														>
															<Ban className="w-3 h-3 mr-1" />
															Ban
														</Button>
													</>
												)}
												<Button size="sm" variant="ghost" className="h-8 px-2">
													<Eye className="w-3 h-3" />
												</Button>
											</div>
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{/* Summary */}
				<div className="flex flex-wrap gap-4 text-sm text-gray-600">
					<div className="flex items-center gap-2">
						<AlertTriangle className="w-4 h-4 text-red-500" />
						<span>
							{filteredViolations.filter((v) => v.status === "active").length}{" "}
							Active
						</span>
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle className="w-4 h-4 text-green-500" />
						<span>
							{filteredViolations.filter((v) => v.status === "resolved").length}{" "}
							Resolved
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4 text-yellow-500" />
						<span>
							{filteredViolations.filter((v) => v.status === "pending").length}{" "}
							Pending
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
