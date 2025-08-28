"use client";

import { useState, useEffect } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Star,
	MessageSquare,
	Send,
	Clock,
	ThumbsUp,
	ThumbsDown,
	AlertCircle,
	CheckCircle,
	User,
	Building2,
	FileText,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface EvaluationData {
	rating: number;
	comment: string;
	serviceQuality: number;
	waitingTime: number;
	staffCourtesy: number;
	overallExperience: number;
	office?: string;
	service?: string;
	date?: string;
}

interface RecentEvaluation {
	id: string;
	office: string;
	service: string;
	date: string;
	overallRating: number;
	comment: string;
	status: "pending" | "approved" | "rejected";
}

const mockRecentEvaluations: RecentEvaluation[] = [
	{
		id: "1",
		office: "Registrar Office",
		service: "Transcript Request",
		date: "2024-01-15",
		overallRating: 5,
		comment: "Excellent service! Staff was very helpful and efficient.",
		status: "approved",
	},
	{
		id: "2",
		office: "Cashier Office",
		service: "Tuition Payment",
		date: "2024-01-10",
		overallRating: 4,
		comment: "Good service, but waiting time could be improved.",
		status: "approved",
	},
];

export default function ServiceEvaluationPage() {
	const searchParams = useSearchParams();
	const [evaluationData, setEvaluationData] = useState<EvaluationData>({
		rating: 0,
		comment: "",
		serviceQuality: 5,
		waitingTime: 5,
		staffCourtesy: 5,
		overallExperience: 5,
		office: "",
		service: "",
		date: new Date().toISOString().split("T")[0],
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [transactionCompleted, setTransactionCompleted] = useState(false);
	const [hasPendingEvaluation, setHasPendingEvaluation] = useState(false);

	// Transaction-specific data from QR code
	const [transactionInfo, setTransactionInfo] = useState<{
		transactionId: string;
		office: string;
		service: string;
		ticketNumber: string;
	} | null>(null);

	// Extract transaction data from URL parameters
	useEffect(() => {
		const txn = searchParams.get("txn");
		const office = searchParams.get("office");
		const service = searchParams.get("service");
		const ticket = searchParams.get("ticket");

		if (txn && office && service && ticket) {
			setTransactionInfo({
				transactionId: txn,
				office: decodeURIComponent(office),
				service: decodeURIComponent(service),
				ticketNumber: ticket,
			});

			// Pre-fill form with transaction data
			setEvaluationData((prev) => ({
				...prev,
				office: decodeURIComponent(office),
				service: decodeURIComponent(service),
				date: new Date().toISOString().split("T")[0],
			}));

			// Mark as transaction completed since we have transaction data
			setTransactionCompleted(true);
		}
	}, [searchParams]);

	const handleRatingChange = (category: string, value: number) => {
		setEvaluationData((prev) => ({
			...prev,
			[category]: value,
		}));
	};

	const handleInputChange = (field: string, value: string) => {
		setEvaluationData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log("Submitting evaluation:", evaluationData);

		// Log transaction-specific evaluation if available
		if (transactionInfo) {
			console.log("Transaction-specific evaluation:", {
				transactionId: transactionInfo.transactionId,
				ticketNumber: transactionInfo.ticketNumber,
				...evaluationData,
			});
		}

		setIsSubmitting(false);
		setShowSuccess(true);
		setTransactionCompleted(false);
		if (typeof window !== "undefined") {
			localStorage.setItem("equeue_hasPendingEvaluation", "false");
		}

		// Reset form
		setEvaluationData({
			rating: 0,
			comment: "",
			serviceQuality: 5,
			waitingTime: 5,
			staffCourtesy: 5,
			overallExperience: 5,
			office: "",
			service: "",
			date: new Date().toISOString().split("T")[0],
		});

		// Hide success message after 3 seconds
		setTimeout(() => setShowSuccess(false), 3000);
	};

	const handleTransactionComplete = () => {
		setTransactionCompleted(true);
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

	const renderStars = (
		rating: number,
		onChange: (value: number) => void,
		readonly: boolean = false
	) => {
		return (
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => !readonly && onChange(star)}
						disabled={readonly}
						className={`text-2xl transition-colors ${
							star <= rating ? "text-yellow-400" : "text-gray-300"
						} ${!readonly ? "hover:text-yellow-400" : ""} ${
							readonly ? "cursor-default" : "cursor-pointer"
						}`}
					>
						★
					</button>
				))}
			</div>
		);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800 border-green-200";
			case "rejected":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "approved":
				return <ThumbsUp className="w-4 h-4" />;
			case "rejected":
				return <ThumbsDown className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	if (showSuccess) {
		return (
			<div className="max-w-2xl mx-auto">
					<Card>
						<CardHeader className="text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<CheckCircle className="w-8 h-8 text-green-600" />
							</div>
							<CardTitle className="text-2xl">Evaluation Submitted!</CardTitle>
							<CardDescription>
								{transactionInfo
									? `Thank you for evaluating your ${transactionInfo.service} at ${transactionInfo.office}`
									: "Thank you for your valuable feedback"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{transactionInfo && (
								<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
									<div className="flex items-center gap-2 text-blue-800 mb-2">
										<FileText className="w-4 h-4" />
										<span className="font-medium">Transaction Details</span>
									</div>
									<div className="text-sm text-blue-700 space-y-1">
										<p>
											<strong>Ticket:</strong> {transactionInfo.ticketNumber}
										</p>
										<p>
											<strong>Service:</strong> {transactionInfo.service}
										</p>
										<p>
											<strong>Office:</strong> {transactionInfo.office}
										</p>
										<p>
											<strong>Transaction ID:</strong>{" "}
											{transactionInfo.transactionId}
										</p>
									</div>
								</div>
							)}

							<div className="text-center space-y-4">
								<p className="text-muted-foreground">
									Your feedback helps us improve our services. You can now get a
									new ticket when needed.
								</p>
								<div className="flex gap-4">
									<Button
										onClick={() => (window.location.href = "/customer")}
										className="gradient-primary text-white"
									>
										Back to Dashboard
									</Button>
									<Button
										onClick={() => (window.location.href = "/customer/book")}
										variant="outline"
									>
										Get New Ticket
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
			</div>
		);
	}

	// Only allow evaluation when linked to a completed transaction
	if (!transactionInfo) {
		return (
			<div className="max-w-2xl mx-auto space-y-6">
					<Card className="border-2 border-blue-200 bg-blue-50">
						<CardHeader>
							<CardTitle className="text-blue-900">
								Evaluation Available After Transaction
							</CardTitle>
							<CardDescription className="text-blue-800">
								Evaluation forms are only available right after a successful
								queuing/transaction. Please scan the QR code shown by staff or
								open the evaluation link provided at completion.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{hasPendingEvaluation ? (
								<div className="p-3 rounded border border-yellow-300 bg-yellow-50 text-yellow-800">
									You still have a pending evaluation from your last
									transaction. Please use the QR code you received to complete
									it before getting a new ticket.
								</div>
							) : (
								<div className="text-sm text-blue-800">
									No active transaction detected. You can submit general
									feedback anytime from the Feedback page.
								</div>
							)}
							<div className="flex gap-3">
								<Button
									onClick={() => (window.location.href = "/customer/feedback")}
									variant="outline"
									className="border-blue-300"
								>
									Go to Feedback
								</Button>
								<Button
									onClick={() => (window.location.href = "/customer")}
									className="gradient-primary text-white"
								>
									Back to Dashboard
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="border-2 border-gray-200">
						<CardHeader>
							<CardTitle className="text-[#071952]">
								What’s the difference?
							</CardTitle>
							<CardDescription className="text-gray-700">
								Feedback can be submitted anytime. Evaluations are required only
								after a completed service.
							</CardDescription>
						</CardHeader>
						<CardContent className="text-sm text-gray-700">
							<ul className="list-disc pl-5 space-y-1">
								<li>Use Feedback to share suggestions or issues anytime.</li>
								<li>
									Use Evaluation right after your transaction via the QR/link.
								</li>
							</ul>
						</CardContent>
					</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
				{/* Transaction Info Banner */}
				{transactionInfo && (
					<Card className="border-2 border-blue-200 bg-blue-50">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
									<FileText className="w-5 h-5 text-blue-600" />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="font-semibold text-blue-800">
											Transaction-Specific Evaluation
										</h3>
										<Badge className="bg-blue-100 text-blue-800">
											Linked to Service
										</Badge>
									</div>
									<div className="text-sm text-blue-700 space-y-1">
										<p>
											<strong>Ticket:</strong> {transactionInfo.ticketNumber} |{" "}
											<strong>Service:</strong> {transactionInfo.service}
										</p>
										<p>
											<strong>Office:</strong> {transactionInfo.office} |{" "}
											<strong>Transaction:</strong>{" "}
											{transactionInfo.transactionId}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Pending Evaluation Warning */}
				{hasPendingEvaluation && (
					<Card className="border-2 border-yellow-200 bg-yellow-50">
						<CardContent className="p-4">
							<div className="flex items-center gap-2 text-yellow-800">
								<AlertCircle className="w-5 h-5" />
								<span className="font-medium">
									You have a pending evaluation from your last transaction.
									Please complete it to get a new ticket.
								</span>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Main Evaluation Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Star className="w-5 h-5" />
							Service Evaluation Form
						</CardTitle>
						<CardDescription>
							{transactionInfo
								? `Please rate your experience with ${transactionInfo.service} at ${transactionInfo.office}`
								: "Please rate your overall service experience"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Transaction Details Display */}
						{transactionInfo && (
							<div className="p-4 bg-gray-50 rounded-lg border">
								<h4 className="font-medium mb-3 flex items-center gap-2">
									<FileText className="w-4 h-4" />
									Service Details
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div className="flex items-center gap-2">
										<User className="w-4 h-4 text-muted-foreground" />
										<span>
											<strong>Ticket:</strong> {transactionInfo.ticketNumber}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Building2 className="w-4 h-4 text-muted-foreground" />
										<span>
											<strong>Office:</strong> {transactionInfo.office}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<FileText className="w-4 h-4 text-muted-foreground" />
										<span>
											<strong>Service:</strong> {transactionInfo.service}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4 text-muted-foreground" />
										<span>
											<strong>Date:</strong> {evaluationData.date}
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Service Information */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium text-[#071952]">
									Office/Department
								</Label>
								<input
									type="text"
									value={evaluationData.office}
									onChange={(e) => handleInputChange("office", e.target.value)}
									placeholder="e.g., Registrar Office"
									className="w-full px-3 py-2 border-2 border-[#37B7C3] rounded-md focus:outline-none focus:border-[#088395]"
									suppressHydrationWarning
								/>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium text-[#071952]">
									Service Type
								</Label>
								<input
									type="text"
									value={evaluationData.service}
									onChange={(e) => handleInputChange("service", e.target.value)}
									placeholder="e.g., Transcript Office"
									className="w-full px-3 py-2 border-2 border-[#37B7C3] rounded-md focus:outline-none focus:border-[#088395]"
									suppressHydrationWarning
								/>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium text-[#071952]">
									Service Date
								</Label>
								<input
									type="date"
									value={evaluationData.date}
									onChange={(e) => handleInputChange("date", e.target.value)}
									className="w-full px-3 py-2 border-2 border-[#37B7C3] rounded-md focus:outline-none focus:border-[#088395]"
									suppressHydrationWarning
								/>
							</div>
						</div>

						{/* Rating Categories */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
								<p className="text-xs text-gray-500">
									How satisfied are you with the quality of service received?
								</p>
							</div>

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
								<p className="text-xs text-gray-500">
									How satisfied are you with the waiting time?
								</p>
							</div>

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
								<p className="text-xs text-gray-500">
									How satisfied are you with staff politeness and helpfulness?
								</p>
							</div>

							<div className="space-y-3">
								<Label className="text-sm font-medium text-[#071952]">
									Overall Experience
								</Label>
								<div className="flex items-center justify-between">
									{renderStars(evaluationData.overallExperience, (value) =>
										handleRatingChange("overallExperience", value)
									)}
									<span className="text-sm text-gray-600 font-medium">
										{evaluationData.overallExperience}/5
									</span>
								</div>
								<p className="text-xs text-gray-500">
									How would you rate your overall experience?
								</p>
							</div>
						</div>

						{/* Additional Comments */}
						<div className="space-y-3">
							<Label className="text-sm font-medium text-[#071952]">
								Additional Comments
							</Label>
							<Textarea
								placeholder="Please share your thoughts, suggestions, or any specific feedback about your experience..."
								value={evaluationData.comment}
								onChange={(e) => handleInputChange("comment", e.target.value)}
								className="min-h-[120px] border-2 border-[#37B7C3] focus:border-[#088395]"
								suppressHydrationWarning
							/>
							<p className="text-xs text-gray-500">
								Your feedback helps us identify areas for improvement and
								recognize staff excellence.
							</p>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button
								onClick={handleSubmit}
								disabled={
									isSubmitting || evaluationData.overallExperience === 0
								}
								className="gradient-primary text-white font-medium px-8 py-2"
							>
								{isSubmitting ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
										Submitting...
									</>
								) : (
									<>
										<Send className="w-4 h-4 mr-2" />
										Submit Evaluation
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Recent Evaluations */}
				<Card className="border-2 border-gray-200">
					<CardHeader>
						<CardTitle className="text-[#071952]">
							Your Recent Evaluations
						</CardTitle>
						<CardDescription className="text-gray-700">
							Track your submitted feedback and their status
						</CardDescription>
					</CardHeader>
					<CardContent>
						{mockRecentEvaluations.length > 0 ? (
							<div className="space-y-4">
								{mockRecentEvaluations.map((evaluation) => (
									<div
										key={evaluation.id}
										className="p-4 border-2 border-[#37B7C3] rounded-lg bg-gradient-to-r from-[#EBF4F6] to-white"
									>
										<div className="flex items-start justify-between mb-3">
											<div>
												<h4 className="font-semibold text-[#071952]">
													{evaluation.office}
												</h4>
												<p className="text-sm text-gray-700">
													{evaluation.service}
												</p>
												<p className="text-xs text-gray-500">
													{evaluation.date}
												</p>
											</div>
											<div className="flex items-center gap-2">
												{renderStars(evaluation.overallRating, () => {}, true)}
												<Badge
													className={`${getStatusColor(
														evaluation.status
													)} border-2`}
												>
													<div className="flex items-center gap-1">
														{getStatusIcon(evaluation.status)}
														{evaluation.status.charAt(0).toUpperCase() +
															evaluation.status.slice(1)}
													</div>
												</Badge>
											</div>
										</div>
										{evaluation.comment && (
											<div className="bg-white p-3 rounded border border-gray-200">
												<p className="text-sm text-gray-800 italic">
													"{evaluation.comment}"
												</p>
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-600 mb-2">
									No evaluations yet
								</h3>
								<p className="text-gray-500">
									Submit your first evaluation to see it here
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Evaluation Guidelines */}
				<Card className="border-2 border-blue-200 bg-blue-50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-blue-800">
							<AlertCircle className="w-5 h-5" />
							Evaluation Guidelines
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 text-sm text-blue-800">
							<div className="flex items-start gap-2">
								<span className="font-medium">•</span>
								<span>Be honest and constructive in your feedback</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="font-medium">•</span>
								<span>
									Focus on the service experience, not personal matters
								</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="font-medium">•</span>
								<span>Your feedback is anonymous and confidential</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="font-medium">•</span>
								<span>We review all feedback to improve our services</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="font-medium">•</span>
								<span className="font-semibold">
									Evaluation is automatically requested after every completed
									transaction
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
		</div>
	);
}
