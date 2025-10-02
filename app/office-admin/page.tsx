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
import {
	Users,
	MessageSquare,
	Star,
	ThumbsUp,
	ThumbsDown,
	AlertCircle,
	TrendingUp,
} from "lucide-react";
import { ViolationsDisplay } from "@/components/ui/violations-display";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

type DashboardFeedback = {
	id: string;
	customerName: string;
	service: string;
	rating: number;
	comment: string;
	createdAt?: string | null;
	sentiment?: "positive" | "neutral" | "negative";
};

export default function OfficeAdminDashboard() {
	const { userData } = useAuth();
	const { toast } = useToast();
	const [resolvedOffice, setResolvedOffice] = useState<string>("Registrar Office");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [totalStaff, setTotalStaff] = useState<number>(0);
	const [activeStaff, setActiveStaff] = useState<number>(0);
	const [totalServices, setTotalServices] = useState<number>(0);
	const [feedbackStats, setFeedbackStats] = useState<{
		averageRating: number;
		positivePercentage: number;
		neutralPercentage: number;
		negativePercentage: number;
		total: number;
	}>({ averageRating: 0, positivePercentage: 0, neutralPercentage: 0, negativePercentage: 0, total: 0 });
	const [recentFeedback, setRecentFeedback] = useState<DashboardFeedback[]>([]);

	useEffect(() => {
		const candidateOrder = [(userData as any)?.officeName, (userData as any)?.office];
		const next = candidateOrder.find((c) => typeof c === "string" && c.trim() !== "");
		if (typeof next === "string" && next.trim() !== "" && next !== resolvedOffice) {
			setResolvedOffice(next);
		}
	}, [userData, resolvedOffice]);

	useEffect(() => {
		const load = async () => {
			const office = resolvedOffice;
			if (!office || office.trim() === "") return;
			setIsLoading(true);
			try {
				const [staffRes, servicesRes, fbStatsRes, fbListRes] = await Promise.all([
					fetch(`/api/office-admin/staff?office=${encodeURIComponent(office)}`, { cache: "no-store" }),
					fetch(`/api/office-admin/services?office=${encodeURIComponent(office)}`, { cache: "no-store" }),
					fetch(`/api/feedback?officeId=${encodeURIComponent(office)}&stats=true`, { cache: "no-store" }),
					fetch(`/api/feedback?officeId=${encodeURIComponent(office)}&limit=5`, { cache: "no-store" }),
				]);

				const [staffJson, servicesJson, fbStatsJson, fbListJson] = await Promise.all([
					staffRes.json(),
					servicesRes.json(),
					fbStatsRes.json(),
					fbListRes.json(),
				]);

				if (staffJson?.success && Array.isArray(staffJson.staff)) {
					setTotalStaff(staffJson.staff.length);
					setActiveStaff(
						staffJson.staff.filter((s: any) => s.status === "Online").length
					);
				} else {
					setTotalStaff(0);
					setActiveStaff(0);
				}

				if (servicesJson?.success && Array.isArray(servicesJson.services)) {
					setTotalServices(servicesJson.services.length);
				} else {
					setTotalServices(0);
				}

				if (fbStatsJson?.success && fbStatsJson.stats) {
					setFeedbackStats({
						averageRating: fbStatsJson.stats.averageRating ?? 0,
						positivePercentage: fbStatsJson.stats.positivePercentage ?? 0,
						neutralPercentage: fbStatsJson.stats.neutralPercentage ?? 0,
						negativePercentage: fbStatsJson.stats.negativePercentage ?? 0,
						total: fbStatsJson.stats.total ?? 0,
					});
				} else {
					setFeedbackStats({ averageRating: 0, positivePercentage: 0, neutralPercentage: 0, negativePercentage: 0, total: 0 });
				}

				if (fbListJson?.success && Array.isArray(fbListJson.feedback)) {
					setRecentFeedback(
						fbListJson.feedback.map((f: any) => ({
							id: f.id,
							customerName: f.customerName ?? "Anonymous",
							service: f.service ?? "",
							rating: typeof f.rating === "number" ? f.rating : 0,
							comment: f.comment ?? "",
							createdAt: f.createdAt ?? null,
							sentiment: f.sentiment,
						}))
					);
				} else {
					setRecentFeedback([]);
				}
			} catch (_e) {
				toast({ title: "Failed to load dashboard", description: "Please try again.", variant: "destructive" });
			} finally {
				setIsLoading(false);
			}
		};

		load();
	}, [resolvedOffice, toast]);

	const ratingBreakdown = useMemo(() => {
		// Build counts from recent feedback if available; stats API does not return per-star counts
		const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		for (const f of recentFeedback) {
			if (typeof f.rating === "number" && f.rating >= 1 && f.rating <= 5) counts[f.rating as 1 | 2 | 3 | 4 | 5] += 1;
		}
		const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
		return [5, 4, 3, 2, 1].map((r) => ({
			rating: r,
			count: counts[r as 1 | 2 | 3 | 4 | 5],
			percentage: Math.round((counts[r as 1 | 2 | 3 | 4 | 5] / total) * 100),
			color:
				r >= 4
					? r === 5
						? "bg-green-500"
						: "bg-green-400"
					: r === 3
					? "bg-yellow-500"
					: r === 2
					? "bg-orange-500"
					: "bg-red-500",
		}));
	}, [recentFeedback]);

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071952]">
					Dashboard
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					{resolvedOffice} overview and customer feedback analysis
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Staff</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalStaff}</div>
						<p className="text-xs text-muted-foreground">Assigned to office</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Staff</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeStaff}</div>
						<p className="text-xs text-muted-foreground">Currently online</p>
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
						<div className="text-2xl font-bold">{feedbackStats.positivePercentage}%</div>
						<p className="text-xs text-muted-foreground">Positive feedback</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Services
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalServices}</div>
						<p className="text-xs text-muted-foreground">Available services</p>
					</CardContent>
				</Card>
			</div>

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
								<span className="text-2xl sm:text-3xl font-bold">{feedbackStats.averageRating.toFixed(1)}</span>
								<span className="text-sm sm:text-base text-muted-foreground">/ 5.0</span>
							</div>
							<p className="text-xs sm:text-sm text-muted-foreground">Based on {feedbackStats.total} reviews</p>
						</div>

						{/* Rating Breakdown */}
						<div className="space-y-2 sm:space-y-3">
							{ratingBreakdown.map((item) => (
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
									<span className="text-sm sm:text-lg font-bold text-green-600">{feedbackStats.positivePercentage}%</span>
								</div>
								<p className="text-xs text-muted-foreground">Positive</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
									<span className="text-xs sm:text-lg font-bold text-gray-600">{feedbackStats.neutralPercentage}%</span>
								</div>
								<p className="text-xs text-muted-foreground">Neutral</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1 mb-1">
									<ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
									<span className="text-sm sm:text-lg font-bold text-red-600">{feedbackStats.negativePercentage}%</span>
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
										<span className="font-medium text-xs sm:text-sm truncate">{feedback.customerName}</span>
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
										<span className="text-xs text-muted-foreground">{feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : ""}</span>
										<Badge
											variant={
												feedback.sentiment === "positive"
													? "default"
													: "destructive"
											}
											className="text-xs"
										>
											{feedback.sentiment || ""}
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
