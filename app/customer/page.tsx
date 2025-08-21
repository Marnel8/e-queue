"use client";

import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/customer/layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Clock,
	MapPin,
	Calendar,
	Users,
	AlertCircle,
	CheckCircle,
	Download,
	X,
	Ticket,
	Building2,
	Star,
	MessageSquare,
	Send,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ViolationsDisplay } from "@/components/ui/violations-display";
import QRCode from "react-qr-code";

const currentTicket = {
	ticketNumber: "A015",
	office: "Registrar Office",
	service: "Transcript Request",
	bookedTime: "10:30 AM",
	estimatedWait: "15 minutes",
	position: 3,
	totalInQueue: 8,
	status: "Waiting",
	fee: "₱0.00",
	requirements: ["Valid ID", "Request Form", "Payment Receipt"],
};

const upcomingTickets: any[] = [];

export default function CustomerDashboard() {
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [showEvaluationForm, setShowEvaluationForm] = useState(false);
	const [transactionCompleted, setTransactionCompleted] = useState(false);
	const [hasPendingEvaluation, setHasPendingEvaluation] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const [evaluationData, setEvaluationData] = useState({
		rating: 0,
		comment: "",
		serviceQuality: 5,
		waitingTime: 5,
		staffCourtesy: 5,
		overallExperience: 5,
	});

	const handleCancelTicket = () => {
		// TODO: Implement cancel ticket logic
		console.log(
			"Cancelling ticket:",
			currentTicket.ticketNumber,
			"Reason:",
			cancelReason
		);
		setShowCancelDialog(false);
		setCancelReason("");
	};

	const handleDownloadTicket = () => {
		// TODO: Implement download ticket logic
		console.log("Downloading ticket:", currentTicket.ticketNumber);
	};

	const handleEvaluationSubmit = () => {
		// TODO: Implement evaluation submission logic
		console.log("Submitting evaluation:", evaluationData);
		setShowEvaluationForm(false);
		setTransactionCompleted(false);

		// Clear pending evaluation state
		if (typeof window !== "undefined") {
			localStorage.removeItem("equeue_hasPendingEvaluation");
		}
		setHasPendingEvaluation(false);

		// Reset evaluation form data
		setEvaluationData({
			rating: 0,
			comment: "",
			serviceQuality: 5,
			waitingTime: 5,
			staffCourtesy: 5,
			overallExperience: 5,
		});
	};

	const handleTransactionComplete = () => {
		setTransactionCompleted(true);
		setShowEvaluationForm(true);
	};

	// Simulate evaluation non-compliance: user skips evaluation after completion
	const handleSkipEvaluation = () => {
		setShowEvaluationForm(false);
		setTransactionCompleted(false);
		if (typeof window !== "undefined") {
			localStorage.setItem("equeue_hasPendingEvaluation", "true");
			const raw = localStorage.getItem("equeue_violations") || "[]";
			try {
				const list = JSON.parse(raw);
				list.push({
					id: Date.now(),
					type: "evaluation_non_compliance",
					when: new Date().toISOString(),
					detail: "Evaluation not completed after transaction",
				});
				localStorage.setItem("equeue_violations", JSON.stringify(list));
			} catch {
				localStorage.setItem(
					"equeue_violations",
					JSON.stringify([
						{
							id: Date.now(),
							type: "evaluation_non_compliance",
							when: new Date().toISOString(),
							detail: "Evaluation not completed after transaction",
						},
					])
				);
			}
		}
	};

	// Generate QR code data for evaluation
	const generateQRCodeData = () => {
		const qrData = {
			type: "service_evaluation",
			ticketNumber: currentTicket?.ticketNumber || "A015",
			office: "Registrar Office",
			service: currentTicket?.service || "General Service",
			timestamp: new Date().toISOString(),
			evaluationUrl: `${window.location.origin}/customer/evaluation?ticket=${
				currentTicket?.ticketNumber || "A015"
			}`,
		};
		return JSON.stringify(qrData);
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		// Only show pending evaluation if it's explicitly set to true
		// Default state should be no pending evaluation
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

	// Clear any existing pending evaluation on component mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			// Clear any existing pending evaluation flag on page load
			// This ensures the warning only appears when explicitly triggered
			localStorage.removeItem("equeue_hasPendingEvaluation");
			setHasPendingEvaluation(false);
		}
	}, []);

	const handleRatingChange = (category: string, value: number) => {
		setEvaluationData((prev) => ({
			...prev,
			[category]: value,
		}));
	};

	const renderStars = (rating: number, onChange: (value: number) => void) => {
		return (
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => onChange(star)}
						className={`text-2xl transition-colors ${
							star <= rating ? "text-yellow-400" : "text-gray-300"
						} hover:text-yellow-400`}
					>
						★
					</button>
				))}
			</div>
		);
	};

	return (
		<CustomerLayout
			title="My Queue"
			description="Monitor your queue status and manage tickets"
		>
			<div className="space-y-6">
				{hasPendingEvaluation && (
					<div className="p-4 border-2 border-yellow-300 bg-yellow-50 rounded">
						<p className="text-sm text-yellow-800 font-medium">
							Evaluation pending for your last transaction. You cannot get a new
							ticket until you submit it.
						</p>

						{/* QR Code Display for Evaluation */}
						<div className="mt-4 p-4 bg-white rounded-lg border-2 border-yellow-200">
							<h4 className="font-semibold mb-3 text-yellow-800 text-center">
								Scan QR Code to Complete Evaluation
							</h4>
							<div className="text-center">
								<div className="w-48 h-48 bg-white rounded-lg border-2 border-yellow-300 mx-auto mb-4 flex items-center justify-center p-4">
									<QRCode value={generateQRCodeData()} size={160} level="H" />
								</div>
								<p className="text-sm text-yellow-700 font-medium mb-2">
									Service Evaluation QR Code
								</p>
								<p className="text-xs text-yellow-600 mb-3">
									Scan this QR code to complete your service evaluation
								</p>
								<Button
									onClick={() => setShowEvaluationForm(true)}
									className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium"
								>
									<CheckCircle className="w-4 h-4 mr-2" />
									Complete Evaluation Now
								</Button>
							</div>
						</div>
					</div>
				)}
				{/* Current Ticket Status */}
				{currentTicket && (
					<Card className="border-2 border-[#071952] bg-gradient-to-br from-[#EBF4F6] to-white shadow-lg">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2 text-[#071952]">
									<Ticket className="w-5 h-5 text-[#071952]" />
									Current Ticket
								</CardTitle>
								<Badge className="bg-[#088395] text-white font-medium px-3 py-1">
									{currentTicket.status}
								</Badge>
							</div>
							<CardDescription className="text-gray-700">
								You are currently in queue
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Ticket Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="text-center">
										<div className="text-4xl font-bold text-[#071952] mb-2 bg-white px-4 py-2 rounded-lg border-2 border-[#37B7C3]">
											{currentTicket.ticketNumber}
										</div>
										<p className="text-gray-700 font-medium">
											Your Ticket Number
										</p>
									</div>

									<div className="space-y-3">
										<div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
											<Building2 className="w-4 h-4 text-[#088395]" />
											<span className="text-gray-800 font-medium">
												{currentTicket.office}
											</span>
										</div>
										<div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
											<MapPin className="w-4 h-4 text-[#088395]" />
											<span className="text-gray-800 font-medium">
												{currentTicket.service}
											</span>
										</div>
										<div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
											<Calendar className="w-4 h-4 text-[#088395]" />
											<span className="text-gray-800 font-medium">
												Booked for {currentTicket.bookedTime}
											</span>
										</div>
										<div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
											<Clock className="w-4 h-4 text-[#088395]" />
											<span className="text-gray-800 font-medium">
												Estimated wait: {currentTicket.estimatedWait}
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									{/* Queue Position */}
									<div className="text-center p-6 bg-gradient-to-br from-[#37B7C3] to-[#088395] text-white rounded-lg border-2 border-[#071952] shadow-md">
										<div className="text-3xl font-bold mb-1">
											{currentTicket.position}
										</div>
										<p className="text-sm opacity-90 font-medium">
											Position in queue
										</p>
										<div className="mt-4">
											<Progress
												value={
													(currentTicket.position /
														currentTicket.totalInQueue) *
													100
												}
												className="h-3 bg-white/20"
											/>
											<p className="text-xs mt-2 opacity-90">
												{currentTicket.position} of {currentTicket.totalInQueue}{" "}
												customers
											</p>
										</div>
									</div>

									{/* Requirements */}
									<div className="bg-white p-4 rounded-lg border-2 border-gray-200">
										<h4 className="font-semibold mb-3 text-[#071952]">
											Required Documents
										</h4>
										<div className="space-y-2">
											{currentTicket.requirements.map((req, index) => (
												<div
													key={index}
													className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded border border-green-200"
												>
													<CheckCircle className="w-4 h-4 text-green-600" />
													<span className="text-gray-800 font-medium">
														{req}
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex flex-wrap gap-3">
								<Button
									onClick={handleDownloadTicket}
									className="flex-1 gradient-primary text-white font-medium"
								>
									<Download className="w-4 h-4 mr-2" />
									Download Ticket
								</Button>
								<Button
									onClick={() => setShowCancelDialog(true)}
									className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
								>
									<X className="w-4 h-4 mr-2" />
									Cancel Ticket
								</Button>
							</div>

							{/* Live Updates */}
							<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
									<span className="text-sm font-semibold text-[#071952]">
										Live Updates
									</span>
								</div>
								<div className="space-y-2 text-sm text-gray-800">
									<p className="font-medium">• Currently serving: A012</p>
									<p className="font-medium">
										• Average service time: 6 minutes
									</p>
									<p className="font-medium">
										• Your estimated call time: 10:45 AM
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* No Active Ticket */}
				{!currentTicket && (
					<Card className="border-2 border-gray-200">
						<CardContent className="text-center py-12">
							<AlertCircle className="w-16 h-16 text-[#088395] mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2 text-[#071952]">
								No Active Ticket
							</h3>
							<p className="text-gray-700 mb-6">
								You don't have any active queue tickets at the moment.
							</p>
							<Button className="gradient-primary text-white font-medium px-6 py-2">
								<Calendar className="w-4 h-4 mr-2" />
								Book New Ticket
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Upcoming Tickets */}
				{upcomingTickets.length > 0 && (
					<Card className="border-2 border-gray-200">
						<CardHeader>
							<CardTitle className="text-[#071952]">Upcoming Tickets</CardTitle>
							<CardDescription className="text-gray-700">
								Your scheduled appointments
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{upcomingTickets.map((ticket) => (
									<div
										key={ticket.id}
										className="flex items-center justify-between p-4 border-2 border-[#37B7C3] rounded-lg bg-gradient-to-r from-[#EBF4F6] to-white"
									>
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 bg-[#088395] rounded-full flex items-center justify-center">
												<Ticket className="w-6 h-6 text-white" />
											</div>
											<div>
												<p className="font-semibold text-[#071952]">
													{ticket.ticketNumber}
												</p>
												<p className="text-sm text-gray-700 font-medium">
													{ticket.office} - {ticket.service}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-semibold text-[#071952]">
												{ticket.date} at {ticket.time}
											</p>
											<Badge className="bg-[#37B7C3] text-white font-medium">
												{ticket.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Transaction Completion & Evaluation Flow */}
				{transactionCompleted ? (
					<Card className="border-2 border-green-200 bg-green-50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-green-800">
								<CheckCircle className="w-5 h-5 text-green-600" />
								Step 5: Service Evaluation
							</CardTitle>
							<CardDescription className="text-green-700">
								Transaction completed! This is the final step - please rate your
								experience to complete your service journey.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-center py-6">
								<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<CheckCircle className="w-10 h-10 text-green-600" />
								</div>
								<h3 className="text-lg font-semibold mb-2 text-green-800">
									Service Successfully Completed
								</h3>
								<p className="text-green-700 mb-4">
									Your transaction has been processed. We'd love to hear about
									your experience!
								</p>

								{/* QR Code Display for Immediate Evaluation */}
								<div className="mb-6 p-4 bg-white rounded-lg border-2 border-green-200">
									<h4 className="font-semibold mb-3 text-green-800">
										Scan QR Code for Evaluation
									</h4>
									<div className="text-center">
										<div className="w-48 h-48 bg-white rounded-lg border-2 border-green-300 mx-auto mb-4 flex items-center justify-center p-4">
											<QRCode
												value={generateQRCodeData()}
												size={160}
												level="H"
											/>
										</div>
										<p className="text-sm text-green-700 font-medium mb-2">
											Service Evaluation QR Code
										</p>
										<p className="text-xs text-green-600 mb-3">
											Scan this QR code to complete your service evaluation
										</p>
									</div>
								</div>

								<Button
									onClick={() => setShowEvaluationForm(true)}
									className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2"
								>
									<Star className="w-4 h-4 mr-2" />
									Rate Your Experience
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="border-2 border-[#37B7C3] bg-gradient-to-br from-[#EBF4F6] to-white">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-[#071952]">
								<MessageSquare className="w-5 h-5 text-[#088395]" />
								Service Evaluation
							</CardTitle>
							<CardDescription className="text-gray-700">
								Help us improve by rating your recent service experience
							</CardDescription>
						</CardHeader>
						<CardContent>
							{!showEvaluationForm ? (
								<div className="text-center py-8">
									<Star className="w-16 h-16 text-[#088395] mx-auto mb-4" />
									<h3 className="text-xl font-semibold mb-2 text-[#071952]">
										Rate Your Experience
									</h3>
									<p className="text-gray-700 mb-6">
										Your feedback helps us provide better service to all
										customers
									</p>
									<div className="space-y-3">
										<Button
											onClick={() => setShowEvaluationForm(true)}
											className="gradient-primary text-white font-medium px-6 py-2"
										>
											<MessageSquare className="w-4 h-4 mr-2" />
											Start Evaluation
										</Button>
										<Button
											onClick={handleSkipEvaluation}
											variant="outline"
											className="text-red-700 border-red-300 hover:bg-red-50"
										>
											Skip Evaluation (Simulate Non-Compliance)
										</Button>
										<div className="text-xs text-gray-500">
											Or simulate a completed transaction to see the automatic
											flow
										</div>
										<Button
											onClick={handleTransactionComplete}
											variant="outline"
											size="sm"
											className="text-[#071952] border-[#37B7C3] hover:bg-[#EBF4F6]"
										>
											Simulate Transaction Complete
										</Button>
									</div>
								</div>
							) : (
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Service Quality */}
										<div className="space-y-3">
											<Label className="text-sm font-medium text-[#071952]">
												Service Quality
											</Label>
											<div className="flex items-center justify-between">
												{renderStars(evaluationData.serviceQuality, (value) =>
													handleRatingChange("serviceQuality", value)
												)}
												<span className="text-sm text-gray-600 font-medium">
													{evaluationData.serviceQuality}/5
												</span>
											</div>
										</div>

										{/* Waiting Time */}
										<div className="space-y-3">
											<Label className="text-sm font-medium text-[#071952]">
												Waiting Time
											</Label>
											<div className="flex items-center justify-between">
												{renderStars(evaluationData.waitingTime, (value) =>
													handleRatingChange("waitingTime", value)
												)}
												<span className="text-sm text-gray-600 font-medium">
													{evaluationData.waitingTime}/5
												</span>
											</div>
										</div>

										{/* Staff Courtesy */}
										<div className="space-y-3">
											<Label className="text-sm font-medium text-[#071952]">
												Staff Courtesy
											</Label>
											<div className="flex items-center justify-between">
												{renderStars(evaluationData.staffCourtesy, (value) =>
													handleRatingChange("staffCourtesy", value)
												)}
												<span className="text-sm text-gray-600 font-medium">
													{evaluationData.staffCourtesy}/5
												</span>
											</div>
										</div>

										{/* Overall Experience */}
										<div className="space-y-3">
											<Label className="text-sm font-medium text-[#071952]">
												Overall Experience
											</Label>
											<div className="flex items-center justify-between">
												{renderStars(
													evaluationData.overallExperience,
													(value) =>
														handleRatingChange("overallExperience", value)
												)}
												<span className="text-sm text-gray-600 font-medium">
													{evaluationData.overallExperience}/5
												</span>
											</div>
										</div>
									</div>

									{/* Additional Comments */}
									<div className="space-y-3">
										<Label className="text-sm font-medium text-[#071952]">
											Additional Comments (Optional)
										</Label>
										<Textarea
											placeholder="Share your thoughts about the service, staff, or any suggestions for improvement..."
											value={evaluationData.comment}
											onChange={(e) =>
												setEvaluationData((prev) => ({
													...prev,
													comment: e.target.value,
												}))
											}
											className="min-h-[100px] border-2 border-[#37B7C3] focus:border-[#088395]"
											suppressHydrationWarning
										/>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-3">
										<Button
											onClick={() => setShowEvaluationForm(false)}
											variant="outline"
											className="flex-1 border-2 border-[#37B7C3] text-[#071952] hover:bg-[#EBF4F6]"
										>
											Cancel
										</Button>
										<Button
											onClick={handleEvaluationSubmit}
											className="flex-1 gradient-primary text-white font-medium"
										>
											<Send className="w-4 h-4 mr-2" />
											Submit Evaluation
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{/* Account Violations */}
				<ViolationsDisplay userRole="customer" showActions={false} />

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#37B7C3] hover:border-[#088395] bg-gradient-to-br from-white to-[#EBF4F6]">
						<CardContent className="p-6 text-center">
							<Calendar className="w-12 h-12 text-[#088395] mx-auto mb-4" />
							<h3 className="font-semibold mb-2 text-[#071952]">
								Book New Ticket
							</h3>
							<p className="text-sm text-gray-700">
								Get a same-day ticket only
							</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#37B7C3] hover:border-[#088395] bg-gradient-to-br from-white to-[#EBF4F6]">
						<CardContent className="p-6 text-center">
							<Building2 className="w-12 h-12 text-[#088395] mx-auto mb-4" />
							<h3 className="font-semibold mb-2 text-[#071952]">
								Browse Offices
							</h3>
							<p className="text-sm text-gray-700">
								View available offices and services
							</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#37B7C3] hover:border-[#088395] bg-gradient-to-br from-white to-[#EBF4F6]">
						<CardContent className="p-6 text-center">
							<Users className="w-12 h-12 text-[#088395] mx-auto mb-4" />
							<h3 className="font-semibold mb-2 text-[#071952]">
								Queue Status
							</h3>
							<p className="text-sm text-gray-700">
								Check current queue lengths
							</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#37B7C3] hover:border-[#088395] bg-gradient-to-br from-white to-[#EBF4F6]">
						<CardContent className="p-6 text-center">
							<MessageSquare className="w-12 h-12 text-[#088395] mx-auto mb-4" />
							<h3 className="font-semibold mb-2 text-[#071952]">
								Service Evaluation
							</h3>
							<p className="text-sm text-gray-700">
								Rate your service experience
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Cancel Confirmation Dialog */}
				{showCancelDialog && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<Card className="w-full max-w-md mx-4 border-2 border-red-200">
							<CardHeader className="bg-red-50">
								<CardTitle className="flex items-center gap-2 text-red-700">
									<AlertCircle className="w-5 h-5 text-red-600" />
									Cancel Ticket
								</CardTitle>
								<CardDescription className="text-red-600">
									Are you sure you want to cancel your ticket?
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
									<Label className="text-sm font-medium text-[#071952]">
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
										onClick={handleCancelTicket}
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
		</CustomerLayout>
	);
}
