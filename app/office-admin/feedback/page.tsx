"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Plus,
	MessageSquare,
	Star,
	TrendingUp,
	Edit,
	Trash2,
	Eye,
	QrCode,
	Download,
	RefreshCw,
	Hash,
} from "lucide-react";
import QRCode from "qrcode";

export default function FeedbackFormsPage() {
	const [activeTab, setActiveTab] = useState("forms");
	const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
	const [selectedTransaction, setSelectedTransaction] = useState("");
	const [generatedQRs, setGeneratedQRs] = useState<
		Array<{
			id: string;
			transactionId: string;
			customerName: string;
			office: string;
			service: string;
			qrUrl: string;
			generatedAt: string;
			isUsed: boolean;
		}>
	>([]);

	const [pendingEvaluations] = useState([
		{
			id: "A016",
			name: "Juan Dela Cruz",
			office: "Registrar",
			service: "Transcript Request",
		},
		{
			id: "B045",
			name: "Maria Santos",
			office: "Cashier",
			service: "Tuition Payment",
		},
	]);

	// Mock recent transactions for QR generation
	const recentTransactions = [
		{
			id: "TXN-001",
			customerName: "Juan Dela Cruz",
			office: "Registrar Office",
			service: "Transcript Request",
			completedAt: "2024-01-20 10:30 AM",
			ticketNumber: "A016",
		},
		{
			id: "TXN-002",
			customerName: "Maria Santos",
			office: "Cashier Office",
			service: "Tuition Payment",
			completedAt: "2024-01-20 11:15 AM",
			ticketNumber: "B045",
		},
		{
			id: "TXN-003",
			customerName: "Pedro Garcia",
			office: "Student Affairs",
			service: "Enrollment",
			completedAt: "2024-01-20 09:45 AM",
			ticketNumber: "C023",
		},
	];

	const feedbackForms = [
		{
			id: 1,
			title: "Service Quality Assessment",
			description: "Evaluate overall service quality and staff performance",
			questions: 8,
			responses: 245,
			avgRating: 4.2,
			status: "active",
			createdAt: "2024-01-15",
		},
		{
			id: 2,
			title: "Wait Time Feedback",
			description: "Assess customer satisfaction with waiting times",
			questions: 5,
			responses: 189,
			avgRating: 3.8,
			status: "active",
			createdAt: "2024-01-10",
		},
		{
			id: 3,
			title: "Facility Cleanliness",
			description: "Rate the cleanliness and comfort of office facilities",
			questions: 6,
			responses: 156,
			avgRating: 4.5,
			status: "draft",
			createdAt: "2024-01-08",
		},
	];

	const recentFeedback = [
		{
			id: 1,
			customerName: "John Doe",
			office: "Registrar Office",
			service: "Transcript Request",
			rating: 5,
			comment: "Excellent service! Very efficient and helpful staff.",
			date: "2024-01-20",
		},
		{
			id: 2,
			customerName: "Jane Smith",
			office: "Cashier Office",
			service: "Tuition Payment",
			rating: 4,
			comment: "Good service, but waiting time could be improved.",
			date: "2024-01-19",
		},
	];

	const handleGenerateTransactionQR = async () => {
		if (!selectedTransaction) return;

		const transaction = recentTransactions.find(
			(t) => t.id === selectedTransaction
		);
		if (!transaction) return;

		// Create unique evaluation URL with transaction ID
		const evaluationUrl = `${window.location.origin}/customer/evaluation?txn=${
			transaction.id
		}&office=${encodeURIComponent(
			transaction.office
		)}&service=${encodeURIComponent(transaction.service)}&ticket=${
			transaction.ticketNumber
		}`;

		try {
			const qrDataUrl = await QRCode.toDataURL(evaluationUrl, {
				width: 256,
				margin: 2,
				color: {
					dark: "#071952",
					light: "#FFFFFF",
				},
			});

			const newQR = {
				id: `qr-${Date.now()}`,
				transactionId: transaction.id,
				customerName: transaction.customerName,
				office: transaction.office,
				service: transaction.service,
				qrUrl: qrDataUrl,
				generatedAt: new Date().toISOString(),
				isUsed: false,
			};

			setGeneratedQRs((prev) => [newQR, ...prev]);
			setQrDataUrl(qrDataUrl);
			setSelectedTransaction("");
		} catch (error) {
			console.error("Error generating QR code:", error);
		}
	};

	const handleGenerateGenericQR = async () => {
		try {
			const evaluationUrl = `${window.location.origin}/customer/evaluation`;
			const qrDataUrl = await QRCode.toDataURL(evaluationUrl, {
				width: 256,
				margin: 2,
				color: {
					dark: "#071952",
					light: "#FFFFFF",
				},
			});
			setQrDataUrl(qrDataUrl);
		} catch (error) {
			console.error("Error generating QR code:", error);
		}
	};

	const handleDownloadQR = (qrUrl: string, fileName: string) => {
		const link = document.createElement("a");
		link.href = qrUrl;
		link.download = `${fileName}-evaluation-qr.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const markQRAsUsed = (qrId: string) => {
		setGeneratedQRs((prev) =>
			prev.map((qr) => (qr.id === qrId ? { ...qr, isUsed: true } : qr))
		);
	};

	const getSentimentColor = (sentiment: string) => {
		switch (sentiment) {
			case "positive":
				return "bg-green-100 text-green-800";
			case "negative":
				return "bg-red-100 text-red-800";
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "draft":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-blue-100 text-blue-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Feedback Forms</h1>
					<p className="text-gray-600">
						Manage feedback forms and evaluation QR codes
					</p>
				</div>
				<Button className="gradient-primary text-white">
					<Plus className="w-4 h-4 mr-2" />
					Create Form
				</Button>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="forms">Feedback Forms</TabsTrigger>
					<TabsTrigger value="qr-pending">QR & Pending</TabsTrigger>
					<TabsTrigger value="recent">Recent Feedback</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
				</TabsList>

				{/* Feedback Forms Tab */}
				<TabsContent value="forms" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Feedback Forms</CardTitle>
							<CardDescription>
								Manage your customer feedback forms
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{feedbackForms.map((form) => (
									<div
										key={form.id}
										className="border rounded-lg p-4 space-y-3"
									>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold text-gray-900">
														{form.title}
													</h3>
													<Badge className={getStatusColor(form.status)}>
														{form.status}
													</Badge>
												</div>
												<p className="text-sm text-gray-600">
													{form.description}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button variant="ghost" size="sm">
													<Eye className="w-4 h-4" />
												</Button>
												<Button variant="ghost" size="sm">
													<Edit className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-red-600 hover:text-red-700"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>

										<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
											<div>
												<p className="text-gray-600">Questions</p>
												<p className="font-semibold">{form.questions}</p>
											</div>
											<div>
												<p className="text-gray-600">Responses</p>
												<p className="font-semibold">{form.responses}</p>
											</div>
											<div>
												<p className="text-gray-600">Avg Rating</p>
												<div className="flex items-center gap-1">
													<Star className="w-4 h-4 text-yellow-500 fill-current" />
													<span className="font-semibold">
														{form.avgRating}
													</span>
												</div>
											</div>
											<div>
												<p className="text-gray-600">Created</p>
												<p className="font-semibold">
													{new Date(form.createdAt).toLocaleDateString()}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* QR & Pending Tab */}
				<TabsContent value="qr-pending" className="space-y-6">
					{/* Transaction-Specific QR Generation */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Hash className="w-5 h-5" />
								Generate Transaction-Specific QR
							</CardTitle>
							<CardDescription>
								Create unique QR codes linked to specific completed transactions
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-4">
								<Select
									value={selectedTransaction}
									onValueChange={setSelectedTransaction}
								>
									<SelectTrigger className="w-80">
										<SelectValue placeholder="Select a completed transaction" />
									</SelectTrigger>
									<SelectContent>
										{recentTransactions.map((transaction) => (
											<SelectItem key={transaction.id} value={transaction.id}>
												<div className="flex flex-col">
													<span className="font-medium">
														{transaction.customerName}
													</span>
													<span className="text-sm text-muted-foreground">
														{transaction.office} - {transaction.service}
													</span>
													<span className="text-xs text-muted-foreground">
														Ticket: {transaction.ticketNumber} |{" "}
														{transaction.completedAt}
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									onClick={handleGenerateTransactionQR}
									disabled={!selectedTransaction}
									className="gradient-primary text-white"
								>
									<QrCode className="w-4 h-4 mr-2" />
									Generate Transaction QR
								</Button>
							</div>

							<div className="text-sm text-muted-foreground">
								<p>
									• Transaction-specific QR codes link evaluations directly to
									completed services
								</p>
								<p>
									• Each QR contains transaction details for accurate feedback
									tracking
								</p>
								<p>
									• Customers can only evaluate services they actually received
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Generic QR Generation */}
					<Card>
						<CardHeader>
							<CardTitle>Generate Generic Evaluation QR</CardTitle>
							<CardDescription>
								Print and display this QR at counters for general use
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4 text-center">
							{qrDataUrl ? (
								<div className="flex flex-col items-center space-y-4">
									<img
										src={qrDataUrl}
										alt="Evaluation QR"
										className="w-64 h-64 border rounded bg-white"
									/>
									<Button
										onClick={() => handleDownloadQR(qrDataUrl, "generic")}
										className="gradient-primary"
									>
										<Download className="w-4 h-4 mr-2" />
										Download QR Code
									</Button>
								</div>
							) : (
								<div className="text-sm text-gray-600">
									Click "Generate Generic QR" to create a QR code.
								</div>
							)}
							<Button
								onClick={handleGenerateGenericQR}
								className="gradient-primary"
							>
								<QrCode className="w-4 h-4 mr-2" />
								Generate Generic QR
							</Button>
						</CardContent>
					</Card>

					{/* Generated Transaction QRs */}
					{generatedQRs.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Generated Transaction QRs</CardTitle>
								<CardDescription>
									Track all generated transaction-specific QR codes
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{generatedQRs.map((qr) => (
										<div
											key={qr.id}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="flex items-center gap-4">
												<img
													src={qr.qrUrl}
													alt="Transaction QR"
													className="w-16 h-16 border rounded"
												/>
												<div>
													<div className="font-medium">{qr.customerName}</div>
													<div className="text-sm text-muted-foreground">
														{qr.office} - {qr.service}
													</div>
													<div className="text-xs text-muted-foreground">
														Transaction: {qr.transactionId} | Generated:{" "}
														{new Date(qr.generatedAt).toLocaleString()}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Badge variant={qr.isUsed ? "secondary" : "default"}>
													{qr.isUsed ? "Used" : "Active"}
												</Badge>
												<Button
													onClick={() =>
														handleDownloadQR(
															qr.qrUrl,
															`${qr.transactionId}-${qr.customerName}`
														)
													}
													size="sm"
													variant="outline"
												>
													<Download className="w-4 h-4 mr-2" />
													Download
												</Button>
												{!qr.isUsed && (
													<Button
														onClick={() => markQRAsUsed(qr.id)}
														size="sm"
														variant="outline"
													>
														<RefreshCw className="w-4 h-4 mr-2" />
														Mark Used
													</Button>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Pending Evaluations */}
					<Card>
						<CardHeader>
							<CardTitle>Customers with Pending Evaluations</CardTitle>
							<CardDescription>
								List of customers who have not yet completed their evaluation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{pendingEvaluations.map((p) => (
									<div
										key={p.id}
										className="flex items-center justify-between p-3 border rounded"
									>
										<div className="min-w-0">
											<div className="font-medium truncate">{p.name}</div>
											<div className="text-xs text-gray-600 truncate">
												#{p.id} • {p.office} • {p.service}
											</div>
										</div>
										<Badge className="bg-yellow-100 text-yellow-800">
											Pending
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Recent Feedback Tab */}
				<TabsContent value="recent" className="space-y-4">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Recent Feedback</CardTitle>
									<CardDescription>
										Latest customer feedback responses
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<Select defaultValue="all">
										<SelectTrigger className="w-32">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Forms</SelectItem>
											<SelectItem value="service">Service Quality</SelectItem>
											<SelectItem value="wait">Wait Time</SelectItem>
											<SelectItem value="facility">Facility</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentFeedback.map((feedback) => (
									<div
										key={feedback.id}
										className="border rounded-lg p-4 space-y-3"
									>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<h4 className="font-medium text-gray-900">
														{feedback.customerName}
													</h4>
													<Badge variant="outline" className="text-xs">
														{feedback.service}
													</Badge>
													<Badge className={getSentimentColor("positive")}>
														Positive
													</Badge>
												</div>
												<div className="flex items-center gap-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className={`w-4 h-4 ${
																i < feedback.rating
																	? "text-yellow-500 fill-current"
																	: "text-gray-300"
															}`}
														/>
													))}
													<span className="text-sm text-gray-600 ml-2">
														{new Date(feedback.date).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>
										<p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
											"{feedback.comment}"
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Analytics Tab */}
				<TabsContent value="analytics" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Rating Distribution</CardTitle>
								<CardDescription>Breakdown of customer ratings</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[5, 4, 3, 2, 1].map((rating) => (
										<div key={rating} className="flex items-center gap-3">
											<div className="flex items-center gap-1 w-12">
												<span className="text-sm font-medium">{rating}</span>
												<Star className="w-3 h-3 text-yellow-500 fill-current" />
											</div>
											<div className="flex-1 bg-gray-200 rounded-full h-2">
												<div
													className="bg-[#088395] h-2 rounded-full"
													style={{ width: `${rating * 20}%` }}
												/>
											</div>
											<span className="text-sm text-gray-600 w-12 text-right">
												{rating * 20}%
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Sentiment Analysis</CardTitle>
								<CardDescription>Customer sentiment breakdown</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 bg-green-500 rounded-full" />
											<span className="font-medium text-green-800">
												Positive
											</span>
										</div>
										<span className="text-green-800 font-semibold">65%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 bg-yellow-500 rounded-full" />
											<span className="font-medium text-yellow-800">
												Neutral
											</span>
										</div>
										<span className="text-yellow-800 font-semibold">25%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 bg-red-500 rounded-full" />
											<span className="font-medium text-red-800">Negative</span>
										</div>
										<span className="text-red-800 font-semibold">10%</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
