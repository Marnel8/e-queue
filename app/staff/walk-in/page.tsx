"use client";

import type React from "react";

import { useState } from "react";
import { StaffLayout } from "@/components/staff/layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	UserPlus,
	Printer,
	User,
	FileText,
	Clock,
	CheckCircle,
} from "lucide-react";

const services = [
	{
		id: "transcript",
		name: "Transcript Request",
		estimatedTime: "15-20 minutes",
		fee: "₱0.00",
	},
	{
		id: "certificate",
		name: "Certificate Issuance",
		estimatedTime: "20-30 minutes",
		fee: "₱0.00",
	},
	{
		id: "enrollment",
		name: "Enrollment Services",
		estimatedTime: "30-45 minutes",
		fee: "₱0.00",
	},
	{
		id: "verification",
		name: "Grade Verification",
		estimatedTime: "10-15 minutes",
		fee: "₱0.00",
	},
];

export default function WalkInRegistration() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		studentId: "",
		service: "",
		priority: "regular",
		notes: "",
	});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [ticketNumber, setTicketNumber] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Generate ticket number
		const newTicketNumber = `W${String(
			Math.floor(Math.random() * 1000)
		).padStart(3, "0")}`;
		setTicketNumber(newTicketNumber);
		setIsSubmitted(true);
		// TODO: Implement walk-in registration logic
		console.log("Walk-in registration:", formData);
	};

	const handlePrintTicket = () => {
		// TODO: Implement print functionality
		console.log("Printing ticket:", ticketNumber);
	};

	const handleNewRegistration = () => {
		setIsSubmitted(false);
		setFormData({
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
			studentId: "",
			service: "",
			priority: "regular",
			notes: "",
		});
		setTicketNumber("");
	};

	const selectedService = services.find((s) => s.id === formData.service);

	if (isSubmitted) {
		return (
			<StaffLayout
				title="Walk-in Registration"
				description="Register walk-in customers and issue tickets"
			>
				<div className="max-w-2xl mx-auto px-4 sm:px-0">
					<Card>
						<CardHeader className="text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<CheckCircle className="w-8 h-8 text-green-600" />
							</div>
							<CardTitle className="text-2xl">
								Registration Successful!
							</CardTitle>
							<CardDescription>
								Walk-in customer has been registered and ticket issued
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Ticket Preview */}
							<div className="border-2 border-dashed border-primary p-6 rounded-lg bg-primary/5">
								<div className="text-center space-y-4">
									<div className="text-4xl font-bold text-primary">
										{ticketNumber}
									</div>
									<div>
										<p className="font-semibold">
											{formData.firstName} {formData.lastName}
										</p>
										<p className="text-muted-foreground">
											{selectedService?.name}
										</p>
									</div>
									<div className="text-sm text-muted-foreground">
										<p>Estimated Time: {selectedService?.estimatedTime}</p>
										<p>Fee: {selectedService?.fee}</p>
										<p>
											Priority:{" "}
											{formData.priority === "priority"
												? "Priority"
												: "Regular"}
										</p>
									</div>
									<div className="text-xs text-muted-foreground">
										<p>Issued: {new Date().toLocaleString()}</p>
										<p>Registrar Office - OMSC Mamburao Campus</p>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									onClick={handlePrintTicket}
									className="flex-1 gradient-primary text-white"
								>
									<Printer className="w-4 h-4 mr-2" />
									Print Ticket
								</Button>
								<Button
									onClick={handleNewRegistration}
									variant="outline"
									className="flex-1 bg-transparent"
								>
									<UserPlus className="w-4 h-4 mr-2" />
									New Registration
								</Button>
							</div>

							{/* Customer Info Summary */}
							<div className="border rounded-lg p-4 space-y-2">
								<h3 className="font-semibold mb-3">Customer Information</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
									<div>
										<span className="text-muted-foreground">Name:</span>
										<p className="font-medium">
											{formData.firstName} {formData.lastName}
										</p>
									</div>
									<div>
										<span className="text-muted-foreground">Phone:</span>
										<p className="font-medium">{formData.phone}</p>
									</div>
									<div>
										<span className="text-muted-foreground">Email:</span>
										<p className="font-medium">{formData.email}</p>
									</div>
									<div>
										<span className="text-muted-foreground">Student ID:</span>
										<p className="font-medium">{formData.studentId}</p>
									</div>
								</div>
								{formData.notes && (
									<div>
										<span className="text-muted-foreground">Notes:</span>
										<p className="font-medium">{formData.notes}</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</StaffLayout>
		);
	}

	return (
		<StaffLayout
			title="Walk-in Registration"
			description="Register walk-in customers and issue tickets"
		>
			<div className="max-w-2xl mx-auto px-4 sm:px-0">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<UserPlus className="w-5 h-5" />
							Register Walk-in Customer
						</CardTitle>
						<CardDescription>
							Fill in customer details and issue a queue ticket
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Personal Information */}
							<div className="space-y-4">
								<h3 className="font-semibold flex items-center gap-2">
									<User className="w-4 h-4" />
									Personal Information
								</h3>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											value={formData.firstName}
											onChange={(e) =>
												setFormData({ ...formData, firstName: e.target.value })
											}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											value={formData.lastName}
											onChange={(e) =>
												setFormData({ ...formData, lastName: e.target.value })
											}
											required
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="phone">Phone Number</Label>
										<Input
											id="phone"
											type="tel"
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="studentId">Student ID (if applicable)</Label>
									<Input
										id="studentId"
										value={formData.studentId}
										onChange={(e) =>
											setFormData({ ...formData, studentId: e.target.value })
										}
										placeholder="Enter student ID number"
									/>
								</div>
							</div>

							{/* Service Selection */}
							<div className="space-y-4">
								<h3 className="font-semibold flex items-center gap-2">
									<FileText className="w-4 h-4" />
									Service Information
								</h3>

								<div className="space-y-2">
									<Label htmlFor="service">Select Service</Label>
									<Select
										value={formData.service}
										onValueChange={(value) =>
											setFormData({ ...formData, service: value })
										}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Choose a service" />
										</SelectTrigger>
										<SelectContent>
											{services.map((service) => (
												<SelectItem key={service.id} value={service.id}>
													<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
														<span>{service.name}</span>
														<span className="text-muted-foreground sm:ml-4 text-left sm:text-right">
															{service.fee}
														</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{selectedService && (
									<div className="p-4 bg-muted rounded-lg">
										<div className="flex items-center justify-between mb-2">
											<h4 className="font-medium">{selectedService.name}</h4>
											<Badge variant="outline">{selectedService.fee}</Badge>
										</div>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Clock className="w-4 h-4" />
											<span>
												Estimated time: {selectedService.estimatedTime}
											</span>
										</div>
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="priority">Priority Level</Label>
									<Select
										value={formData.priority}
										onValueChange={(value) =>
											setFormData({ ...formData, priority: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="regular">Regular</SelectItem>
											<SelectItem value="priority">
												Priority (PWD, Senior, Pregnant)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="notes">Additional Notes (Optional)</Label>
									<Textarea
										id="notes"
										value={formData.notes}
										onChange={(e) =>
											setFormData({ ...formData, notes: e.target.value })
										}
										placeholder="Any special requirements or notes..."
										rows={3}
									/>
								</div>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full gradient-primary text-white"
							>
								<UserPlus className="w-4 h-4 mr-2" />
								Register Customer & Issue Ticket
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</StaffLayout>
	);
}
