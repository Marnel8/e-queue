"use client";

import { useEffect, useState } from "react";
import { StaffLayout } from "@/components/staff/layout";
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
	Users,
	Clock,
	Play,
	Pause,
	SkipForward,
	CheckCircle,
	AlertCircle,
	User,
	Phone,
	Mail,
	Calendar,
	UserCheck,
	Shield,
	X,
} from "lucide-react";
import QRCode from "react-qr-code";

const queueData = [
	{
		id: 1,
		ticketNumber: "A001",
		customerName: "Juan Dela Cruz",
		service: "Transcript Request",
		priority: "Regular",
		waitTime: "5 minutes",
		status: "Current",
		phone: "+63 912 345 6789",
		email: "juan.delacruz@student.omsc.edu.ph",
		bookedTime: "9:00 AM",
	},
	{
		id: 2,
		ticketNumber: "A002",
		customerName: "Maria Santos",
		service: "Certificate Issuance",
		priority: "Regular",
		waitTime: "12 minutes",
		status: "Waiting",
		phone: "+63 923 456 7890",
		email: "maria.santos@student.omsc.edu.ph",
		bookedTime: "9:15 AM",
	},
	{
		id: 3,
		ticketNumber: "A003",
		customerName: "Pedro Garcia",
		service: "Enrollment",
		priority: "Priority",
		waitTime: "18 minutes",
		status: "Waiting",
		phone: "+63 934 567 8901",
		email: "pedro.garcia@student.omsc.edu.ph",
		bookedTime: "9:30 AM",
	},
	{
		id: 4,
		ticketNumber: "A004",
		customerName: "Ana Rodriguez",
		service: "Grade Verification",
		priority: "Regular",
		waitTime: "25 minutes",
		status: "Waiting",
		phone: "+63 945 678 9012",
		email: "ana.rodriguez@student.omsc.edu.ph",
		bookedTime: "9:45 AM",
	},
];

const getStatusBadge = (status: string) => {
	const variants = {
		Current: "bg-green-100 text-green-800",
		Waiting: "bg-blue-100 text-blue-800",
		Hold: "bg-yellow-100 text-yellow-800",
		Done: "bg-gray-100 text-gray-800",
	};
	return (
		variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
	);
};

const getPriorityBadge = (priority: string) => {
	return priority === "Priority"
		? "bg-red-100 text-red-800"
		: "bg-gray-100 text-gray-800";
};

