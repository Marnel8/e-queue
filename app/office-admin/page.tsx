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
	TrendingUp,
	MessageSquare,
	Star,
	ThumbsUp,
	ThumbsDown,
	AlertCircle,
	Monitor,
	UserCheck,
	Coffee,
} from "lucide-react";
import { ViolationsDisplay } from "@/components/ui/violations-display";

const feedbackData = [
	{
		rating: 5,
		count: 234,
		percentage: 68,
		color: "bg-green-500",
	},
	{
		rating: 4,
		count: 89,
		percentage: 26,
		color: "bg-green-400",
	},
	{
		rating: 3,
		count: 15,
		percentage: 4,
		color: "bg-yellow-500",
	},
	{
		rating: 2,
		count: 5,
		percentage: 1,
		color: "bg-orange-500",
	},
	{
		rating: 1,
		count: 2,
		percentage: 1,
		color: "bg-red-500",
	},
];

const recentFeedback = [
	{
		id: 1,
		customer: "Juan Dela Cruz",
		service: "Transcript Request",
		rating: 5,
		comment:
			"Very efficient service! The staff was helpful and the process was quick.",
		date: "2024-01-15 10:30 AM",
		sentiment: "positive",
	},
	{
		id: 2,
		customer: "Maria Garcia",
		service: "Certificate Issuance",
		rating: 4,
		comment: "Good service overall, but the waiting time could be improved.",
		date: "2024-01-15 09:45 AM",
		sentiment: "positive",
	},
	{
		id: 3,
		customer: "Pedro Santos",
		service: "Enrollment",
		rating: 2,
		comment:
			"Long waiting time and confusing process. Staff needs better training.",
		date: "2024-01-15 08:20 AM",
		sentiment: "negative",
	},
];

const deskData = [
	{
		id: 1,
		name: "Desk 1",
		assignedStaff: "Ana Rodriguez",
		status: "active",
		currentTicket: "TR-001",
		queueLength: 3,
		avgServiceTime: "4.2m",
	},
	{
		id: 2,
		name: "Desk 2",
		assignedStaff: "Carlos Mendoza",
		status: "active",
		currentTicket: "CI-015",
		queueLength: 5,
		avgServiceTime: "5.1m",
	},
	{
		id: 3,
		name: "Desk 3",
		assignedStaff: "Elena Santos",
		status: "break",
		currentTicket: null,
		queueLength: 0,
		avgServiceTime: "3.8m",
	},
	{
		id: 4,
		name: "Desk 4",
		assignedStaff: null,
		status: "inactive",
		currentTicket: null,
		queueLength: 0,
		avgServiceTime: "0m",
	},
];

