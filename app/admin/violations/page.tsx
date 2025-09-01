"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	TrendingUp,
	Users,
} from "lucide-react";

// Enhanced seed violations with more types
const violatorsSeed = [
	{
		id: 1,
		name: "Juan Dela Cruz",
		email: "juan.delacruz@student.omsc.edu.ph",
		violation: "3 consecutive failed login attempts",
		date: "2024-01-20",
		status: "active",
		severity: "high",
		type: "security",
		details: "Account locked due to multiple failed login attempts",
		lastActivity: "2024-01-20 10:30 AM",
	},
	{
		id: 2,
		name: "Maria Santos",
		email: "maria.santos@student.omsc.edu.ph",
		violation: "Invalid photo proof for priority service",
		date: "2024-01-19",
		status: "resolved",
		severity: "medium",
		type: "fraud",
		details: "Submitted fake PWD ID for priority lane access",
		lastActivity: "2024-01-19 02:15 PM",
	},
	{
		id: 3,
		name: "Pedro Garcia",
		email: "pedro.garcia@student.omsc.edu.ph",
		violation: "Repetitive ticket cancellations",
		date: "2024-01-18",
		status: "active",
		severity: "medium",
		type: "abuse",
		details: "Cancelled 5 tickets within 2 hours",
		lastActivity: "2024-01-18 11:45 AM",
	},
	{
		id: 4,
		name: "Ana Rodriguez",
		email: "ana.rodriguez@student.omsc.edu.ph",
		violation: "No-show for scheduled appointment",
		date: "2024-01-17",
		status: "resolved",
		severity: "low",
		type: "attendance",
		details: "Missed scheduled appointment without cancellation",
		lastActivity: "2024-01-17 09:20 AM",
	},
	{
		id: 5,
		name: "Carlos Mendoza",
		email: "carlos.mendoza@student.omsc.edu.ph",
		violation: "Multiple account creation attempts",
		date: "2024-01-16",
		status: "active",
		severity: "high",
		type: "security",
		details: "Attempted to create 3 accounts with different emails",
		lastActivity: "2024-01-16 03:30 PM",
	},
];