export default function StaffDashboard() {
	const [currentQueue, setCurrentQueue] = useState(queueData[0]);
	const [queueList, setQueueList] = useState(queueData.slice(1));
	const [evaluationScanned, setEvaluationScanned] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [customRating, setCustomRating] = useState(5);
	const [customWaitTime, setCustomWaitTime] = useState(5);
	const [qrCodeScanned, setQrCodeScanned] = useState(false);

	// Text-to-speech function to announce next customer
	const announceNextCustomer = (
		_customerName: string,
		ticketNumber: string
	) => {
		if ("speechSynthesis" in window) {
			const utterance = new SpeechSynthesisUtterance(
				`Next ticket number ${ticketNumber}. Please proceed to the counter.`
			);
			utterance.rate = 0.9;
			utterance.pitch = 1.0;
			utterance.volume = 1.0;
			window.speechSynthesis.speak(utterance);
		}
	};

	// Handle successful QR code scan for evaluation
	const handleQRCodeScanned = (ticketNumber: string) => {
		// Set QR code as scanned
		setQrCodeScanned(true);

		// Find the customer who completed evaluation
		const customer = queueData.find((q) => q.ticketNumber === ticketNumber);
		if (customer) {
			// Announce next customer after a short delay
			setTimeout(() => {
				if (queueList.length > 0) {
					const nextCustomer = queueList[0];
					announceNextCustomer(
						nextCustomer.customerName,
						nextCustomer.ticketNumber
					);
				}
			}, 1000);
		}

		// Reset QR code scanned status after announcement
		setTimeout(() => setQrCodeScanned(false), 5000);
	};

	// Staff assignment management
	const [currentStaff, setCurrentStaff] = useState({
		id: "staff-001",
		name: "Juan Dela Cruz",
		office: "Registrar Office",
		assignedAt: new Date().toISOString(),
	});
	const [isQueueLocked, setIsQueueLocked] = useState(false);
	const [showStaffSwitch, setShowStaffSwitch] = useState(false);

	// Available staff members for this office
	const availableStaff = [
		{ id: "staff-001", name: "Juan Dela Cruz", status: "active" },
		{ id: "staff-002", name: "Maria Santos", status: "available" },
		{ id: "staff-003", name: "Pedro Garcia", status: "available" },
	];

	// Prevent hydration mismatch by only rendering after mount
	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		// Reset evaluation scan status when customer changes
		setEvaluationScanned(false);
	}, [currentQueue?.id]);

	// Check if current staff is still assigned to this queue
	useEffect(() => {
		const checkQueueLock = () => {
			// Simulate checking if another staff member has taken over
			const lastActivity = localStorage.getItem(
				`queue_lock_${currentStaff.office}`
			);
			if (lastActivity && lastActivity !== currentStaff.id) {
				setIsQueueLocked(true);
			}
		};

		// Check every 30 seconds
		const interval = setInterval(checkQueueLock, 30000);
		checkQueueLock();

		return () => clearInterval(interval);
	}, [currentStaff.office, currentStaff.id]);

	const handleStaffSwitch = (newStaff: any) => {
		// Release current queue lock
		localStorage.removeItem(`queue_lock_${currentStaff.office}`);

		// Set new staff and lock queue
		setCurrentStaff(newStaff);
		localStorage.setItem(`queue_lock_${currentStaff.office}`, newStaff.id);
		setIsQueueLocked(false);
		setShowStaffSwitch(false);

		// Update staff status
		availableStaff.forEach((staff) => {
			if (staff.id === newStaff.id) {
				staff.status = "active";
			} else if (staff.id === currentStaff.id) {
				staff.status = "available";
			}
		});
	};

	const handleNext = () => {
		if (queueList.length > 0) {
			const nextCustomer = queueList[0];
			setCurrentQueue(nextCustomer);
			setQueueList(queueList.slice(1));

			// Announce next customer
			announceNextCustomer(
				nextCustomer.customerName,
				nextCustomer.ticketNumber
			);
		}
	};

	const handleHold = () => {
		// Move current to end of queue with hold status
		const heldCustomer = { ...currentQueue, status: "Hold" };
		if (queueList.length > 0) {
			setCurrentQueue(queueList[0]);
			setQueueList([...queueList.slice(1), heldCustomer]);
		}
	};

	const handleSkip = () => {
		// Skip current customer
		if (queueList.length > 0) {
			setCurrentQueue(queueList[0]);
			setQueueList(queueList.slice(1));
		}
	};

	const handleDone = () => {
		if (currentQueue) {
			// Generate QR code for evaluation
			generateEvaluationQR(currentQueue);

			// Set QR code as scanned automatically
			setQrCodeScanned(true);

			// Move to next customer
			if (queueList.length > 0) {
				const nextCustomer = queueList[0];
				setCurrentQueue(nextCustomer);
				setQueueList(queueList.slice(1));

				// Announce next customer after a short delay
				setTimeout(() => {
					announceNextCustomer(
						nextCustomer.customerName,
						nextCustomer.ticketNumber
					);
				}, 1000);
			}

			// Reset QR code scanned status after announcement
			setTimeout(() => setQrCodeScanned(false), 5000);
		}
	};

	const generateEvaluationQR = (customer: any) => {
		if (typeof window === "undefined") return;

		const qrData = {
			ticketNumber: customer.ticketNumber,
			customerName: customer.customerName,
			office: currentStaff.office,
			service: customer.service,
			completedAt: new Date().toISOString(),
			staffId: currentStaff.id,
			staffName: currentStaff.name,
		};

		// Store QR data for customer access
		localStorage.setItem(
			`equeue_qr_${customer.ticketNumber}`,
			JSON.stringify(qrData)
		);

		alert(
			`Evaluation QR code generated for ${customer.customerName} (${customer.ticketNumber})`
		);
	};

	const simulateCustomerEvaluation = (evaluationType: string) => {
		if (typeof window === "undefined") return;

		const evaluation = {
			id: Date.now(),
			type: "customer_evaluation",
			scenario: evaluationType,
			when: new Date().toISOString(),
			completedAt: new Date().toISOString(), // Add completion timestamp
			ticketNumber: currentQueue?.ticketNumber || "A001",
			customerName: currentQueue?.customerName || "Test Customer",
			office: currentStaff.office,
			service: currentQueue?.service || "General Service",
			rating: getRatingForScenario(evaluationType),
			waitTime: getWaitTimeForScenario(evaluationType),
			comment: getCommentForScenario(evaluationType),
			staffId: currentStaff.id,
			staffName: currentStaff.name,
		};

		try {
			const existingEvaluations =
				localStorage.getItem("equeue_evaluations") || "[]";
			const evaluations = JSON.parse(existingEvaluations);
			evaluations.push(evaluation);
			localStorage.setItem("equeue_evaluations", JSON.stringify(evaluations));

			// Set evaluation completion flag to trigger automatic next action
			if (currentQueue) {
				localStorage.setItem(
					`equeue_evaluation_${currentQueue.ticketNumber}`,
					JSON.stringify({
						completedAt: new Date().toISOString(),
						ticketNumber: currentQueue.ticketNumber,
						customerName: currentQueue.customerName,
					})
				);
			}

			alert(
				`Customer evaluation simulation (${evaluationType.replace(
					/_/g,
					" "
				)}) completed successfully!`
			);
		} catch (error) {
			localStorage.setItem("equeue_evaluations", JSON.stringify([evaluation]));
			alert(
				`Customer evaluation simulation (${evaluationType.replace(
					/_/g,
					" "
				)}) completed successfully!`
			);
		}
	};

	const simulateCustomCustomerEvaluation = () => {
		if (typeof window === "undefined") return;

		const evaluation = {
			id: Date.now(),
			type: "customer_evaluation",
			scenario: "custom_evaluation",
			when: new Date().toISOString(),
			completedAt: new Date().toISOString(), // Add completion timestamp
			ticketNumber: currentQueue?.ticketNumber || "A001",
			customerName: currentQueue?.customerName || "Test Customer",
			office: currentStaff.office,
			service: currentQueue?.service || "General Service",
			rating: customRating,
			waitTime: customWaitTime,
			comment: `Custom evaluation with service rating: ${customRating}/5, wait time rating: ${customWaitTime}/5`,
			staffId: currentStaff.id,
			staffName: currentStaff.name,
		};

		try {
			const existingEvaluations =
				localStorage.getItem("equeue_evaluations") || "[]";
			const evaluations = JSON.parse(existingEvaluations);
			evaluations.push(evaluation);
			localStorage.setItem("equeue_evaluations", JSON.stringify(evaluations));

			// Set evaluation completion flag to trigger automatic next action
			if (currentQueue) {
				localStorage.setItem(
					`equeue_evaluation_${currentQueue.ticketNumber}`,
					JSON.stringify({
						completedAt: new Date().toISOString(),
						ticketNumber: currentQueue.ticketNumber,
						customerName: currentQueue.customerName,
					})
				);
			}

			alert("Custom customer evaluation simulation completed successfully!");
		} catch (error) {
			localStorage.setItem("equeue_evaluations", JSON.stringify([evaluation]));
			alert("Custom customer evaluation simulation completed successfully!");
		}
	};

	const getRatingForScenario = (scenario: string) => {
		switch (scenario) {
			case "excellent_service":
				return 5;
			case "good_service":
				return 4;
			case "average_service":
				return 3;
			case "poor_service":
				return 2;
			case "with_complaint":
				return 1;
			case "no_evaluation":
				return 0;
			default:
				return 3;
		}
	};

	const getWaitTimeForScenario = (scenario: string) => {
		switch (scenario) {
			case "excellent_service":
				return 5;
			case "good_service":
				return 4;
			case "average_service":
				return 3;
			case "poor_service":
				return 2;
			case "with_complaint":
				return 1;
			case "no_evaluation":
				return 0;
			default:
				return 3;
		}
	};

	const getCommentForScenario = (scenario: string) => {
		switch (scenario) {
			case "excellent_service":
				return "Outstanding service quality and efficiency";
			case "good_service":
				return "Good service with room for minor improvements";
			case "average_service":
				return "Standard service quality, meets expectations";
			case "poor_service":
				return "Below average service quality, needs improvement";
			case "with_complaint":
				return "Service issues encountered, formal complaint filed";
			case "no_evaluation":
				return "Customer chose not to provide evaluation";
			default:
				return "Standard evaluation submitted";
		}
	};

	const clearAllEvaluations = () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem("equeue_evaluations");
		alert("All evaluations cleared successfully!");
	};

	// Don't render until mounted to prevent hydration issues
	if (!isMounted) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	// If queue is locked by another staff member, show takeover screen
	if (isQueueLocked) {
		return (
			<StaffLayout
				title="Queue Locked"
				description="Another staff member is managing this queue"
			>
				<div className="max-w-2xl mx-auto">
					<Card>
						<CardHeader className="text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Shield className="w-8 h-8 text-red-600" />
							</div>
							<CardTitle className="text-2xl">Queue Locked</CardTitle>
							<CardDescription>
								Another staff member is currently managing this queue
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="text-center space-y-4">
								<p className="text-muted-foreground">
									The queue for <strong>{currentStaff.office}</strong> is
									currently being managed by another staff member.
								</p>
								<div className="flex gap-4">
									<Button
										onClick={() => setShowStaffSwitch(true)}
										className="gradient-primary text-white"
									>
										<UserCheck className="w-4 h-4 mr-2" />
										Switch Staff Account
									</Button>
									<Button
										onClick={() => window.location.reload()}
										variant="outline"
									>
										Refresh Status
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</StaffLayout>
		);
	}

	return (
		<StaffLayout
			title="Queue Dashboard"
			description="Manage customer queue in real-time"
		>
			{/* Staff Assignment Status */}
			<Card className="mb-6">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg flex items-center gap-2">
						<User className="w-5 h-5" />
						Staff Assignment
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
								<User className="w-5 h-5 text-white" />
							</div>
							<div>
								<p className="font-medium">{currentStaff.name}</p>
								<p className="text-sm text-muted-foreground">
									Managing: {currentStaff.office}
								</p>
								<p className="text-xs text-muted-foreground">
									Assigned:{" "}
									{new Date(currentStaff.assignedAt).toLocaleTimeString()}
								</p>
							</div>
						</div>
						<Button
							onClick={() => setShowStaffSwitch(true)}
							variant="outline"
							size="sm"
						>
							<UserCheck className="w-4 h-4 mr-2" />
							Switch Account
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Staff Switch Modal */}
			{showStaffSwitch && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold mb-4">Switch Staff Account</h3>
						<div className="space-y-3">
							{availableStaff.map((staff) => (
								<div
									key={staff.id}
									className={`p-3 border rounded-lg cursor-pointer transition-colors ${
										staff.status === "active"
											? "border-primary bg-primary/5"
											: "border-gray-200 hover:border-primary/50"
									}`}
									onClick={() => handleStaffSwitch(staff)}
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium">{staff.name}</p>
											<p className="text-sm text-muted-foreground">
												Status:{" "}
												{staff.status === "active"
													? "Currently Active"
													: "Available"}
											</p>
										</div>
										{staff.status === "active" && (
											<Badge className="bg-primary text-white">Active</Badge>
										)}
									</div>
								</div>
							))}
						</div>
						<div className="mt-6 flex gap-3">
							<Button
								onClick={() => setShowStaffSwitch(false)}
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}

			<div className="space-y-6">
				{/* Queue Statistics */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Current Customer</p>
									<p className="text-2xl font-bold text-[#071952]">
										{currentQueue ? currentQueue.ticketNumber : "None"}
									</p>
								</div>
								<div className="w-10 h-10 bg-[#088395]/10 rounded-lg flex items-center justify-center">
									<User className="w-5 h-5 text-[#088395]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">In Queue</p>
									<p className="text-2xl font-bold text-[#071952]">
										{queueList.length}
									</p>
								</div>
								<div className="w-10 h-10 bg-[#37B7C3]/10 rounded-lg flex items-center justify-center">
									<Users className="w-5 h-5 text-[#37B7C3]" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Avg Wait Time</p>
									<p className="text-2xl font-bold text-[#071952]">12m</p>
								</div>
								<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
									<Clock className="w-5 h-5 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Today Served</p>
									<p className="text-2xl font-bold text-[#071952]">23</p>
								</div>
								<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<CheckCircle className="w-5 h-5 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Current Customer */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="w-5 h-5 text-green-600" />
							Current Customer
						</CardTitle>
						<CardDescription>
							Currently serving customer details
						</CardDescription>
					</CardHeader>
					<CardContent>
						{currentQueue ? (
							<>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div className="flex items-center gap-4">
										<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
											<span className="text-primary-foreground font-bold text-xl">
												{currentQueue.ticketNumber}
											</span>
										</div>
										<div className="space-y-1">
											<h3 className="text-xl font-semibold">
												{currentQueue.customerName}
											</h3>
											<div className="flex items-center gap-2">
												<Badge
													className={getPriorityBadge(currentQueue.priority)}
												>
													{currentQueue.priority}
												</Badge>
												<Badge className={getStatusBadge(currentQueue.status)}>
													{currentQueue.status}
												</Badge>
											</div>
											<p className="text-muted-foreground">
												{currentQueue.service}
											</p>
										</div>
									</div>
									<div className="flex flex-col gap-2 text-sm">
										<div className="flex items-center gap-2">
											<Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
											<span className="truncate">{currentQueue.phone}</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
											<span className="truncate">{currentQueue.email}</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
											<span className="truncate">
												Booked for {currentQueue.bookedTime}
											</span>
										</div>
									</div>
								</div>

								{/* Queue Controls */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
									<Button
										onClick={handleDone}
										className="gradient-primary text-white"
									>
										<CheckCircle className="w-4 h-4 mr-2" />
										Complete & Generate QR
									</Button>
									<Button
										onClick={() => generateEvaluationQR(currentQueue)}
										variant="outline"
										className="bg-transparent"
									>
										<CheckCircle className="w-4 h-4 mr-2" />
										Generate Evaluation QR
									</Button>
									<Button
										onClick={handleNext}
										variant="outline"
										className="bg-transparent"
									>
										<Play className="w-4 h-4 mr-2" />
										Next
									</Button>
									<Button
										onClick={handleHold}
										variant="outline"
										className="bg-transparent"
									>
										<Pause className="w-4 h-4 mr-2" />
										Hold
									</Button>
									<Button
										onClick={handleSkip}
										variant="outline"
										className="bg-transparent"
									>
										<SkipForward className="w-4 h-4 mr-2" />
										Skip
									</Button>
								</div>
							</>
						) : (
							<div className="text-center py-8">
								<AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-muted-foreground">No customers in queue</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Queue List */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="w-5 h-5 text-blue-600" />
							Waiting Queue
						</CardTitle>
						<CardDescription>Customers waiting to be served</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 max-h-96 overflow-y-auto">
							{queueList.length > 0 ? (
								queueList.map((customer, index) => (
									<div
										key={customer.id}
										className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg"
									>
										<div className="flex items-center gap-3 min-w-0 flex-1">
											<div className="w-12 h-12 rounded-full bg-[#088395] text-white flex items-center justify-center flex-shrink-0">
												<span className="font-bold text-base leading-none">
													{customer.ticketNumber}
												</span>
											</div>
											<div className="min-w-0 flex-1">
												<p className="font-medium truncate">
													{customer.customerName}
												</p>
												<p className="text-sm text-muted-foreground truncate">
													{customer.service}
												</p>
											</div>
										</div>
										<div className="text-left sm:text-right flex-shrink-0">
											<Badge className={getStatusBadge(customer.status)}>
												{customer.status}
											</Badge>
											<p className="text-xs text-muted-foreground mt-1">
												{customer.waitTime}
											</p>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8">
									<Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-muted-foreground">No customers waiting</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Service Progress */}
				<Card>
					<CardHeader>
						<CardTitle>Today's Progress</CardTitle>
						<CardDescription>
							Your service performance for today
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex justify-between text-sm">
								<span>Daily Target: 30 customers</span>
								<span className="text-green-600">23/30 (77%)</span>
							</div>
							<Progress value={77} className="h-3" />
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
								<div>
									<p className="text-2xl font-bold text-green-600">23</p>
									<p className="text-sm text-muted-foreground">Served</p>
								</div>
								<div>
									<p className="text-2xl font-bold text-blue-600">4</p>
									<p className="text-sm text-muted-foreground">In Queue</p>
								</div>
								<div>
									<p className="text-2xl font-bold text-primary">4.2m</p>
									<p className="text-sm text-muted-foreground">Avg Time</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* QR Code Generation & Customer Evaluation Simulation */}
				<Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" />
							QR Code Generation & Customer Evaluation Simulation
						</CardTitle>
						<CardDescription className="text-green-700">
							Test the complete evaluation workflow: generate QR codes and
							simulate customer evaluations
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{/* Current Service QR Code */}
							<div className="bg-white p-6 rounded-lg border-2 border-green-200">
								<h4 className="font-semibold mb-4 text-green-800">
									Current Service QR Code
								</h4>
								{currentQueue ? (
									<div className="space-y-4">
										<div className="text-center p-6 bg-green-100 rounded-lg border border-green-300">
											<div className="w-48 h-48 bg-white rounded-lg border-2 border-green-200 mx-auto mb-4 flex items-center justify-center p-4">
												<QRCode
													value={JSON.stringify({
														ticketNumber: currentQueue.ticketNumber,
														customerName: currentQueue.customerName,
														office: currentStaff.office,
														service: currentQueue.service,
														completedAt: new Date().toISOString(),
														staffId: currentStaff.id,
														staffName: currentStaff.name,
													})}
													level="H"
													size={160}
													style={{ height: 160, width: 160 }}
												/>
											</div>
											<p className="text-sm text-green-700 font-medium">
												QR Code for {currentQueue.ticketNumber}
											</p>
											<p className="text-xs text-green-600">
												{currentQueue.customerName} - {currentQueue.service}
											</p>
											{qrCodeScanned && (
												<div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded-lg animate-pulse">
													<p className="text-xs text-blue-700 font-medium">
														✓ QR Code Scanned Successfully!
													</p>
													<p className="text-xs text-blue-600">
														Announcing next customer...
													</p>
												</div>
											)}
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => generateEvaluationQR(currentQueue)}
												className="bg-green-600 hover:bg-green-700 text-white"
											>
												<CheckCircle className="w-4 h-4 mr-2" />
												Generate Evaluation QR
											</Button>
											<Button
												onClick={handleDone}
												variant="outline"
												className="border-green-300 text-green-700 hover:bg-green-50"
											>
												Complete & Generate QR
											</Button>
											<Button
												onClick={() =>
													handleQRCodeScanned(currentQueue.ticketNumber)
												}
												variant="outline"
												className="border-blue-300 text-blue-700 hover:bg-blue-50"
											>
												<CheckCircle className="w-4 h-4 mr-2" />
												Simulate QR Scan
											</Button>
										</div>
									</div>
								) : (
									<div className="text-center py-4 text-green-600">
										No current customer to generate QR for
									</div>
								)}
							</div>

							{/* Customer Evaluation Simulation */}
							<div className="bg-white p-4 rounded-lg border-2 border-green-200">
								<h4 className="font-semibold mb-3 text-green-800">
									Customer Evaluation Simulation
								</h4>
								<p className="text-sm text-green-700 mb-4">
									Simulate how customers would rate your service after scanning
									the QR code
								</p>

								{/* Evaluation Scenarios */}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
									<Button
										onClick={() =>
											simulateCustomerEvaluation("excellent_service")
										}
										variant="outline"
										className="h-16 flex flex-col gap-1 bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 border-green-200"
									>
										<div className="p-1 bg-green-100 rounded">
											<CheckCircle className="w-4 h-4 text-green-600" />
										</div>
										<span className="text-xs font-medium text-green-700">
											Excellent Service
										</span>
									</Button>

									<Button
										onClick={() => simulateCustomerEvaluation("good_service")}
										variant="outline"
										className="h-16 flex flex-col gap-1 bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 border-green-200"
									>
										<div className="p-1 bg-green-100 rounded">
											<CheckCircle className="w-4 h-4 text-green-600" />
										</div>
										<span className="text-xs font-medium text-green-700">
											Good Service
										</span>
									</Button>

									<Button
										onClick={() =>
											simulateCustomerEvaluation("average_service")
										}
										variant="outline"
										className="h-16 flex flex-col gap-1 bg-white hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200 border-green-200"
									>
										<div className="p-1 bg-yellow-100 rounded">
											<AlertCircle className="w-4 h-4 text-yellow-600" />
										</div>
										<span className="text-xs font-medium text-yellow-700">
											Average Service
										</span>
									</Button>

									<Button
										onClick={() => simulateCustomerEvaluation("poor_service")}
										variant="outline"
										className="h-16 flex flex-col gap-1 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-green-200"
									>
										<div className="p-1 bg-red-100 rounded">
											<AlertCircle className="w-4 h-4 text-red-600" />
										</div>
										<span className="text-xs font-medium text-red-700">
											Poor Service
										</span>
									</Button>

									<Button
										onClick={() => simulateCustomerEvaluation("with_complaint")}
										variant="outline"
										className="h-16 flex flex-col gap-1 bg-white hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 border-green-200"
									>
										<div className="p-1 bg-orange-100 rounded">
											<AlertCircle className="w-4 h-4 text-orange-600" />
										</div>
										<span className="text-xs font-medium text-orange-700">
											With Complaint
										</span>
									</Button>

									<Button
										onClick={() => simulateCustomerEvaluation("no_evaluation")}
										variant="outline"
										className="h-16 flex flex-col gap-1 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 border-green-200"
									>
										<div className="p-1 bg-gray-100 rounded">
											<X className="w-4 h-4 text-gray-600" />
										</div>
										<span className="text-xs font-medium text-gray-700">
											No Evaluation
										</span>
									</Button>
								</div>

								{/* Custom Evaluation */}
								<div className="border-t border-green-200 pt-4">
									<h5 className="font-medium mb-3 text-green-800">
										Custom Evaluation
									</h5>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm font-medium text-green-700 mb-2">
												Service Rating (1-5)
											</label>
											<input
												type="range"
												min="1"
												max="5"
												value={customRating}
												onChange={(e) =>
													setCustomRating(parseInt(e.target.value))
												}
												className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
											/>
											<div className="flex justify-between text-xs text-green-600 mt-1">
												<span>1</span>
												<span>2</span>
												<span>3</span>
												<span>4</span>
												<span>5</span>
											</div>
											<p className="text-sm text-green-700 mt-1">
												Rating: {customRating}/5
											</p>
										</div>
										<div>
											<label className="block text-sm font-medium text-green-700 mb-2">
												Wait Time Rating (1-5)
											</label>
											<input
												type="range"
												min="1"
												max="5"
												value={customWaitTime}
												onChange={(e) =>
													setCustomWaitTime(parseInt(e.target.value))
												}
												className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
											/>
											<div className="flex justify-between text-xs text-green-600 mt-1">
												<span>1</span>
												<span>2</span>
												<span>3</span>
												<span>4</span>
												<span>5</span>
											</div>
											<p className="text-sm text-green-700 mt-1">
												Rating: {customWaitTime}/5
											</p>
										</div>
									</div>
									<Button
										onClick={simulateCustomCustomerEvaluation}
										className="bg-green-600 hover:bg-green-700 text-white font-medium"
									>
										<CheckCircle className="w-4 h-4 mr-2" />
										Submit Custom Evaluation
									</Button>
								</div>
							</div>

							<div className="flex gap-3 pt-4 border-t border-green-200">
								<Button
									onClick={clearAllEvaluations}
									variant="outline"
									className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400"
								>
									<X className="w-4 h-4 mr-2" />
									Clear All Evaluations
								</Button>

								<div className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg flex items-center gap-2">
									<CheckCircle className="w-4 h-4" />
									<span>Test the complete customer evaluation workflow</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</StaffLayout>
	);
}
