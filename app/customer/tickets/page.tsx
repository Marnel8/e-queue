"use client";


import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Download,
	X,
	Calendar,
	Clock,
	Ticket,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const activeTickets = [
	{
		id: 1,
		ticketNumber: "A015",
		office: "Registrar Office",
		service: "Transcript Request",
		date: "2024-01-15",
		time: "10:30 AM",
		status: "Active",
		position: 3,
		estimatedWait: "15 minutes",
		fee: "₱0.00",
	},
];

const upcomingTickets = [
	{
		id: 2,
		ticketNumber: "B023",
		office: "Cashier Office",
		service: "Tuition Payment",
		date: "2024-01-16",
		time: "2:00 PM",
		status: "Scheduled",
		fee: "₱0.00",
	},
	{
		id: 3,
		ticketNumber: "C045",
		office: "Student Affairs Office",
		service: "Student ID",
		date: "2024-01-17",
		time: "9:00 AM",
		status: "Scheduled",
		fee: "₱0.00",
	},
];

const completedTickets = [
	{
		id: 4,
		ticketNumber: "A012",
		office: "Library Services",
		service: "Book Borrowing",
		date: "2024-01-14",
		time: "3:00 PM",
		status: "Completed",
		completedAt: "2024-01-14 3:15 PM",
		fee: "₱0.00",
	},
	{
		id: 5,
		ticketNumber: "A008",
		office: "Registrar Office",
		service: "Certificate Issuance",
		date: "2024-01-12",
		time: "10:00 AM",
		status: "Completed",
		completedAt: "2024-01-12 10:25 AM",
		fee: "₱0.00",
	},
];

const getStatusBadge = (status: string) => {
	const variants = {
		Active: "bg-green-500 text-white",
		Scheduled: "bg-primary text-white",
		Completed: "bg-gray-500 text-white",
		Cancelled: "bg-red-500 text-white",
	};
	return variants[status as keyof typeof variants] || "bg-gray-500 text-white";
};

const getStatusIcon = (status: string) => {
	switch (status) {
		case "Active":
			return <Clock className="w-4 h-4 text-green-600" />;
		case "Scheduled":
			return <Calendar className="w-4 h-4 text-blue-600" />;
		case "Completed":
			return <CheckCircle className="w-4 h-4 text-gray-600" />;
		case "Cancelled":
			return <X className="w-4 h-4 text-red-600" />;
		default:
			return <AlertCircle className="w-4 h-4 text-gray-600" />;
	}
};

