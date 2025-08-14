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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Plus,
	Settings,
	Users,
	Clock,
	ArrowUp,
	ArrowDown,
	Edit,
	Trash2,
	BarChart3,
	TrendingUp,
	AlertTriangle,
	CheckCircle,
} from "lucide-react";

export default function QueueLanesPage() {
	const [activeTab, setActiveTab] = useState("lanes");

	const queueLanes = [
		{
			id: 1,
			name: "Priority Lane",
			description: "For senior citizens, PWDs, and pregnant women",
			services: ["Enrollment", "Transcript Request", "Certificate Request"],
			currentQueue: 3,
			avgWaitTime: "5 mins",
			status: "active",
			order: 1,
		},
		{
			id: 2,
			name: "Regular Lane A",
			description: "General services for students",
			services: ["Enrollment", "ID Replacement", "Form Requests"],
			currentQueue: 12,
			avgWaitTime: "15 mins",
			status: "active",
			order: 2,
		},
		{
			id: 3,
			name: "Regular Lane B",
			description: "General services for students",
			services: ["Transcript Request", "Certificate Request", "Clearance"],
			currentQueue: 8,
			avgWaitTime: "12 mins",
			status: "active",
			order: 3,
		},
		{
			id: 4,
			name: "Express Lane",
			description: "Quick services only",
			services: ["Form Requests", "Information Inquiry"],
			currentQueue: 5,
			avgWaitTime: "3 mins",
			status: "maintenance",
			order: 4,
		},
	];

	const queueSettings = {
		maxTicketsPerUser: 3,
		advanceBookingDays: 7,
		operatingHours: {
			start: "08:00",
			end: "17:00",
		},
		breakTimes: [
			{ start: "12:00", end: "13:00", name: "Lunch Break" },
			{ start: "15:00", end: "15:15", name: "Afternoon Break" },
		],
	};

	// Queue Lane Analysis Data
	const laneAnalysis = {
		totalCustomers: 156,
		avgWaitTime: "12.5 minutes",
		peakHours: "9:00 AM - 11:00 AM",
		efficiency: 78,
		recommendations: [
			{
				type: "optimization",
				title: "Consolidate Regular Lanes",
				description:
					"Regular Lane A and B have similar wait times. Consider merging them during off-peak hours.",
				impact: "High",
				effort: "Low",
				savings: "15-20% queue time reduction",
			},
			{
				type: "maintenance",
				title: "Express Lane Underutilized",
				description:
					"Express Lane is only 40% utilized. Consider expanding services or converting to regular lane.",
				impact: "Medium",
				effort: "Low",
				savings: "Better resource allocation",
			},
			{
				type: "expansion",
				title: "Priority Lane Overwhelmed",
				description:
					"Priority Lane wait time increased by 25% this month. Consider adding a second priority lane.",
				impact: "High",
				effort: "Medium",
				savings: "Improved accessibility compliance",
			},
		],
		performanceMetrics: [
			{
				lane: "Priority Lane",
				utilization: 95,
				avgWait: "5 mins",
				satisfaction: 4.8,
			},
			{
				lane: "Regular Lane A",
				utilization: 88,
				avgWait: "15 mins",
				satisfaction: 4.2,
			},
			{
				lane: "Regular Lane B",
				utilization: 82,
				avgWait: "12 mins",
				satisfaction: 4.1,
			},
			{
				lane: "Express Lane",
				utilization: 40,
				avgWait: "3 mins",
				satisfaction: 4.6,
			},
		],
	};

	const getRecommendationIcon = (type: string) => {
		switch (type) {
			case "optimization":
				return <TrendingUp className="w-4 h-4 text-blue-600" />;
			case "maintenance":
				return <Settings className="w-4 h-4 text-yellow-600" />;
			case "expansion":
				return <Plus className="w-4 h-4 text-green-600" />;
			default:
				return <BarChart3 className="w-4 h-4 text-gray-600" />;
		}
	};

	const getImpactBadge = (impact: string) => {
		const variants = {
			High: "bg-red-100 text-red-800",
			Medium: "bg-yellow-100 text-yellow-800",
			Low: "bg-green-100 text-green-800",
		};
		return (
			variants[impact as keyof typeof variants] || "bg-gray-100 text-gray-800"
		);
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Queue Lane Management
					</h1>
					<p className="text-gray-600">
						Manage queue lanes and optimize customer flow
					</p>
				</div>
				<Button className="gradient-primary text-white">
					<Plus className="w-4 h-4 mr-2" />
					Add Lane
				</Button>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="lanes">Queue Lanes</TabsTrigger>
					<TabsTrigger value="analysis">Lane Analysis</TabsTrigger>
					<TabsTrigger value="optimization">Optimization</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				{/* Queue Lanes Tab */}
				<TabsContent value="lanes" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Queue Lanes</CardTitle>
							<CardDescription>
								Manage and organize your queue lanes
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{queueLanes.map((lane) => (
									<div
										key={lane.id}
										className="border rounded-lg p-4 space-y-3"
									>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold text-gray-900">
														{lane.name}
													</h3>
													<Badge
														variant={
															lane.status === "active" ? "default" : "secondary"
														}
													>
														{lane.status}
													</Badge>
												</div>
												<p className="text-sm text-gray-600">
													{lane.description}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button variant="ghost" size="sm">
													<ArrowUp className="w-4 h-4" />
												</Button>
												<Button variant="ghost" size="sm">
													<ArrowDown className="w-4 h-4" />
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

										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
											<div>
												<p className="text-gray-600">Current Queue</p>
												<p className="font-semibold">
													{lane.currentQueue} people
												</p>
											</div>
											<div>
												<p className="text-gray-600">Avg Wait Time</p>
												<p className="font-semibold">{lane.avgWaitTime}</p>
											</div>
											<div>
												<p className="text-gray-600">Services</p>
												<p className="font-semibold">
													{lane.services.length} services
												</p>
											</div>
										</div>

										<div>
											<p className="text-sm text-gray-600 mb-2">
												Available Services:
											</p>
											<div className="flex flex-wrap gap-2">
												{lane.services.map((service, index) => (
													<Badge
														key={index}
														variant="outline"
														className="text-xs"
													>
														{service}
													</Badge>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Lane Analysis Tab */}
				<TabsContent value="analysis" className="space-y-6">
					{/* Performance Overview */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Customers
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{laneAnalysis.totalCustomers}
								</div>
								<p className="text-xs text-muted-foreground">Today</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Avg Wait Time
								</CardTitle>
								<Clock className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{laneAnalysis.avgWaitTime}
								</div>
								<p className="text-xs text-muted-foreground">
									Across all lanes
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Peak Hours
								</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{laneAnalysis.peakHours}
								</div>
								<p className="text-xs text-muted-foreground">Busiest period</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Efficiency
								</CardTitle>
								<BarChart3 className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{laneAnalysis.efficiency}%
								</div>
								<p className="text-xs text-muted-foreground">Overall system</p>
							</CardContent>
						</Card>
					</div>

					{/* Lane Performance Table */}
					<Card>
						<CardHeader>
							<CardTitle>Lane Performance Analysis</CardTitle>
							<CardDescription>
								Detailed metrics for each queue lane
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{laneAnalysis.performanceMetrics.map((lane) => (
									<div
										key={lane.lane}
										className="flex items-center justify-between p-4 border rounded-lg"
									>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
												<BarChart3 className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h4 className="font-medium">{lane.lane}</h4>
												<p className="text-sm text-muted-foreground">
													Utilization: {lane.utilization}%
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="flex items-center gap-4">
												<div className="text-center">
													<p className="text-sm font-medium">{lane.avgWait}</p>
													<p className="text-xs text-muted-foreground">
														Avg Wait
													</p>
												</div>
												<div className="text-center">
													<p className="text-sm font-medium">
														{lane.satisfaction}/5
													</p>
													<p className="text-xs text-muted-foreground">
														Satisfaction
													</p>
												</div>
												<Badge
													variant={
														lane.utilization > 90
															? "destructive"
															: lane.utilization > 70
															? "default"
															: "secondary"
													}
												>
													{lane.utilization > 90
														? "Overloaded"
														: lane.utilization > 70
														? "Optimal"
														: "Underutilized"}
												</Badge>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Optimization Tab */}
				<TabsContent value="optimization" className="space-y-6">
					{/* Justification for Multiple Lanes */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5 text-green-600" />
								Multiple Queue Lanes Justification
							</CardTitle>
							<CardDescription>
								Analysis supporting the current lane configuration
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="p-4 bg-green-50 rounded-lg border border-green-200">
									<h4 className="font-medium text-green-800 mb-2">
										✅ Service Differentiation
									</h4>
									<p className="text-sm text-green-700">
										Different services require varying processing times.
										Priority services (PWD, Senior) need dedicated lanes to
										maintain accessibility compliance.
									</p>
								</div>
								<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
									<h4 className="font-medium text-blue-800 mb-2">
										✅ Peak Hour Management
									</h4>
									<p className="text-sm text-blue-700">
										During peak hours (9-11 AM), multiple lanes prevent queue
										overflow and maintain reasonable wait times under 20
										minutes.
									</p>
								</div>
								<div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
									<h4 className="font-medium text-purple-800 mb-2">
										✅ Customer Segmentation
									</h4>
									<p className="text-sm text-purple-700">
										Express services (quick inquiries) can be processed
										separately from complex services (transcripts, certificates)
										to improve overall efficiency.
									</p>
								</div>
								<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
									<h4 className="font-medium text-orange-800 mb-2">
										✅ Staff Specialization
									</h4>
									<p className="text-sm text-orange-700">
										Different staff members have expertise in specific services.
										Dedicated lanes allow staff to focus on their specialties.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Optimization Recommendations */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="w-5 h-5 text-blue-600" />
								Optimization Recommendations
							</CardTitle>
							<CardDescription>
								Data-driven suggestions to improve queue efficiency
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{laneAnalysis.recommendations.map((rec, index) => (
									<div key={index} className="p-4 border rounded-lg">
										<div className="flex items-start gap-3">
											{getRecommendationIcon(rec.type)}
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h4 className="font-medium">{rec.title}</h4>
													<Badge className={getImpactBadge(rec.impact)}>
														{rec.impact} Impact
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground mb-2">
													{rec.description}
												</p>
												<div className="flex items-center gap-4 text-xs text-muted-foreground">
													<span>Effort: {rec.effort}</span>
													<span>Expected Savings: {rec.savings}</span>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Implementation Plan */}
					<Card>
						<CardHeader>
							<CardTitle>Implementation Roadmap</CardTitle>
							<CardDescription>
								Phased approach to implementing optimizations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
									<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
										1
									</div>
									<div>
										<h4 className="font-medium">
											Phase 1: Quick Wins (Week 1-2)
										</h4>
										<p className="text-sm text-muted-foreground">
											Consolidate Regular Lanes during off-peak hours
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
									<div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
										2
									</div>
									<div>
										<h4 className="font-medium">
											Phase 2: Service Optimization (Week 3-4)
										</h4>
										<p className="text-sm text-muted-foreground">
											Expand Express Lane services and convert underutilized
											capacity
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
									<div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
										3
									</div>
									<div>
										<h4 className="font-medium">
											Phase 3: Capacity Expansion (Month 2)
										</h4>
										<p className="text-sm text-muted-foreground">
											Add second Priority Lane if demand continues to increase
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent value="settings" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>General Settings</CardTitle>
								<CardDescription>
									Configure basic queue settings
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="maxTickets">Max Tickets Per User</Label>
									<Input
										id="maxTickets"
										type="number"
										defaultValue={queueSettings.maxTicketsPerUser}
										className="w-full"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="advanceBooking">Advance Booking (Days)</Label>
									<Input
										id="advanceBooking"
										type="number"
										defaultValue={queueSettings.advanceBookingDays}
										className="w-full"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="startTime">Opening Time</Label>
										<Input
											id="startTime"
											type="time"
											defaultValue={queueSettings.operatingHours.start}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="endTime">Closing Time</Label>
										<Input
											id="endTime"
											type="time"
											defaultValue={queueSettings.operatingHours.end}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Break Times</CardTitle>
								<CardDescription>
									Configure office break schedules
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{queueSettings.breakTimes.map((breakTime, index) => (
									<div key={index} className="border rounded-lg p-3 space-y-3">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">{breakTime.name}</h4>
											<Button
												variant="ghost"
												size="sm"
												className="text-red-600"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
										<div className="grid grid-cols-2 gap-3">
											<div>
												<Label className="text-xs">Start Time</Label>
												<Input
													type="time"
													defaultValue={breakTime.start}
													className="text-sm"
												/>
											</div>
											<div>
												<Label className="text-xs">End Time</Label>
												<Input
													type="time"
													defaultValue={breakTime.end}
													className="text-sm"
												/>
											</div>
										</div>
									</div>
								))}

								<Button variant="outline" className="w-full bg-transparent">
									<Plus className="w-4 h-4 mr-2" />
									Add Break Time
								</Button>
							</CardContent>
						</Card>
					</div>

					<div className="flex justify-end">
						<Button className="gradient-primary">Save Settings</Button>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
