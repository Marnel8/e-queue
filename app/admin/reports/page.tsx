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
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Download,
	TrendingUp,
	TrendingDown,
	Users,
	Clock,
	Star,
	AlertCircle,
} from "lucide-react";

export default function ReportsPage() {
	const [timeRange, setTimeRange] = useState("7d");
	const [reportType, setReportType] = useState("overview");
	const [loading, setLoading] = useState(true);
	const [reports, setReports] = useState<{
		systemMetrics: {
			totalTickets: number | null;
			avgWaitTime: number | null;
			customerSatisfaction: number | null;
			systemUptime: number | null;
			peakHours: string | null;
			busiestOffice: string | null;
			violations: number | null;
		};
		officePerformance: Array<{
			office: string;
			tickets: number | null;
			avgWait: number | null;
			satisfaction: number | null;
			efficiency: number | null;
		}>;
		weeklyTrends: Array<{ day: string; tickets: number; avgWait: number | null }>;
	} | null>(null);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/admin/metrics", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ range: timeRange }),
					cache: "no-store",
				});
				const text = await res.text();
				let json: any = null;
				try {
					json = text ? JSON.parse(text) : null;
				} catch (e) {
					console.error("Non-JSON response from /api/admin/metrics (reports):", text);
				}
				if (isMounted && json?.success) setReports(json.data);
			} catch (e) {
				console.error(e);
			} finally {
				if (isMounted) setLoading(false);
			}
		})();
		return () => {
			isMounted = false;
		};
	}, [timeRange]);

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="border-b border-gray-200 pb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Reports & Analytics
				</h1>
				<p className="mt-2 text-gray-600">
					System-wide performance and usage analytics
				</p>
			</div>

			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex flex-col sm:flex-row gap-3">
						<Select value={timeRange} onValueChange={setTimeRange}>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="24h">Last 24 Hours</SelectItem>
								<SelectItem value="7d">Last 7 Days</SelectItem>
								<SelectItem value="30d">Last 30 Days</SelectItem>
								<SelectItem value="90d">Last 3 Months</SelectItem>
							</SelectContent>
						</Select>
						<Select value={reportType} onValueChange={setReportType}>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="overview">Overview</SelectItem>
								<SelectItem value="performance">Performance</SelectItem>
								<SelectItem value="satisfaction">Satisfaction</SelectItem>
								<SelectItem value="usage">Usage Patterns</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button className="bg-primary hover:bg-primary/90">
						<Download className="w-4 h-4 mr-2" />
						Export Report
					</Button>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Tickets Issued
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{reports?.systemMetrics?.totalTickets?.toLocaleString()}
							</div>
							<div className="flex items-center text-xs text-green-600">
								<TrendingUp className="w-3 h-3 mr-1" />
								+12.5% from last period
							</div>
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
							<div className="text-2xl font-bold">
								{reports?.systemMetrics?.avgWaitTime} min
							</div>
							<div className="flex items-center text-xs text-green-600">
								<TrendingDown className="w-3 h-3 mr-1" />
								-8.2% improvement
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Customer Satisfaction
							</CardTitle>
							<Star className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{reports?.systemMetrics?.customerSatisfaction}/5.0
							</div>
							<div className="flex items-center text-xs text-green-600">
								<TrendingUp className="w-3 h-3 mr-1" />
								+0.3 from last period
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Office Performance */}
				<Card>
					<CardHeader>
						<CardTitle>Office Performance Overview</CardTitle>
						<CardDescription>
							Detailed performance metrics by office
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4 font-medium">Office</th>
										<th className="text-left py-3 px-4 font-medium">Tickets</th>
										<th className="text-left py-3 px-4 font-medium">
											Avg. Wait
										</th>
										<th className="text-left py-3 px-4 font-medium">
											Satisfaction
										</th>
										<th className="text-left py-3 px-4 font-medium">
											Efficiency
										</th>
									</tr>
								</thead>
								<tbody>
									{reports?.officePerformance?.map((office, index) => (
										<tr key={index} className="border-b hover:bg-gray-50">
											<td className="py-3 px-4 font-medium">{office.office}</td>
											<td className="py-3 px-4">
												{office.tickets?.toLocaleString()}
											</td>
											<td className="py-3 px-4">{office.avgWait} min</td>
											<td className="py-3 px-4">
												<div className="flex items-center">
													<Star className="w-4 h-4 text-yellow-400 mr-1" />
													{office.satisfaction}
												</div>
											</td>
											<td className="py-3 px-4">
												<Badge
													variant={
														office.efficiency >= 90
															? "default"
															: office.efficiency >= 80
															? "secondary"
															: "destructive"
													}
													className={
														office.efficiency >= 90
															? "bg-green-100 text-green-800"
															: office.efficiency >= 80
															? "bg-yellow-100 text-yellow-800"
															: ""
													}
												>
													{office.efficiency}%
												</Badge>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				{/* Weekly Trends */}
				<Card>
					<CardHeader>
						<CardTitle>Weekly Usage Trends</CardTitle>
						<CardDescription>
							Daily ticket volume and wait time patterns
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{reports?.weeklyTrends?.map((day, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
								>
									<div className="flex items-center space-x-4">
										<div className="font-medium w-12">{day.day}</div>
										<div className="flex items-center space-x-2">
											<Users className="w-4 h-4 text-gray-500" />
											<span>{day.tickets} tickets</span>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Clock className="w-4 h-4 text-gray-500" />
										<span>{day.avgWait} min avg</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* System Health */}
				<Card>
					<CardHeader>
						<CardTitle>System Health & Status</CardTitle>
						<CardDescription>
							Current system performance indicators
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">System Uptime</span>
									<Badge className="bg-green-100 text-green-800">
										{reports?.systemMetrics?.systemUptime}%
									</Badge>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Peak Hours</span>
									<span className="text-sm text-gray-600">
										{reports?.systemMetrics?.peakHours}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Busiest Office</span>
									<span className="text-sm text-gray-600">
										{reports?.systemMetrics?.busiestOffice}
									</span>
								</div>
							</div>
							<div className="space-y-4">
								<div className="flex items-center space-x-2 text-green-600">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-sm">All services operational</span>
								</div>
								<div className="flex items-center space-x-2 text-green-600">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-sm">Database connections stable</span>
								</div>
								<div className="flex items-center space-x-2 text-yellow-600">
									<AlertCircle className="w-4 h-4" />
									<span className="text-sm">2 minor alerts (non-critical)</span>
								</div>
								<div className="flex items-center space-x-2 text-red-600">
									<AlertCircle className="w-4 h-4" />
									<span className="text-sm">
										{reports?.systemMetrics?.violations} flagged user violations
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