export default function ViolationsPage() {
	const [activeTab, setActiveTab] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [severityFilter, setSeverityFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [mounted, setMounted] = useState(false);

	// Get dynamic violations from localStorage
	let dynamic: Array<{
		id: number;
		type: string;
		when: string;
		detail: string;
		email?: string;
	}> = [];
	if (typeof window !== "undefined") {
		try {
			dynamic = JSON.parse(localStorage.getItem("equeue_violations") || "[]");
		} catch {
			dynamic = [];
		}
	}

	const dynamicRows = (dynamic || []).map((d) => ({
		id: d.id,
		name: "Unknown User",
		email: d.email || "unknown@email.com",
		violation: d.detail || d.type,
		date: new Date(d.when).toISOString().split("T")[0],
		status: "active",
		severity: d.type === "login_attempts_exceeded" ? "high" : "medium",
		type: d.type === "login_attempts_exceeded" ? "security" : "compliance",
		details: d.detail,
		lastActivity: mounted ? new Date(d.when).toLocaleString() : d.when,
	}));

	const violators = [...violatorsSeed, ...dynamicRows];

	// Filter violations based on active tab and filters
	const filteredViolators = violators.filter((violator) => {
		const matchesTab = activeTab === "all" || violator.status === activeTab;
		const matchesSearch =
			violator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			violator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			violator.violation.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || violator.status === statusFilter;
		const matchesSeverity =
			severityFilter === "all" || violator.severity === severityFilter;
		const matchesType = typeFilter === "all" || violator.type === typeFilter;

		return (
			matchesTab &&
			matchesSearch &&
			matchesStatus &&
			matchesSeverity &&
			matchesType
		);
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

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "active":
				return <AlertTriangle className="w-4 h-4 text-red-600" />;
			case "resolved":
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case "pending":
				return <Clock className="w-4 h-4 text-yellow-600" />;
			default:
				return <AlertTriangle className="w-4 h-4 text-gray-600" />;
		}
	};

	const handleResolveViolation = (id: number) => {
		// In a real app, this would update the backend
		console.log("Resolving violation:", id);
	};

	const handleBanUser = (id: number) => {
		// In a real app, this would ban the user
		console.log("Banning user:", id);
	};

	// Statistics
	const stats = {
		total: violators.length,
		active: violators.filter((v) => v.status === "active").length,
		resolved: violators.filter((v) => v.status === "resolved").length,
		highSeverity: violators.filter((v) => v.severity === "high").length,
		securityViolations: violators.filter((v) => v.type === "security").length,
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Violations Dashboard
					</h1>
					<p className="text-gray-600">
						Monitor and manage user violations and security incidents
					</p>
				</div>
				<Button className="gradient-primary text-white">
					<Shield className="w-4 h-4 mr-2" />
					Security Report
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Violations</p>
								<p className="text-2xl font-bold">{stats.total}</p>
							</div>
							<AlertTriangle className="w-8 h-8 text-red-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Active</p>
								<p className="text-2xl font-bold text-red-600">
									{stats.active}
								</p>
							</div>
							<XCircle className="w-8 h-8 text-red-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Resolved</p>
								<p className="text-2xl font-bold text-green-600">
									{stats.resolved}
								</p>
							</div>
							<CheckCircle className="w-8 h-8 text-green-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">High Severity</p>
								<p className="text-2xl font-bold text-red-600">
									{stats.highSeverity}
								</p>
							</div>
							<AlertTriangle className="w-8 h-8 text-red-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Security</p>
								<p className="text-2xl font-bold text-orange-600">
									{stats.securityViolations}
								</p>
							</div>
							<Shield className="w-8 h-8 text-orange-600" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Trend</p>
								<p className="text-2xl font-bold text-blue-600">+12%</p>
							</div>
							<TrendingUp className="w-8 h-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader>
					<CardTitle>Violation Management</CardTitle>
					<CardDescription>
						Review and take action on user violations and security incidents
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-4"
					>
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="all">
								All Violations ({violators.length})
							</TabsTrigger>
							<TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
							<TabsTrigger value="resolved">
								Resolved ({stats.resolved})
							</TabsTrigger>
							<TabsTrigger value="pending">Pending (0)</TabsTrigger>
						</TabsList>

						{/* Filters */}
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search violations..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-40">
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
								<SelectTrigger className="w-40">
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
								<SelectTrigger className="w-40">
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
						<TabsContent value={activeTab} className="space-y-4">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>User</TableHead>
											<TableHead>Violation</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Severity</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredViolators.map((violator) => (
											<TableRow key={violator.id}>
												<TableCell>
													<div>
														<div className="font-medium">{violator.name}</div>
														<div className="text-sm text-muted-foreground">
															{violator.email}
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="max-w-xs">
														<div className="font-medium">
															{violator.violation}
														</div>
														<div className="text-sm text-muted-foreground truncate">
															{violator.details}
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge className={getTypeBadge(violator.type)}>
														{violator.type}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														className={getSeverityBadge(violator.severity)}
													>
														{violator.severity}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														{getStatusIcon(violator.status)}
														<Badge className={getStatusBadge(violator.status)}>
															{violator.status}
														</Badge>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														<div>{violator.date}</div>
														<div className="text-muted-foreground">
															{violator.lastActivity}
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																console.log("View details:", violator.id)
															}
														>
															<Eye className="w-4 h-4" />
														</Button>
														{violator.status === "active" && (
															<>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleResolveViolation(violator.id)
																	}
																	className="text-green-600 hover:text-green-700"
																>
																	<CheckCircle className="w-4 h-4" />
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => handleBanUser(violator.id)}
																	className="text-red-600 hover:text-red-700"
																>
																	<Ban className="w-4 h-4" />
																</Button>
															</>
														)}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							{filteredViolators.length === 0 && (
								<div className="text-center py-8">
									<AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-muted-foreground">
										No violations found matching your criteria
									</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
