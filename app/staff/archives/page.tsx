"use client";

import { useEffect, useState } from "react";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Archive,
	RotateCcw,
	Trash2,
	Search,
	Filter,
	Calendar,
	Clock,
	User,
	Phone,
	Mail,
	AlertTriangle,
	CheckCircle,
	XCircle,
	X,
} from "lucide-react";

// Mock archived data - in real app, this would come from API
const archivedData = [
	{
		id: 1,
		ticketNumber: "A001",
		customerName: "Juan Dela Cruz",
		service: "Transcript Request",
		priority: "Regular",
		phone: "+63 912 345 6789",
		email: "juan.delacruz@student.omsc.edu.ph",
		bookedTime: "9:00 AM",
		deletedAt: "2024-01-15 10:30 AM",
		deletedBy: "Ana Rodriguez",
		deletionReason: "Accidental deletion",
		customerType: "Appointment",
		appointmentDate: "2024-01-15",
		status: "Archived",
	},
	{
		id: 2,
		ticketNumber: "A002",
		customerName: "Maria Santos",
		service: "Certificate Issuance",
		priority: "Regular",
		phone: "+63 923 456 7890",
		email: "maria.santos@student.omsc.edu.ph",
		bookedTime: "9:15 AM",
		deletedAt: "2024-01-15 11:45 AM",
		deletedBy: "Carlos Mendoza",
		deletionReason: "Customer requested cancellation",
		customerType: "Walk-in",
		appointmentDate: null,
		status: "Archived",
	},
	{
		id: 3,
		ticketNumber: "A003",
		customerName: "Pedro Garcia",
		service: "Enrollment",
		priority: "Priority",
		phone: "+63 934 567 8901",
		email: "pedro.garcia@student.omsc.edu.ph",
		bookedTime: "9:30 AM",
		deletedAt: "2024-01-15 12:15 PM",
		deletedBy: "Ana Rodriguez",
		deletionReason: "System error",
		customerType: "Appointment",
		appointmentDate: "2024-01-15",
		status: "Archived",
	},
	{
		id: 4,
		ticketNumber: "A004",
		customerName: "Ana Rodriguez",
		service: "Grade Correction",
		priority: "Regular",
		phone: "+63 945 678 9012",
		email: "ana.rodriguez@student.omsc.edu.ph",
		bookedTime: "10:00 AM",
		deletedAt: "2024-01-15 13:20 PM",
		deletedBy: "Carlos Mendoza",
		deletionReason: "Duplicate entry",
		customerType: "Walk-in",
		appointmentDate: null,
		status: "Archived",
	},
	{
		id: 5,
		ticketNumber: "A005",
		customerName: "Luis Martinez",
		service: "Transfer Credentials",
		priority: "Priority",
		phone: "+63 956 789 0123",
		email: "luis.martinez@student.omsc.edu.ph",
		bookedTime: "10:30 AM",
		deletedAt: "2024-01-15 14:05 PM",
		deletedBy: "Ana Rodriguez",
		deletionReason: "Customer no-show",
		customerType: "Appointment",
		appointmentDate: "2024-01-15",
		status: "Archived",
	},
];

