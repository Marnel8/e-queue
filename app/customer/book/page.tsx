"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/customer/layout";
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
} from "lucide-react";

const offices = [
	{
		id: "registrar",
		name: "Registrar Office",
		description: "Student records and enrollment services",
		currentQueue: 8,
		avgWaitTime: "6.2 minutes",
		status: "Open",
	},
	{
		id: "cashier",
		name: "Cashier Office",
		description: "Payment processing and financial services",
		currentQueue: 5,
		avgWaitTime: "4.8 minutes",
		status: "Open",
	},
	{
		id: "student-affairs",
		name: "Student Affairs Office",
		description: "Student support and welfare services",
		currentQueue: 12,
		avgWaitTime: "12.3 minutes",
		status: "Open",
	},
	{
		id: "library",
		name: "Library Services",
		description: "Library resources and research support",
		currentQueue: 3,
		avgWaitTime: "3.1 minutes",
		status: "Open",
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
};

export default function BookTicket() {
	const [step, setStep] = useState(1);
	const [selectedOffice, setSelectedOffice] = useState("");
	const [selectedService, setSelectedService] = useState("");
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

	const handleNext = () => {
		if (step < 4) setStep(step + 1);
	};

	const handleBack = () => {
		if (step > 1) setStep(step - 1);
	};

	const handleSubmit = () => {
		// TODO: Implement ticket issuance (same-day, single active ticket policy)
		console.log("Issuing same-day ticket:", {
			office: selectedOffice,
			service: selectedService,
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
			<CustomerLayout
				title="Ticket Issued"
				description="Your same-day queue ticket has been created"
			>
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
									</div>
									<div className="text-sm text-muted-foreground">
										<p>Valid: Today only</p>
									</div>
								</div>
							</div>

							<div className="text-center space-y-4">
								<p className="text-muted-foreground">
									Arrive promptly when notified. Tickets are non-transferable
									and expire end of day.
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
			</CustomerLayout>
		);
	}

	return (
		<CustomerLayout
			title="Get Ticket"
			description="Select office and service to get a same-day ticket"
		>
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
							{[1, 2, 3, 4].map((stepNumber) => (
								<div
									key={stepNumber}
									className="flex items-center flex-shrink-0"
								>
									<div
										className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${
											step >= stepNumber
												? "bg-primary text-primary-foreground"
												: "bg-muted text-muted-foreground border"
										}`}
									>
										{stepNumber}
									</div>
									{stepNumber < 4 && (
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
							Step {step} of 4:{" "}
							{step === 1
								? "Select Office"
								: step === 2
								? "Choose Service"
								: step === 3
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
							{step === 3 && "Check Credentials"}
							{step === 4 && "Review & Confirm"}
						</CardTitle>
						<CardDescription>
							{step === 1 && "Choose the office you need to visit"}
							{step === 2 && "Select the service you require"}
							{step === 3 && "Confirm your identity to proceed"}
							{step === 4 && "Review your ticket details"}
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

						{/* Step 3: Check Credentials */}
						{step === 3 && (
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

						{/* Step 4: Review & Confirm */}
						{step === 4 && (
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

							{step < 4 ? (
								<Button
									onClick={handleNext}
									disabled={
										(step === 1 &&
											(!selectedOffice ||
												hasActiveTicket ||
												hasPendingEvaluation)) ||
										(step === 2 && !selectedService) ||
										(step === 3 && !credentialsConfirmed)
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
		</CustomerLayout>
	);
}
