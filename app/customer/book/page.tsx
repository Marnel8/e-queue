"use client";

import type React from "react";

import { useEffect, useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
	Building2,
	Clock,
	FileText,
	Users,
	CheckCircle,
	AlertCircle,
	Monitor,
} from "lucide-react";

const offices = [
	// Ordered per request: SAS Office, Registrar, Guidance, Cashier, Admin Office, Clinic, Library, Marketing Center
	{
		id: "student-affairs",
		name: "SAS Office",
		description: "Student Affairs and Services",
		currentQueue: 12,
		avgWaitTime: "12.3 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Ana Rodriguez",
				status: "active",
				currentQueue: 6,
			},
			{
				id: 2,
				name: "Desk 2",
				staff: "Carlos Mendoza",
				status: "active",
				currentQueue: 6,
			},
		],
	},
	{
		id: "registrar",
		name: "Registrar",
		description: "Student records and enrollment services",
		currentQueue: 8,
		avgWaitTime: "6.2 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Maria Santos",
				status: "active",
				currentQueue: 4,
			},
			{
				id: 2,
				name: "Desk 2",
				staff: "Pedro Garcia",
				status: "active",
				currentQueue: 4,
			},
			{
				id: 3,
				name: "Desk 3",
				staff: "Elena Cruz",
				status: "break",
				currentQueue: 0,
			},
		],
	},
	{
		id: "guidance",
		name: "Guidance",
		description: "Counseling and guidance services",
		currentQueue: 4,
		avgWaitTime: "7.5 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Dr. Roberto Silva",
				status: "active",
				currentQueue: 4,
			},
		],
	},
	{
		id: "cashier",
		name: "Cashier",
		description: "Payment processing and financial services",
		currentQueue: 5,
		avgWaitTime: "4.8 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Carmen Reyes",
				status: "active",
				currentQueue: 3,
			},
			{
				id: 2,
				name: "Desk 2",
				staff: "Jose Martinez",
				status: "active",
				currentQueue: 2,
			},
		],
	},
	{
		id: "admin",
		name: "Admin Office",
		description: "Administrative and general services",
		currentQueue: 2,
		avgWaitTime: "5.0 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Luzviminda Torres",
				status: "active",
				currentQueue: 2,
			},
		],
	},
	{
		id: "clinic",
		name: "Clinic",
		description: "Health and medical services",
		currentQueue: 3,
		avgWaitTime: "8.0 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Nurse Sarah Johnson",
				status: "active",
				currentQueue: 3,
			},
		],
	},
	{
		id: "library",
		name: "Library",
		description: "Library resources and research support",
		currentQueue: 3,
		avgWaitTime: "3.1 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Librarian Maria Lopez",
				status: "active",
				currentQueue: 3,
			},
		],
	},
	{
		id: "marketing",
		name: "Marketing Center",
		description: "Marketing and admissions support",
		currentQueue: 1,
		avgWaitTime: "4.0 minutes",
		status: "Open",
		desks: [
			{
				id: 1,
				name: "Desk 1",
				staff: "Marketing Officer Juan Dela Cruz",
				status: "active",
				currentQueue: 1,
			},
		],
	},
];

const services = {
	registrar: [
		{
			id: "transcript",
			name: "Transcript Request",
			time: "15-20 min",
			fee: "₱0.00",
		},
		{
			id: "certificate",
			name: "Certificate Issuance",
			time: "20-30 min",
			fee: "₱0.00",
		},
		{
			id: "enrollment",
			name: "Enrollment Services",
			time: "30-45 min",
			fee: "₱0.00",
		},
	],
	cashier: [
		{ id: "tuition", name: "Tuition Payment", time: "10-15 min", fee: "₱0.00" },
		{ id: "fees", name: "Fee Collection", time: "5-10 min", fee: "₱0.00" },
		{ id: "refunds", name: "Refunds", time: "15-20 min", fee: "₱0.00" },
	],
	"student-affairs": [
		{ id: "student-id", name: "Student ID", time: "10-15 min", fee: "₱0.00" },
		{
			id: "scholarship",
			name: "Scholarship Application",
			time: "20-30 min",
			fee: "₱0.00",
		},
		{
			id: "disciplinary",
			name: "Disciplinary Matters",
			time: "30-60 min",
			fee: "₱0.00",
		},
	],
	library: [
		{ id: "borrowing", name: "Book Borrowing", time: "5-10 min", fee: "₱0.00" },
		{
			id: "research",
			name: "Research Assistance",
			time: "15-30 min",
			fee: "₱0.00",
		},
		{
			id: "computer",
			name: "Computer Access",
			time: "10-15 min",
			fee: "₱0.00",
		},
	],
	guidance: [
		{ id: "counseling", name: "Counseling", time: "20-30 min", fee: "₱0.00" },
		{
			id: "clearance",
			name: "Guidance Clearance",
			time: "10-15 min",
			fee: "₱0.00",
		},
	],
	admin: [
		{
			id: "requests",
			name: "Document Requests",
			time: "10-20 min",
			fee: "₱0.00",
		},
		{
			id: "certificates",
			name: "Certificate Processing",
			time: "15-25 min",
			fee: "₱0.00",
		},
		{
			id: "inquiries",
			name: "General Inquiries",
			time: "5-10 min",
			fee: "₱0.00",
		},
	],
	clinic: [
		{
			id: "consultation",
			name: "Consultation",
			time: "15-25 min",
			fee: "₱0.00",
		},
		{ id: "first-aid", name: "First Aid", time: "5-10 min", fee: "₱0.00" },
		{
			id: "medical-cert",
			name: "Medical Certificate",
			time: "15-20 min",
			fee: "₱0.00",
		},
	],
	marketing: [
		{
			id: "admissions",
			name: "Admissions Inquiry",
			time: "10-20 min",
			fee: "₱0.00",
		},
		{
			id: "campus-tour",
			name: "Campus Tour Scheduling",
			time: "10-15 min",
			fee: "₱0.00",
		},
		{
			id: "info-request",
			name: "Information Request",
			time: "5-10 min",
			fee: "₱0.00",
		},
	],
};