export default function ArchivesPage() {
	const [archivedCustomers, setArchivedCustomers] = useState(archivedData);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterService, setFilterService] = useState("");
	const [filterPriority, setFilterPriority] = useState("");
	const [filterCustomerType, setFilterCustomerType] = useState("");
	const [isMounted, setIsMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Filter archived customers based on search and filters
	const filteredCustomers = archivedCustomers.filter((customer) => {
		const matchesSearch =
			customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			customer.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			customer.phone.includes(searchTerm);

		const matchesService =
			filterService === "" || customer.service === filterService;
		const matchesPriority =
			filterPriority === "" || customer.priority === filterPriority;
		const matchesCustomerType =
			filterCustomerType === "" || customer.customerType === filterCustomerType;

		return (
			matchesSearch && matchesService && matchesPriority && matchesCustomerType
		);
	});

	// Get unique services for filter
	const uniqueServices = [...new Set(archivedCustomers.map((c) => c.service))];
	const uniquePriorities = [
		...new Set(archivedCustomers.map((c) => c.priority)),
	];
	const uniqueCustomerTypes = [
		...new Set(archivedCustomers.map((c) => c.customerType)),
	];

	// Handle restore customer
	const handleRestore = (customerId: number) => {
		setArchivedCustomers((prev) =>
			prev.filter((customer) => customer.id !== customerId)
		);
		// In real app, this would call an API to restore the customer
		console.log(`Restoring customer with ID: ${customerId}`);
	};

	// Handle permanent delete
	const handlePermanentDelete = (customerId: number) => {
		setArchivedCustomers((prev) =>
			prev.filter((customer) => customer.id !== customerId)
		);
		// In real app, this would call an API to permanently delete the customer
		console.log(`Permanently deleting customer with ID: ${customerId}`);
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchTerm("");
		setFilterService("");
		setFilterPriority("");
		setFilterCustomerType("");
	};

	if (!isMounted) {
		return (
			<div className="min-h-screen bg-background">
				<div className="flex items-center justify-center h-screen">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-orange-100 rounded-lg">
						<Archive className="w-6 h-6 text-orange-600" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-foreground">Archives</h1>
						<p className="text-muted-foreground">
							Manage accidentally deleted queued customers
						</p>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Archive className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Total Archived
									</p>
									<p className="text-2xl font-bold">
										{archivedCustomers.length}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<Calendar className="w-5 h-5 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Appointments</p>
									<p className="text-2xl font-bold">
										{
											archivedCustomers.filter(
												(c) => c.customerType === "Appointment"
											).length
										}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<User className="w-5 h-5 text-purple-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Walk-ins</p>
									<p className="text-2xl font-bold">
										{
											archivedCustomers.filter(
												(c) => c.customerType === "Walk-in"
											).length
										}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-red-100 rounded-lg">
									<AlertTriangle className="w-5 h-5 text-red-600" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Priority</p>
									<p className="text-2xl font-bold">
										{
											archivedCustomers.filter((c) => c.priority === "Priority")
												.length
										}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Search className="w-5 h-5" />
						Search & Filters
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search by name, ticket number, email, or phone..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Filters */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								Service
							</label>
							<select
								value={filterService}
								onChange={(e) => setFilterService(e.target.value)}
								className="w-full p-2 border border-border rounded-md bg-background"
							>
								<option value="">All Services</option>
								{uniqueServices.map((service) => (
									<option key={service} value={service}>
										{service}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								Priority
							</label>
							<select
								value={filterPriority}
								onChange={(e) => setFilterPriority(e.target.value)}
								className="w-full p-2 border border-border rounded-md bg-background"
							>
								<option value="">All Priorities</option>
								{uniquePriorities.map((priority) => (
									<option key={priority} value={priority}>
										{priority}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">
								Customer Type
							</label>
							<select
								value={filterCustomerType}
								onChange={(e) => setFilterCustomerType(e.target.value)}
								className="w-full p-2 border border-border rounded-md bg-background"
							>
								<option value="">All Types</option>
								{uniqueCustomerTypes.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
						</div>

						<div className="flex items-end">
							<Button
								variant="outline"
								onClick={clearFilters}
								className="w-full"
							>
								<X className="w-4 h-4 mr-2" />
								Clear Filters
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Archived Customers Table */}
			<Card>
				<CardHeader>
					<CardTitle>Archived Customers</CardTitle>
					<CardDescription>
						{filteredCustomers.length} of {archivedCustomers.length} archived
						customers
					</CardDescription>
				</CardHeader>
				<CardContent>
					{filteredCustomers.length === 0 ? (
						<div className="text-center py-8">
							<Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium text-foreground mb-2">
								No archived customers found
							</h3>
							<p className="text-muted-foreground">
								{archivedCustomers.length === 0
									? "No customers have been archived yet."
									: "Try adjusting your search or filters."}
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Ticket</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Service</TableHead>
										<TableHead>Priority</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Deleted At</TableHead>
										<TableHead>Deleted By</TableHead>
										<TableHead>Reason</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCustomers.map((customer) => (
										<TableRow key={customer.id}>
											<TableCell>
												<Badge variant="outline">{customer.ticketNumber}</Badge>
											</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{customer.customerName}</p>
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<Phone className="w-3 h-3" />
														{customer.phone}
													</div>
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<Mail className="w-3 h-3" />
														{customer.email}
													</div>
												</div>
											</TableCell>
											<TableCell>{customer.service}</TableCell>
											<TableCell>
												<Badge
													variant={
														customer.priority === "Priority"
															? "destructive"
															: "secondary"
													}
												>
													{customer.priority}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{customer.customerType}</Badge>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													<div className="flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														{customer.deletedAt}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<User className="w-4 h-4 text-muted-foreground" />
													{customer.deletedBy}
												</div>
											</TableCell>
											<TableCell>
												<span className="text-sm text-muted-foreground">
													{customer.deletionReason}
												</span>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													{/* Restore Button */}
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="outline"
																size="sm"
																className="text-green-600 hover:text-green-700"
															>
																<RotateCcw className="w-4 h-4 mr-1" />
																Restore
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Restore Customer
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to restore{" "}
																	<strong>{customer.customerName}</strong> (
																	{customer.ticketNumber})? This will move them
																	back to the active queue.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() => handleRestore(customer.id)}
																	className="bg-green-600 hover:bg-green-700"
																>
																	<RotateCcw className="w-4 h-4 mr-2" />
																	Restore Customer
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>

													{/* Permanent Delete Button */}
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="outline"
																size="sm"
																className="text-red-600 hover:text-red-700"
															>
																<Trash2 className="w-4 h-4 mr-1" />
																Delete
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Permanently Delete Customer
																</AlertDialogTitle>
																<AlertDialogDescription>
																	This action cannot be undone. This will
																	permanently delete{" "}
																	<strong>{customer.customerName}</strong> (
																	{customer.ticketNumber}) from the archives.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		handlePermanentDelete(customer.id)
																	}
																	className="bg-red-600 hover:bg-red-700"
																>
																	<Trash2 className="w-4 h-4 mr-2" />
																	Permanently Delete
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
