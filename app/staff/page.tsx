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
	Image as ImageIcon,
	Eye,
	Download,
	QrCode,
	Monitor,
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
		priorityLaneImage: null, // No image for regular priority
		deskId: 1,
		assignedStaff: "Ana Rodriguez",
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
		priorityLaneImage: null,
		deskId: 1,
		assignedStaff: "Ana Rodriguez",
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
		priorityLaneImage: "/images/priority-lane-sample.jpg", // Sample image for priority customer
		deskId: 2,
		assignedStaff: "Carlos Mendoza",
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
		priorityLaneImage: null,
		deskId: 1,
		assignedStaff: "Ana Rodriguez",
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
	// Staff assignment management
	const [currentStaff, setCurrentStaff] = useState({
		id: "staff-001",
		name: "Ana Rodriguez",
		office: "Registrar Office",
		assignedAt: new Date().toISOString(),
		deskId: 1,
		deskName: "Desk 1",
	});

	// Filter queue data by current staff's desk
	const deskQueueData = queueData.filter(ticket => ticket.deskId === currentStaff.deskId);
	const [currentQueue, setCurrentQueue] = useState(deskQueueData[0] || null);
	const [queueList, setQueueList] = useState(deskQueueData.slice(1));
	const [evaluationScanned, setEvaluationScanned] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [customRating, setCustomRating] = useState(5);
	const [customWaitTime, setCustomWaitTime] = useState(5);
	const [qrCodeScanned, setQrCodeScanned] = useState(false);
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

	const [isQueueLocked, setIsQueueLocked] = useState(false);
	const [showStaffSwitch, setShowStaffSwitch] = useState(false);

	// Available staff members for this office
	const availableStaff = [
		{ id: "staff-001", name: "Ana Rodriguez", status: "active", deskId: 1, deskName: "Desk 1" },
		{ id: "staff-002", name: "Carlos Mendoza", status: "available", deskId: 2, deskName: "Desk 2" },
		{ id: "staff-003", name: "Elena Santos", status: "available", deskId: 3, deskName: "Desk 3" },
	];

	// Update queue when staff changes desk
	useEffect(() => {
		const newDeskQueueData = queueData.filter(ticket => ticket.deskId === currentStaff.deskId);
		setCurrentQueue(newDeskQueueData[0] || null);
		setQueueList(newDeskQueueData.slice(1));
	}, [currentStaff.deskId]);

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
		}
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

	// Image viewer functions
	const openImageModal = (imageUrl: string) => {
		setSelectedImage(imageUrl);
		setShowImageModal(true);
	};

	const closeImageModal = () => {
		setShowImageModal(false);
		setSelectedImage(null);
	};

	const downloadImage = (imageUrl: string, customerName: string) => {
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = `priority-lane-${customerName.replace(/\s+/g, '-')}.jpg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
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
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Monitor className="w-3 h-3" />
									<span>Assigned to {currentStaff.deskName}</span>
								</div>
								<p className="text-xs text-muted-foreground">
									Since:{" "}
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
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<Monitor className="w-3 h-3" />
												<span>{staff.deskName}</span>
											</div>
											<p className="text-xs text-muted-foreground">
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
									<p className="text-sm text-gray-600">In Queue ({currentStaff.deskName})</p>
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

								{/* Priority Lane Image Section */}
								{currentQueue.priority === "Priority" && (
									<div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
										<div className="flex items-center gap-2 mb-3">
											<ImageIcon className="w-5 h-5 text-amber-600" />
											<h4 className="font-semibold text-amber-800">
												Priority Lane Image
											</h4>
											<Badge className="bg-amber-100 text-amber-800 border-amber-300">
												Priority Customer
											</Badge>
										</div>
										
										{currentQueue.priorityLaneImage ? (
											<div className="space-y-3">
												<div className="relative group">
													<img
														src={currentQueue.priorityLaneImage}
														alt={`Priority lane image for ${currentQueue.customerName}`}
														className="w-full h-48 object-cover rounded-lg border-2 border-amber-200 cursor-pointer transition-transform duration-200 hover:scale-105"
														onClick={() => openImageModal(currentQueue.priorityLaneImage!)}
													/>
													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
														<Eye className="w-8 h-8 text-white" />
													</div>
												</div>
												<div className="flex gap-2">
													<Button
														onClick={() => openImageModal(currentQueue.priorityLaneImage!)}
														variant="outline"
														className="border-amber-300 text-amber-700 hover:bg-amber-50"
													>
														<Eye className="w-4 h-4 mr-2" />
														View Full Size
													</Button>
													<Button
														onClick={() => downloadImage(currentQueue.priorityLaneImage!, currentQueue.customerName)}
														variant="outline"
														className="border-amber-300 text-amber-700 hover:bg-amber-50"
													>
														<Download className="w-4 h-4 mr-2" />
														Download
													</Button>
												</div>
												<p className="text-sm text-amber-700">
													This customer has priority access and uploaded an image during booking.
													Click to view full size or download for reference.
												</p>
											</div>
										) : (
											<div className="text-center py-6">
												<ImageIcon className="w-12 h-12 text-amber-400 mx-auto mb-3" />
												<p className="text-amber-600 font-medium">No Image Uploaded</p>
												<p className="text-sm text-amber-500">
													This priority customer did not upload an image during booking.
												</p>
											</div>
										)}
									</div>
								)}

								{/* Queue Controls */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
									<Button
										onClick={handleDone}
										className="gradient-primary text-white"
									>
										<CheckCircle className="w-4 h-4 mr-2" />
										Mark Complete
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

								{/* QR Code Display Section - Right below current customer */}
								{currentQueue && (
									<div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
										<div className="text-center mb-4">
											<h4 className="text-xl font-bold text-blue-800 mb-2">
												📱 Customer Evaluation QR Code
											</h4>
											<p className="text-blue-700">
												Show this QR code to {currentQueue.customerName} after completing their service
											</p>
										</div>
										
										<div className="flex justify-center">
											<div className="bg-white p-8 rounded-xl border-4 border-blue-200 shadow-lg">
												<QRCode
													value={JSON.stringify({
														type: "evaluation_form",
														formId: "eval-001",
														office: currentStaff.office,
														title: "General Service Evaluation",
														customerTicket: currentQueue.ticketNumber,
														customerName: currentQueue.customerName,
														service: currentQueue.service,
														url: `${window.location.origin}/customer/evaluation/eval-001?ticket=${currentQueue.ticketNumber}`,
													})}
													level="H"
													size={280}
													style={{ height: 280, width: 280 }}
												/>
											</div>
										</div>
										
										<div className="text-center mt-4">
											<p className="text-sm text-blue-700 font-medium">
												{currentQueue.customerName} - {currentQueue.service}
											</p>
											<p className="text-xs text-blue-600 mt-1">
												Ticket: {currentQueue.ticketNumber}
											</p>
											<div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded-lg max-w-md mx-auto">
												<p className="text-xs text-blue-800">
													<strong>Instructions:</strong> Customer can scan this QR code with their phone to submit a service evaluation.
													The evaluation will automatically include their ticket and service information.
												</p>
											</div>
										</div>
									</div>
								)}
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
												{customer.priority === "Priority" && customer.priorityLaneImage && (
													<div className="flex items-center gap-2 mt-1">
														<ImageIcon className="w-3 h-3 text-amber-600" />
														<span className="text-xs text-amber-600 font-medium">
															Has Priority Image
														</span>
													</div>
												)}
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

				{/* Customer Evaluation Form */}
				<Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" />
							Customer Evaluation Form
						</CardTitle>
						<CardDescription className="text-green-700">
							Submit customer evaluation with auto-filled customer information
						</CardDescription>
					</CardHeader>
					<CardContent>
						{currentQueue ? (
							<div className="space-y-6">
								{/* Customer Information Display */}
								<div className="bg-white p-4 rounded-lg border-2 border-green-200">
									<h4 className="font-semibold mb-3 text-green-800">
										Customer Information (Auto-filled)
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div>
											<label className="block text-sm font-medium text-green-700 mb-1">
												Ticket Number
											</label>
											<input
												type="text"
												value={currentQueue.ticketNumber}
												readOnly
												className="w-full p-2 bg-green-50 border border-green-200 rounded-md text-green-800 font-medium"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-green-700 mb-1">
												Customer Name
											</label>
											<input
												type="text"
												value={currentQueue.customerName}
												readOnly
												className="w-full p-2 bg-green-50 border border-green-200 rounded-md text-green-800 font-medium"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-green-700 mb-1">
												Service
											</label>
											<input
												type="text"
												value={currentQueue.service}
												readOnly
												className="w-full p-2 bg-green-50 border border-green-200 rounded-md text-green-800 font-medium"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-green-700 mb-1">
												Office
											</label>
											<input
												type="text"
												value={currentStaff.office}
												readOnly
												className="w-full p-2 bg-green-50 border border-green-200 rounded-md text-green-800 font-medium"
											/>
										</div>
									</div>
								</div>

								{/* Evaluation Actions */}
								<div className="bg-white p-4 rounded-lg border-2 border-green-200">
									<h4 className="font-semibold mb-3 text-green-800">
										Submit Evaluation
									</h4>
									<p className="text-sm text-green-700 mb-4">
										Customer evaluation will be submitted with the auto-filled information above.
									</p>
									<div className="flex gap-3">
										<Button
											onClick={() => simulateCustomerEvaluation("excellent_service")}
											className="bg-green-600 hover:bg-green-700 text-white"
										>
											<CheckCircle className="w-4 h-4 mr-2" />
											Submit Positive Evaluation
										</Button>
										<Button
											onClick={() => simulateCustomerEvaluation("average_service")}
											variant="outline"
											className="border-green-300 text-green-700 hover:bg-green-50"
										>
											Submit Average Evaluation
										</Button>
									</div>
								</div>
							</div>
						) : (
							<div className="text-center py-8">
								<AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-muted-foreground">No current customer to evaluate</p>
							</div>
						)}
					</CardContent>
				</Card>


			</div>

		{/* Image Modal */}
			{showImageModal && selectedImage && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
					<div className="relative max-w-4xl max-h-full">
						<img
							src={selectedImage}
							alt="Priority lane image"
							className="max-w-full max-h-full object-contain rounded-lg"
						/>
						<div className="absolute top-4 right-4 flex gap-2">
							<Button
								onClick={() => downloadImage(selectedImage, currentQueue?.customerName || 'customer')}
								variant="outline"
								className="bg-white/90 hover:bg-white text-gray-800 border-gray-300"
							>
								<Download className="w-4 h-4 mr-2" />
								Download
							</Button>
							<Button
								onClick={closeImageModal}
								variant="outline"
								className="bg-white/90 hover:bg-white text-gray-800 border-gray-300"
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</StaffLayout>
	);
}