export default function BookTicket() {
	const [step, setStep] = useState(1);
	const [selectedOffice, setSelectedOffice] = useState("");
	const [selectedService, setSelectedService] = useState("");
	const [selectedDesk, setSelectedDesk] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Policy gating (placeholder flags; to be wired to backend)
	const [hasActiveTicket] = useState(false);
	const [hasPendingEvaluation, setHasPendingEvaluation] = useState(false);
	const [credentialsConfirmed, setCredentialsConfirmed] = useState(false);

	const selectedOfficeData = offices.find(
		(office) => office.id === selectedOffice
	);
	const availableServices = selectedOffice
		? services[selectedOffice as keyof typeof services] || []
		: [];
	const selectedServiceData = availableServices.find(
		(service) => service.id === selectedService
	);
	const selectedDeskData = selectedOfficeData?.desks.find(
		(desk) => desk.id.toString() === selectedDesk
	);

	const handleNext = () => {
		if (step < 5) setStep(step + 1);
	};

	const handleBack = () => {
		if (step > 1) setStep(step - 1);
	};

	const handleSubmit = () => {
		// TODO: Implement ticket issuance (same-day, single active ticket policy)
		console.log("Issuing same-day ticket:", {
			office: selectedOffice,
			service: selectedService,
			desk: selectedDesk,
			credentialsConfirmed,
		});
		setIsSubmitted(true);
	};

	useEffect(() => {
		if (typeof window === "undefined") return;
		const pending =
			localStorage.getItem("equeue_hasPendingEvaluation") === "true";
		setHasPendingEvaluation(pending);
		const onStorage = (e: StorageEvent) => {
			if (e.key === "equeue_hasPendingEvaluation") {
				setHasPendingEvaluation(e.newValue === "true");
			}
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	if (isSubmitted) {
		return (
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<CheckCircle className="w-8 h-8 text-green-600" />
						</div>
						<CardTitle className="text-2xl">Ticket Created!</CardTitle>
						<CardDescription>
							Your same-day queue ticket has been created
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Ticket Details */}
						<div className="border rounded-lg p-6 bg-primary/5">
							<div className="text-center space-y-4">
								<div className="text-3xl font-bold text-primary">A016</div>
								<div>
									<p className="font-semibold">{selectedOfficeData?.name}</p>
									<p className="text-muted-foreground">
										{selectedServiceData?.name}
									</p>
									<p className="text-sm text-muted-foreground">
										{selectedDeskData?.name} - {selectedDeskData?.staff}
									</p>
								</div>
								<div className="text-sm text-muted-foreground">
									<p>Valid: Today only</p>
								</div>
							</div>
						</div>

						<div className="text-center space-y-4">
							<p className="text-muted-foreground">
								Arrive promptly when notified. Tickets are non-transferable and
								expire end of day.
							</p>
							<div className="flex gap-4">
								<Button className="flex-1 gradient-primary text-white">
									Download Ticket
								</Button>
								<Button variant="outline" className="flex-1 bg-transparent">
									View My Queue
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			{(hasActiveTicket || hasPendingEvaluation) && (
				<div className="mb-4 p-4 border rounded bg-yellow-50 text-yellow-800 flex items-start gap-2">
					<AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
					<div className="text-sm">
						{hasActiveTicket && (
							<p>
								You already have an active ticket. You can only get another
								after it is completed.
							</p>
						)}
						{hasPendingEvaluation && (
							<p>
								Your last transaction's evaluation is pending. Please complete
								it before getting a new ticket.
							</p>
						)}
					</div>
				</div>
			)}
			{/* Progress Steps */}
			<div className="mb-8">
				<div className="flex items-center justify-center px-4">
					<div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
						{[1, 2, 3, 4, 5].map((stepNumber) => (
							<div key={stepNumber} className="flex items-center flex-shrink-0">
								<div
									className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${
										step >= stepNumber
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground border"
									}`}
								>
									{stepNumber}
								</div>
								{stepNumber < 5 && (
									<div
										className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
											step > stepNumber ? "bg-primary" : "bg-muted"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>
				<div className="flex justify-center mt-3 px-4">
					<div className="text-xs sm:text-sm text-muted-foreground text-center">
						Step {step} of 5:{" "}
						{step === 1
							? "Select Office"
							: step === 2
							? "Choose Service"
							: step === 3
							? "Select Desk"
							: step === 4
							? "Check Credentials"
							: "Review & Confirm"}
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						{step === 1 && "Select Office"}
						{step === 2 && "Choose Service"}
						{step === 3 && "Select Desk"}
						{step === 4 && "Check Credentials"}
						{step === 5 && "Review & Confirm"}
					</CardTitle>
					<CardDescription>
						{step === 1 && "Choose the office you need to visit"}
						{step === 2 && "Select the service you require"}
						{step === 3 && "Choose your preferred service desk"}
						{step === 4 && "Confirm your identity to proceed"}
						{step === 5 && "Review your ticket details"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Step 1: Select Office */}
					{step === 1 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{offices.map((office) => (
								<Card
									key={office.id}
									className={`cursor-pointer transition-all hover:shadow-md ${
										selectedOffice === office.id
											? "ring-2 ring-primary bg-primary/5"
											: ""
									}`}
									onClick={() => setSelectedOffice(office.id)}
								>
									<CardContent className="p-4">
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<Building2 className="w-6 h-6 text-primary flex-shrink-0" />
												<div className="min-w-0">
													<h3 className="font-semibold text-sm sm:text-base">
														{office.name}
													</h3>
													<p className="text-xs sm:text-sm text-muted-foreground">
														{office.description}
													</p>
												</div>
											</div>
											<Badge
												variant={
													office.status === "Open" ? "default" : "secondary"
												}
												className="flex-shrink-0 text-xs"
											>
												{office.status}
											</Badge>
										</div>
										<div className="flex items-center justify-between text-xs sm:text-sm">
											<div className="flex items-center gap-2">
												<Users className="w-4 h-4 text-muted-foreground" />
												<span>{office.currentQueue} in queue</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="w-4 h-4 text-muted-foreground" />
												<span>{office.avgWaitTime}</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Step 2: Choose Service */}
					{step === 2 && (
						<div className="space-y-4">
							<div className="p-4 bg-muted rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<Building2 className="w-5 h-5 text-primary" />
									<span className="font-medium">
										{selectedOfficeData?.name}
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									{selectedOfficeData?.description}
								</p>
							</div>

							<div className="grid grid-cols-1 gap-3">
								{availableServices.map((service) => (
									<Card
										key={service.id}
										className={`cursor-pointer transition-all hover:shadow-md ${
											selectedService === service.id
												? "ring-2 ring-primary bg-primary/5"
												: ""
										}`}
										onClick={() => setSelectedService(service.id)}
									>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<FileText className="w-5 h-5 text-secondary" />
													<div>
														<h3 className="font-medium">{service.name}</h3>
														<p className="text-sm text-muted-foreground">
															Processing time: {service.time}
														</p>
													</div>
												</div>
												<Badge variant="outline">{service.fee}</Badge>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					)}

					{/* Step 3: Select Desk */}
					{step === 3 && (
						<div className="space-y-4">
							<div className="p-4 bg-muted rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<Building2 className="w-5 h-5 text-primary" />
									<span className="font-medium">
										{selectedOfficeData?.name}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FileText className="w-4 h-4 text-secondary" />
									<span className="text-sm text-muted-foreground">
										{selectedServiceData?.name}
									</span>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-3">
								{selectedOfficeData?.desks.map((desk) => (
									<Card
										key={desk.id}
										className={`cursor-pointer transition-all hover:shadow-md ${
											selectedDesk === desk.id.toString()
												? "ring-2 ring-primary bg-primary/5"
												: ""
										}`}
										onClick={() => setSelectedDesk(desk.id.toString())}
									>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Monitor className="w-5 h-5 text-secondary" />
													<div>
														<h3 className="font-medium">{desk.name}</h3>
														<p className="text-sm text-muted-foreground">
															{desk.staff}
														</p>
													</div>
												</div>
												<div className="flex flex-col items-end gap-1">
													<Badge
														variant={
															desk.status === "active"
																? "default"
																: desk.status === "break"
																? "secondary"
																: "outline"
														}
														className="text-xs"
													>
														{desk.status}
													</Badge>
													<div className="flex items-center gap-1 text-xs text-muted-foreground">
														<Users className="w-3 h-3" />
														<span>{desk.currentQueue} waiting</span>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					)}

					{/* Step 4: Check Credentials */}
					{step === 4 && (
						<div className="space-y-6">
							<div className="p-4 bg-muted rounded-lg">
								<p className="text-sm text-muted-foreground">
									Confirm your identity before issuing a same-day ticket.
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label className="text-sm">Name</Label>
									<div className="mt-1 px-3 py-2 border rounded text-sm bg-muted">
										Juan Dela Cruz
									</div>
								</div>
								<div>
									<Label className="text-sm">Student ID</Label>
									<div className="mt-1 px-3 py-2 border rounded text-sm bg-muted">
										2024-001234
									</div>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<input
									type="checkbox"
									id="confirm-creds"
									checked={credentialsConfirmed}
									onChange={(e) => setCredentialsConfirmed(e.target.checked)}
									className="mt-1"
								/>
								<Label htmlFor="confirm-creds" className="text-sm">
									I confirm my credentials are correct and up to date.
								</Label>
							</div>
						</div>
					)}

					{/* Step 5: Review & Confirm */}
					{step === 5 && (
						<div className="space-y-6">
							<div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
								<div className="space-y-4">
									<h3 className="font-semibold">Booking Details</h3>
									<div className="space-y-3">
										<div className="flex flex-col sm:flex-row sm:justify-between gap-1">
											<span className="text-muted-foreground">Office:</span>
											<span className="font-medium">
												{selectedOfficeData?.name}
											</span>
										</div>
										<div className="flex flex-col sm:flex-row sm:justify-between gap-1">
											<span className="text-muted-foreground">Service:</span>
											<span className="font-medium">
												{selectedServiceData?.name}
											</span>
										</div>
										<div className="flex flex-col sm:flex-row sm:justify-between gap-1">
											<span className="text-muted-foreground">Desk:</span>
											<span className="font-medium">
												{selectedDeskData?.name} - {selectedDeskData?.staff}
											</span>
										</div>
										<div className="flex flex-col sm:flex-row sm:justify-between gap-1">
											<span className="text-muted-foreground">
												Processing Time:
											</span>
											<span className="font-medium">
												{selectedServiceData?.time}
											</span>
										</div>
										<div className="flex flex-col sm:flex-row sm:justify-between gap-1">
											<span className="text-muted-foreground">Fee:</span>
											<span className="font-medium">
												{selectedServiceData?.fee}
											</span>
										</div>
										<div className="flex flex-col sm:flex-row sm:justify-between gap-1">
											<span className="text-muted-foreground">Validity:</span>
											<span className="font-medium">Today only</span>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="font-semibold">Important Reminders</h3>
									<div className="space-y-2 text-sm text-muted-foreground">
										<div className="flex items-start gap-2">
											<AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
											<span>
												Please arrive 10 minutes before your scheduled time
											</span>
										</div>
										<div className="flex items-start gap-2">
											<AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
											<span>Bring all required documents and valid ID</span>
										</div>
										<div className="flex items-start gap-2">
											<AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
											<span>
												You can cancel your ticket up to 1 hour before your
												appointment
											</span>
										</div>
										<div className="flex items-start gap-2">
											<AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
											<span>
												You will receive notifications when it's almost your
												turn
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Navigation Buttons */}
					<div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
						<Button
							onClick={handleBack}
							variant="outline"
							disabled={step === 1}
							className="bg-transparent order-2 sm:order-1"
						>
							Back
						</Button>

						{step < 5 ? (
							<Button
								onClick={handleNext}
								disabled={
									(step === 1 &&
										(!selectedOffice ||
											hasActiveTicket ||
											hasPendingEvaluation)) ||
									(step === 2 && !selectedService) ||
									(step === 3 && !selectedDesk) ||
									(step === 4 && !credentialsConfirmed)
								}
								className="gradient-primary text-white order-1 sm:order-2"
							>
								Next
							</Button>
						) : (
							<Button
								onClick={handleSubmit}
								disabled={hasActiveTicket || hasPendingEvaluation}
								className="gradient-primary text-white order-1 sm:order-2"
							>
								Get Ticket
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
