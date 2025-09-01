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
	MessageSquare,
	Star,
	TrendingUp,
	Edit,
	Trash2,
	Eye,
} from "lucide-react";

export default function FeedbackFormsPage() {
	const [activeTab, setActiveTab] = useState("recent");

	// Using the exact same recent feedback data as staff page
	const recentFeedback = [
		{
			id: 1,
			customerName: "Juan Dela Cruz",
			service: "Transcript Request",
			rating: 5,
			comment:
				"Very efficient service! The staff was helpful and the process was quick.",
			date: "2024-01-15 10:30 AM",
			sentiment: "positive",
		},
		{
			id: 2,
			customerName: "Maria Garcia",
			service: "Certificate Issuance",
			rating: 4,
			comment: "Good service overall, but the waiting time could be improved.",
			date: "2024-01-15 09:45 AM",
			sentiment: "positive",
		},
		{
			id: 3,
			customerName: "Pedro Santos",
			service: "Enrollment",
			rating: 2,
			comment:
				"Long waiting time and confusing process. Staff needs better training.",
			date: "2024-01-15 08:20 AM",
			sentiment: "negative",
		},
	];

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

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">System Evaluation</h1>
				<p className="text-gray-600">
					View customer feedback and system evaluation analytics
				</p>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="recent">Recent Feedback</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
				</TabsList>

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
											<SelectItem value="all">All Services</SelectItem>
											<SelectItem value="transcript">Transcript</SelectItem>
											<SelectItem value="certificate">Certificate</SelectItem>
											<SelectItem value="enrollment">Enrollment</SelectItem>
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
													<Badge
														className={getSentimentColor(feedback.sentiment)}
													>
														{feedback.sentiment}
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
														{feedback.date}
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
					{/* Feedback Statistics - Using exact same data as staff page */}
					<Card>
						<CardHeader>
							<CardTitle>Feedback Statistics</CardTitle>
							<CardDescription>
								Overall feedback metrics and performance
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">345</div>
									<p className="text-xs text-muted-foreground">
										Total Feedback
									</p>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-yellow-600">4.6</div>
									<p className="text-xs text-muted-foreground">
										Average Rating
									</p>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">94%</div>
									<p className="text-xs text-muted-foreground">Positive</p>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">4.6</div>
									<p className="text-xs text-muted-foreground">Overall Avg</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Rating Distribution</CardTitle>
								<CardDescription>Breakdown of customer ratings</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[5, 4, 3, 2, 1].map((rating) => {
										// Calculate percentages based on staff data (4.6 average rating)
										const percentages = [60, 25, 10, 3, 2]; // 5★: 60%, 4★: 25%, 3★: 10%, 2★: 3%, 1★: 2%
										const percentage = percentages[5 - rating];

										return (
											<div key={rating} className="flex items-center gap-3">
												<div className="flex items-center gap-1 w-12">
													<span className="text-sm font-medium">{rating}</span>
													<Star className="w-3 h-3 text-yellow-500 fill-current" />
												</div>
												<div className="flex-1 bg-gray-200 rounded-full h-2">
													<div
														className="bg-[#088395] h-2 rounded-full"
														style={{ width: `${percentage}%` }}
													/>
												</div>
												<span className="text-sm text-gray-600 w-12 text-right">
													{percentage}%
												</span>
											</div>
										);
									})}
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
										<span className="text-green-800 font-semibold">94%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 bg-yellow-500 rounded-full" />
											<span className="font-medium text-yellow-800">
												Neutral
											</span>
										</div>
										<span className="text-yellow-800 font-semibold">4%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-3 h-3 bg-red-500 rounded-full" />
											<span className="font-medium text-red-800">Negative</span>
										</div>
										<span className="text-red-800 font-semibold">2%</span>
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
