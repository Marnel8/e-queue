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
import { Progress } from "@/components/ui/progress";
import {
	Users,
	Building2,
	Clock,
	TrendingUp,
	AlertTriangle,
	CheckCircle,
	BarChart3,
	Settings,
	AlertCircle,
	X,
	UserX,
	FileText,
	Shield,
} from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function AdminDashboard() {
	const [showViolationDialog, setShowViolationDialog] = useState(false);
	const [selectedViolation, setSelectedViolation] = useState("");
	const [customRating, setCustomRating] = useState(5);
	const [customWaitTime, setCustomWaitTime] = useState(5);

	const handleSimulateViolation = (violationType: string) => {
		if (typeof window === "undefined") return;

		const violation = {
			id: Date.now(),
			type: violationType,
			when: new Date().toISOString(),
			detail: `Simulated ${violationType.replace(/_/g, " ")} violation`,
			severity: "medium",
		};

		try {
			const existingViolations =
				localStorage.getItem("equeue_violations") || "[]";
			const violations = JSON.parse(existingViolations);
			violations.push(violation);
			localStorage.setItem("equeue_violations", JSON.stringify(violations));

			// Show success feedback
			alert(
				`Simulated ${violationType.replace(
					/_/g,
					" "
				)} violation added successfully!`
			);
		} catch (error) {
			localStorage.setItem("equeue_violations", JSON.stringify([violation]));
			alert(
				`Simulated ${violationType.replace(
					/_/g,
					" "
				)} violation added successfully!`
			);
		}
	};

	const handleSimulateEvaluation = (evaluationType: string) => {
		if (typeof window === "undefined") return;

		const evaluation = {
			id: Date.now(),
			type: "qr_evaluation",
			scenario: evaluationType,
			when: new Date().toISOString(),
			ticketNumber: "A015",
			office: "Registrar Office",
			service: "Transcript Request",
			rating: getRatingForScenario(evaluationType),
			waitTime: getWaitTimeForScenario(evaluationType),
			comment: getCommentForScenario(evaluationType),
		};

		try {
			const existingEvaluations =
				localStorage.getItem("equeue_evaluations") || "[]";
			const evaluations = JSON.parse(existingEvaluations);
			evaluations.push(evaluation);
			localStorage.setItem("equeue_evaluations", JSON.stringify(evaluations));

			alert(
				`QR Code evaluation simulation (${evaluationType.replace(
					/_/g,
					" "
				)}) completed successfully!`
			);
		} catch (error) {
			localStorage.setItem("equeue_evaluations", JSON.stringify([evaluation]));
			alert(
				`QR Code evaluation simulation (${evaluationType.replace(
					/_/g,
					" "
				)}) completed successfully!`
			);
		}
	};

	const handleSimulateCustomEvaluation = () => {
		if (typeof window === "undefined") return;

		const evaluation = {
			id: Date.now(),
			type: "qr_evaluation",
			scenario: "custom_evaluation",
			when: new Date().toISOString(),
			ticketNumber: "A015",
			office: "Registrar Office",
			service: "Transcript Request",
			rating: customRating,
			waitTime: customWaitTime,
			comment: `Custom evaluation with service rating: ${customRating}/5, wait time rating: ${customWaitTime}/5`,
		};

		try {
			const existingEvaluations =
				localStorage.getItem("equeue_evaluations") || "[]";
			const evaluations = JSON.parse(existingEvaluations);
			evaluations.push(evaluation);
			localStorage.setItem("equeue_evaluations", JSON.stringify(evaluations));

			alert("Custom QR Code evaluation simulation completed successfully!");
		} catch (error) {
			localStorage.setItem("equeue_evaluations", JSON.stringify([evaluation]));
			alert("Custom QR Code evaluation simulation completed successfully!");
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

	const clearAllViolations = () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem("equeue_violations");
		alert("All violations cleared successfully!");
	};

	const clearAllEvaluations = () => {
		if (typeof window === "undefined") return;
		localStorage.removeItem("equeue_evaluations");
		alert("All evaluations cleared successfully!");
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-[#071952]">Dashboard</h1>
				<p className="text-gray-600 mt-2">System overview and key metrics</p>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Total Users
						</CardTitle>
						<div className="p-2 bg-[#071952]/10 rounded-lg">
							<Users className="h-5 w-5 text-[#071952]" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-[#071952] mb-1">2,847</div>
						<p className="text-sm text-gray-500 flex items-center gap-1">
							<span className="text-emerald-600 font-medium">+12%</span> from
							last month
						</p>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Active Offices
						</CardTitle>
						<div className="p-2 bg-[#088395]/10 rounded-lg">
							<Building2 className="h-5 w-5 text-[#088395]" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-[#071952] mb-1">24</div>
						<p className="text-sm text-gray-500 flex items-center gap-1">
							<span className="text-emerald-600 font-medium">+2</span> new this
							month
						</p>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Avg. Wait Time
						</CardTitle>
						<div className="p-2 bg-[#37B7C3]/10 rounded-lg">
							<Clock className="h-5 w-5 text-[#37B7C3]" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-[#071952] mb-1">8.5m</div>
						<p className="text-sm text-gray-500 flex items-center gap-1">
							<span className="text-emerald-600 font-medium">-2.3m</span> from
							last week
						</p>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Queue Efficiency
						</CardTitle>
						<div className="p-2 bg-emerald-500/10 rounded-lg">
							<TrendingUp className="h-5 w-5 text-emerald-600" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-[#071952] mb-1">94.2%</div>
						<p className="text-sm text-gray-500 flex items-center gap-1">
							<span className="text-emerald-600 font-medium">+1.8%</span>{" "}
							improvement
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* System Status */}
				<Card className="border-0 shadow-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg font-semibold text-[#071952]">
							System Status
						</CardTitle>
						<CardDescription className="text-gray-500">
							Current system health and performance
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-emerald-100 rounded-full">
									<CheckCircle className="w-4 h-4 text-emerald-600" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									Database Connection
								</span>
							</div>
							<Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
								Healthy
							</Badge>
						</div>

						<div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-emerald-100 rounded-full">
									<CheckCircle className="w-4 h-4 text-emerald-600" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									Queue Processing
								</span>
							</div>
							<Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
								Active
							</Badge>
						</div>

						<div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-amber-100 rounded-full">
									<AlertTriangle className="w-4 h-4 text-amber-600" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									Notification Service
								</span>
							</div>
							<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
								Warning
							</Badge>
						</div>

						<div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
							<div className="flex items-center gap-3">
								<div className="p-1.5 bg-emerald-100 rounded-full">
									<CheckCircle className="w-4 h-4 text-emerald-600" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									Authentication
								</span>
							</div>
							<Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
								Secure
							</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card className="border-0 shadow-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg font-semibold text-[#071952]">
							Recent Activity
						</CardTitle>
						<CardDescription className="text-gray-500">
							Latest system events and user actions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
								<div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900">
										New office registered
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Student Affairs Office - 2 minutes ago
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
								<div className="w-2 h-2 bg-[#088395] rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900">
										Staff member added
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Maria Santos to Registrar Office - 15 minutes ago
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
								<div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900">
										System maintenance scheduled
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Database optimization - 1 hour ago
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
								<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900">
										User account suspended
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Violation of terms - 2 hours ago
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Office Performance */}
			<Card className="border-0 shadow-sm">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg font-semibold text-[#071952]">
						Office Performance Overview
					</CardTitle>
					<CardDescription className="text-gray-500">
						Queue efficiency and service metrics by office
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="space-y-3 p-4 bg-gray-50 rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-700">
									Registrar Office
								</span>
								<span className="text-sm font-bold text-emerald-600">96%</span>
							</div>
							<Progress value={96} className="h-2" />
						</div>

						<div className="space-y-3 p-4 bg-gray-50 rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-700">
									Cashier Office
								</span>
								<span className="text-sm font-bold text-emerald-600">94%</span>
							</div>
							<Progress value={94} className="h-2" />
						</div>

						<div className="space-y-3 p-4 bg-gray-50 rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-700">
									Student Affairs
								</span>
								<span className="text-sm font-bold text-amber-600">87%</span>
							</div>
							<Progress value={87} className="h-2" />
						</div>

						<div className="space-y-3 p-4 bg-gray-50 rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-700">
									Library
								</span>
								<span className="text-sm font-bold text-emerald-600">92%</span>
							</div>
							<Progress value={92} className="h-2" />
						</div>

						<div className="space-y-3 p-4 bg-gray-50 rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-700">
									IT Services
								</span>
								<span className="text-sm font-bold text-red-600">78%</span>
							</div>
							<Progress value={78} className="h-2" />
						</div>

						<div className="space-y-3 p-4 bg-gray-50 rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-700">
									Guidance Office
								</span>
								<span className="text-sm font-bold text-emerald-600">91%</span>
							</div>
							<Progress value={91} className="h-2" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card className="border-0 shadow-sm">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg font-semibold text-[#071952]">
						Quick Actions
					</CardTitle>
					<CardDescription className="text-gray-500">
						Common administrative tasks
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Button
							variant="outline"
							className="h-24 flex flex-col gap-3 bg-white hover:bg-[#071952]/5 hover:border-[#071952]/20 transition-all duration-200 border-gray-200"
						>
							<div className="p-2 bg-[#071952]/10 rounded-lg">
								<Users className="w-6 h-6 text-[#071952]" />
							</div>
							<span className="text-sm font-medium text-gray-700">
								Add User
							</span>
						</Button>

						<Button
							variant="outline"
							className="h-24 flex flex-col gap-3 bg-white hover:bg-[#088395]/5 hover:border-[#088395]/20 transition-all duration-200 border-gray-200"
						>
							<div className="p-2 bg-[#088395]/10 rounded-lg">
								<Building2 className="w-6 h-6 text-[#088395]" />
							</div>
							<span className="text-sm font-medium text-gray-700">
								New Office
							</span>
						</Button>

						<Button
							variant="outline"
							className="h-24 flex flex-col gap-3 bg-white hover:bg-[#37B7C3]/5 hover:border-[#37B7C3]/20 transition-all duration-200 border-gray-200"
						>
							<div className="p-2 bg-[#37B7C3]/10 rounded-lg">
								<BarChart3 className="w-6 h-6 text-[#37B7C3]" />
							</div>
							<span className="text-sm font-medium text-gray-700">
								View Reports
							</span>
						</Button>

						<Button
							variant="outline"
							className="h-24 flex flex-col gap-3 bg-white hover:bg-gray-500/5 hover:border-gray-500/20 transition-all duration-200 border-gray-200"
						>
							<div className="p-2 bg-gray-500/10 rounded-lg">
								<Settings className="w-6 h-6 text-gray-600" />
							</div>
							<span className="text-sm font-medium text-gray-700">
								System Settings
							</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Non-Compliance Simulation */}
			<Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg font-semibold text-amber-800 flex items-center gap-2">
						<Shield className="w-5 h-5 text-amber-600" />
						Non-Compliance Simulation
					</CardTitle>
					<CardDescription className="text-amber-700">
						Test violation handling and system responses for development
						purposes
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Button
								onClick={() =>
									handleSimulateViolation("evaluation_non_compliance")
								}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-amber-200"
							>
								<div className="p-2 bg-red-100 rounded-lg">
									<X className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-red-700">
									Evaluation Non-Compliance
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateViolation("queue_hopping")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-amber-200"
							>
								<div className="p-2 bg-red-100 rounded-lg">
									<UserX className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-red-700">
									Queue Hopping
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateViolation("no_show")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-amber-200"
							>
								<div className="p-2 bg-red-100 rounded-lg">
									<AlertCircle className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-red-700">
									No Show
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateViolation("multiple_bookings")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-amber-200"
							>
								<div className="p-2 bg-red-100 rounded-lg">
									<FileText className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-red-700">
									Multiple Bookings
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateViolation("late_arrival")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-amber-200"
							>
								<div className="p-2 bg-red-100 rounded-lg">
									<Clock className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-red-700">
									Late Arrival
								</span>
							</Button>

							<Button
								onClick={() =>
									handleSimulateViolation("inappropriate_behavior")
								}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-amber-200"
							>
								<div className="p-2 bg-red-100 rounded-lg">
									<AlertTriangle className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-red-700">
									Inappropriate Behavior
								</span>
							</Button>
						</div>

						<div className="flex gap-3 pt-4 border-t border-amber-200">
							<Button
								onClick={clearAllViolations}
								variant="outline"
								className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 hover:border-red-400"
							>
								<X className="w-4 h-4 mr-2" />
								Clear All Violations
							</Button>

							<div className="text-sm text-amber-700 bg-amber-100 px-3 py-2 rounded-lg flex items-center gap-2">
								<AlertCircle className="w-4 h-4" />
								<span>These simulations are for testing purposes only</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* QR Code Evaluation Simulation */}
			<Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
						<FileText className="w-5 h-5 text-green-600" />
						QR Code Evaluation Simulation
					</CardTitle>
					<CardDescription className="text-green-700">
						Simulate scanning QR codes to trigger service evaluations and test
						different scenarios
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* QR Code Display */}
						<div className="text-center p-6 bg-white rounded-lg border-2 border-green-200">
							<div className="w-48 h-48 bg-green-100 rounded-lg border-2 border-green-300 mx-auto mb-4 flex items-center justify-center p-4">
								<QRCode
									value="Ticket: A015 | Office: Registrar"
									size={160}
									level="H"
								/>
							</div>
							<p className="text-sm text-green-700 font-medium">
								Sample QR Code
							</p>
							<p className="text-xs text-green-600">
								Registrar Office - Ticket A015
							</p>
						</div>

						{/* Evaluation Scenarios */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Button
								onClick={() => handleSimulateEvaluation("excellent_service")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 border-green-200"
							>
								<div className="p-2 bg-green-100 rounded-lg">
									<CheckCircle className="w-5 h-5 text-green-600" />
								</div>
								<span className="text-sm font-medium text-green-700">
									Excellent Service
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateEvaluation("good_service")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 border-green-200"
							>
								<div className="p-2 bg-green-100 rounded-lg">
									<CheckCircle className="w-5 h-5 text-green-600" />
								</div>
								<span className="text-sm font-medium text-green-700">
									Good Service
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateEvaluation("average_service")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200 border-green-200"
							>
								<div className="p-2 bg-yellow-100 rounded-lg">
									<AlertCircle className="w-5 h-5 text-yellow-600" />
								</div>
								<span className="text-sm font-medium text-yellow-700">
									Average Service
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateEvaluation("poor_service")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-red-50 hover:border-red-300 transition-all duration-200 border-green-200"
							>
								<div className="p-2 bg-red-100 rounded-lg">
									<AlertTriangle className="w-5 h-5 text-red-600" />
								</div>
								<span className="text-sm font-medium text-red-700">
									Poor Service
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateEvaluation("with_complaint")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 border-green-200"
							>
								<div className="p-2 bg-orange-100 rounded-lg">
									<AlertCircle className="w-5 h-5 text-orange-600" />
								</div>
								<span className="text-sm font-medium text-orange-700">
									With Complaint
								</span>
							</Button>

							<Button
								onClick={() => handleSimulateEvaluation("no_evaluation")}
								variant="outline"
								className="h-20 flex flex-col gap-2 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 border-green-200"
							>
								<div className="p-2 bg-gray-100 rounded-lg">
									<X className="w-5 h-5 text-gray-600" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									No Evaluation
								</span>
							</Button>
						</div>

						{/* Custom Evaluation */}
						<div className="bg-white p-4 rounded-lg border-2 border-green-200">
							<h4 className="font-semibold mb-3 text-green-800">
								Custom Evaluation
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-green-700 mb-2">
										Service Rating (1-5)
									</label>
									<input
										type="range"
										min="1"
										max="5"
										value={customRating}
										onChange={(e) => setCustomRating(parseInt(e.target.value))}
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
								onClick={() => handleSimulateCustomEvaluation()}
								className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium"
							>
								<FileText className="w-4 h-4 mr-2" />
								Submit Custom Evaluation
							</Button>
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
								<FileText className="w-4 h-4" />
								<span>Simulate QR code scanning for service evaluation</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