export default function OfficeAdminDashboard() {
	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071952]">
					Dashboard
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Registrar Office overview and customer feedback analysis
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Today's Queue</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">47</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600">+8</span> from yesterday
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Avg. Wait Time
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">6.2m</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600">-1.3m</span> improvement
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Satisfaction Rate
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">94%</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600">+2%</span> this week
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Staff Online</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">6/8</div>
						<p className="text-xs text-muted-foreground">2 on break</p>
					</CardContent>
				</Card>
			</div>

			{/* Desk Management */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
						<Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
						Desk Management
					</CardTitle>
					<CardDescription className="text-xs sm:text-sm">
						Real-time desk status and staff assignments
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{deskData.map((desk) => (
							<div
								key={desk.id}
								className={`rounded-lg border p-4 space-y-3 ${
									desk.status === "active"
										? "border-green-200 bg-green-50"
										: desk.status === "break"
										? "border-yellow-200 bg-yellow-50"
										: "border-gray-200 bg-gray-50"
								}`}
							>
								<div className="flex items-center justify-between">
									<h4 className="font-medium text-sm">{desk.name}</h4>
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
										{desk.status === "active" && <UserCheck className="w-3 h-3 mr-1" />}
										{desk.status === "break" && <Coffee className="w-3 h-3 mr-1" />}
										{desk.status}
									</Badge>
								</div>
								
								<div className="space-y-2">
									<div className="text-xs text-muted-foreground">
										<span className="font-medium">Staff:</span>{" "}
										{desk.assignedStaff || "Unassigned"}
									</div>
									
									{desk.currentTicket && (
										<div className="text-xs text-muted-foreground">
											<span className="font-medium">Current:</span>{" "}
											{desk.currentTicket}
										</div>
									)}
									
									<div className="text-xs text-muted-foreground">
										<span className="font-medium">Queue:</span>{" "}
										{desk.queueLength} tickets
									</div>
									
									<div className="text-xs text-muted-foreground">
										<span className="font-medium">Avg. Time:</span>{" "}
										{desk.avgServiceTime}
									</div>
								</div>
								
								<Button
									variant="outline"
									size="sm"
									className="w-full text-xs"
									disabled={desk.status === "inactive"}
								>
									Manage Desk
								</Button>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
				{/* Customer Feedback Analysis */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
							<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
							Customer Feedback Analysis
						</CardTitle>
						<CardDescription className="text-xs sm:text-sm">
							Rating distribution and satisfaction metrics
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 sm:space-y-6">
						{/* Overall Rating */}
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-2">
								<Star className="w-6 h-6 sm:w-8 sm:h-8 fill-yellow-400 text-yellow-400" />
								<span className="text-2xl sm:text-3xl font-bold">4.6</span>
								<span className="text-sm sm:text-base text-muted-foreground">
									/ 5.0
								</span>
							</div>
							<p className="text-xs sm:text-sm text-muted-foreground">
								Based on 345 reviews this month
							</p>
						</div>

						{/* Rating Breakdown */}
						<div className="space-y-2 sm:space-y-3">
							{feedbackData.map((item) => (
								<div
									key={item.rating}
									className="flex items-center gap-2 sm:gap-3"
								>
									<div className="flex items-center gap-1 w-8 sm:w-12">
										<span className="text-xs sm:text-sm">{item.rating}</span>
										<Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<div className="flex-1 bg-muted rounded-full h-1.5 sm:h-2">
												<div
													className={`h-1.5 sm:h-2 rounded-full ${item.color}`}
													style={{ width: `${item.percentage}%` }}
												/>
											</div>
											<span className="text-xs sm:text-sm text-muted-foreground w-8 sm:w-12 text-right">
												{item.count}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Sentiment Analysis */}
						<div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t">
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
									<span className="text-sm sm:text-lg font-bold text-green-600">
										89%
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Positive</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
									<span className="text-sm sm:text-lg font-bold text-gray-600">
										8%
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Neutral</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
									<span className="text-sm sm:text-lg font-bold text-red-600">
										3%
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Negative</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Feedback */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="text-base sm:text-lg">
							Recent Customer Feedback
						</CardTitle>
						<CardDescription className="text-xs sm:text-sm">
							Latest reviews and comments from customers
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 sm:space-y-4">
							{recentFeedback.map((feedback) => (
								<div
									key={feedback.id}
									className="border rounded-lg p-3 sm:p-4 space-y-2"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<span className="font-medium text-xs sm:text-sm truncate">
												{feedback.customer}
											</span>
											<Badge variant="outline" className="text-xs shrink-0">
												{feedback.service}
											</Badge>
										</div>
										<div className="flex items-center gap-0.5 shrink-0">
											{Array.from({ length: 5 }).map((_, i) => (
												<Star
													key={i}
													className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
														i < feedback.rating
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
									</div>
									<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
										{feedback.comment}
									</p>
									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											{feedback.date}
										</span>
										<Badge
											variant={
												feedback.sentiment === "positive"
													? "default"
													: "destructive"
											}
											className="text-xs"
										>
											{feedback.sentiment}
										</Badge>
									</div>
								</div>
							))}
						</div>
						<Button
							variant="outline"
							className="w-full mt-4 bg-transparent text-xs sm:text-sm"
						>
							View All Feedback
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Service Performance */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base sm:text-lg">
						Service Performance
					</CardTitle>
					<CardDescription className="text-xs sm:text-sm">
						Performance metrics for each service offered
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Transcript Request</span>
									<span className="text-green-600">96%</span>
								</div>
								<Progress value={96} className="h-2" />
								<p className="text-xs text-muted-foreground">
									Avg. 4.2 min wait time
								</p>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Certificate Issuance</span>
									<span className="text-green-600">94%</span>
								</div>
								<Progress value={94} className="h-2" />
								<p className="text-xs text-muted-foreground">
									Avg. 6.8 min wait time
								</p>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Enrollment Services</span>
									<span className="text-yellow-600">87%</span>
								</div>
								<Progress value={87} className="h-2" />
								<p className="text-xs text-muted-foreground">
									Avg. 12.3 min wait time
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* User Violations */}
			<ViolationsDisplay userRole="office-admin" showActions={true} />

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
					<CardDescription className="text-xs sm:text-sm">
						Common office management tasks
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
						<Button
							variant="outline"
							className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 bg-transparent"
						>
							<Users className="w-4 h-4 sm:w-6 sm:h-6" />
							<span className="text-xs sm:text-sm">Manage Staff</span>
						</Button>

						<Button
							variant="outline"
							className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 bg-transparent"
						>
							<MessageSquare className="w-4 h-4 sm:w-6 sm:h-6" />
							<span className="text-xs sm:text-sm">View Feedback</span>
						</Button>

						<Button
							variant="outline"
							className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 bg-transparent"
						>
							<AlertCircle className="w-4 h-4 sm:w-6 sm:h-6" />
							<span className="text-xs sm:text-sm">Create Announcement</span>
						</Button>

						<Button
							variant="outline"
							className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 bg-transparent"
						>
							<TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
							<span className="text-xs sm:text-sm">View Reports</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