export default function MyTickets() {
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const [ticketToCancel, setTicketToCancel] = useState<number | null>(null);

	const openCancelDialog = (ticketId: number) => {
		setTicketToCancel(ticketId);
		setShowCancelDialog(true);
	};

	const handleConfirmCancel = () => {
		if (ticketToCancel == null) return;
		// TODO: Implement cancel logic for the ticket with ID ticketToCancel
		console.log("Cancel ticket", ticketToCancel, "Reason:", cancelReason);
		setShowCancelDialog(false);
		setCancelReason("");
		setTicketToCancel(null);
	};

	return (
		<div className="space-y-6">
				{/* Ticket Statistics */}
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs sm:text-sm font-medium">
								Active Tickets
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-green-600">
								{activeTickets.length}
							</div>
							<p className="text-xs text-muted-foreground">
								Currently in queue
							</p>
						</CardContent>
					</Card>

					{/* <Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs sm:text-sm font-medium">
								Upcoming
							</CardTitle>
							<Calendar className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-blue-600">
								{upcomingTickets.length}
							</div>
							<p className="text-xs text-muted-foreground">
								Scheduled appointments
							</p>
						</CardContent>
					</Card> */}

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs sm:text-sm font-medium">
								Completed
							</CardTitle>
							<CheckCircle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold">
								{completedTickets.length}
							</div>
							<p className="text-xs text-muted-foreground">This month</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-xs sm:text-sm font-medium">
								Total Saved
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-primary">
								2.5h
							</div>
							<p className="text-xs text-muted-foreground">Time saved</p>
						</CardContent>
					</Card>
				</div>

				{/* Tickets Tabs */}
				<Tabs defaultValue="active" className="space-y-6">
					<TabsList className="grid w-full grid-cols-3 h-auto">
						<TabsTrigger value="active" className="text-xs sm:text-sm py-2">
							Active & Upcoming
						</TabsTrigger>
						<TabsTrigger value="completed" className="text-xs sm:text-sm py-2">
							Completed
						</TabsTrigger>
						<TabsTrigger value="cancelled" className="text-xs sm:text-sm py-2">
							Cancelled
						</TabsTrigger>
					</TabsList>

					{/* Active & Upcoming Tickets */}
					<TabsContent value="active" className="space-y-6">
						{/* Active Tickets */}
						{activeTickets.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Clock className="w-5 h-5 text-green-600" />
										Active Tickets
									</CardTitle>
									<CardDescription>Tickets currently in queue</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{activeTickets.map((ticket) => (
											<div
												key={ticket.id}
												className="border rounded-lg p-4 bg-green-50 border-green-200"
											>
												<div className="flex items-center justify-between mb-3">
													<div className="flex items-center gap-3">
														<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
															<span className="text-white font-bold">
																{ticket.ticketNumber}
															</span>
														</div>
														<div>
															<h3 className="font-semibold">{ticket.office}</h3>
															<p className="text-sm text-muted-foreground">
																{ticket.service}
															</p>
														</div>
													</div>
													<Badge className={getStatusBadge(ticket.status)}>
														{ticket.status}
													</Badge>
												</div>

												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
													<div className="flex items-center gap-2">
														<Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
														<span className="truncate">
															{ticket.date} at {ticket.time}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
														<span>Position: {ticket.position}</span>
													</div>
													<div className="flex items-center gap-2">
														<AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
														<span>Wait: {ticket.estimatedWait}</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-medium">
															Fee: {ticket.fee}
														</span>
													</div>
												</div>

												<div className="flex flex-col sm:flex-row gap-2 mt-4">
													<Button
														size="sm"
														variant="outline"
														className="bg-transparent flex-1 sm:flex-none"
													>
														<Download className="w-4 h-4 mr-2" />
														Download
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none bg-transparent"
														onClick={() => openCancelDialog(ticket.id)}
													>
														<X className="w-4 h-4 mr-2" />
														Cancel
													</Button>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Upcoming Tickets */}
						{/* {upcomingTickets.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="w-5 h-5 text-blue-600" />
										Upcoming Appointments
									</CardTitle>
									<CardDescription>Your scheduled tickets</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{upcomingTickets.map((ticket) => (
											<div
												key={ticket.id}
												className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3"
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
														{getStatusIcon(ticket.status)}
													</div>
													<div className="min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-medium">
																{ticket.ticketNumber}
															</span>
															<Badge className={getStatusBadge(ticket.status)}>
																{ticket.status}
															</Badge>
														</div>
														<p className="text-sm text-muted-foreground">
															{ticket.office} - {ticket.service}
														</p>
													</div>
												</div>
												<div className="text-left sm:text-right">
													<p className="font-medium text-sm sm:text-base">
														{ticket.date} at {ticket.time}
													</p>
													<p className="text-sm text-muted-foreground">
														Fee: {ticket.fee}
													</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)} */}

						{activeTickets.length === 0 && upcomingTickets.length === 0 && (
							<Card>
								<CardContent className="text-center py-12">
									<Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
									<h3 className="text-xl font-semibold mb-2">
										No Active Tickets
									</h3>
									<p className="text-muted-foreground mb-6">
										You don't have any active or upcoming tickets.
									</p>
									<Button className="gradient-primary text-white">
										<Calendar className="w-4 h-4 mr-2" />
										Book New Ticket
									</Button>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					{/* Completed Tickets */}
					<TabsContent value="completed">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CheckCircle className="w-5 h-5 text-gray-600" />
									Completed Tickets
								</CardTitle>
								<CardDescription>Your transaction history</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{completedTickets.map((ticket) => (
										<div
											key={ticket.id}
											className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg bg-gray-50 gap-3"
										>
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
													{getStatusIcon(ticket.status)}
												</div>
												<div className="min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-medium">
															{ticket.ticketNumber}
														</span>
														<Badge className={getStatusBadge(ticket.status)}>
															{ticket.status}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground">
														{ticket.office} - {ticket.service}
													</p>
													<p className="text-xs text-muted-foreground">
														Completed: {ticket.completedAt}
													</p>
												</div>
											</div>
											<div className="flex flex-col sm:flex-row sm:items-center gap-3">
												<div className="text-left sm:text-right">
													<p className="font-medium text-sm">
														{ticket.date} at {ticket.time}
													</p>
													<p className="text-sm text-muted-foreground">
														Fee: {ticket.fee}
													</p>
												</div>
												<Button
													size="sm"
													variant="outline"
													className="bg-transparent w-full sm:w-auto"
												>
													<Download className="w-4 h-4 mr-2" />
													Download
												</Button>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Cancelled Tickets */}
					<TabsContent value="cancelled">
						<Card>
							<CardContent className="text-center py-12">
								<X className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">
									No Cancelled Tickets
								</h3>
								<p className="text-muted-foreground">
									You haven't cancelled any tickets recently.
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{showCancelDialog && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<Card className="w-full max-w-md mx-4 border-2 border-red-200">
							<CardHeader className="bg-red-50">
								<CardTitle className="flex items-center gap-2 text-red-700">
									<AlertCircle className="w-5 h-5 text-red-600" />
									Cancel Ticket
								</CardTitle>
								<CardDescription className="text-red-600">
									Are you sure you want to cancel this ticket?
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-4">
								<div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
									<p className="text-sm text-red-800 font-medium">
										<strong>Warning:</strong> Cancelling your ticket will remove
										you from the queue. You'll need to book a new ticket to
										rejoin.
									</p>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">
										Reason for cancellation
									</Label>
									<Textarea
										placeholder="Please tell us why you're cancelling (required)"
										value={cancelReason}
										onChange={(e) => setCancelReason(e.target.value)}
										className="min-h-[90px] border-2 border-red-200 focus:border-red-300"
										suppressHydrationWarning
									/>
								</div>
								<div className="flex gap-3">
									<Button
										onClick={() => setShowCancelDialog(false)}
										variant="outline"
										className="flex-1"
									>
										Keep Ticket
									</Button>
									<Button
										onClick={handleConfirmCancel}
										disabled={!cancelReason.trim()}
										className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
									>
										Cancel Ticket
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
		</div>
	);
}
