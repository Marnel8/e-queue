"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function AdminDashboard() {
	const [isLoading, setIsLoading] = useState(true);
	const [metrics, setMetrics] = useState<{
		totalUsers: number;
		activeOffices: number;
		avgWaitMinutes: number | null;
		queueEfficiencyPercent: number | null;
		systemStatus: {
			databaseHealthy: boolean;
			queueActive: boolean | null;
			notificationsStatus: "active" | "warning" | "inactive" | "unknown";
			authenticationSecure: boolean;
		};
		recentActivity: {
			id: string;
			title: string;
			description: string;
			level: "info" | "warning" | "error" | "success";
			timestamp: string;
		}[];
		officePerformance: {
			officeId: string;
			officeName: string;
			efficiencyPercent: number | null;
		}[];
	} | null>(null);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const res = await fetch("/api/admin/metrics", { cache: "no-store" });
				const text = await res.text();
				let json: any = null;
				try {
					json = text ? JSON.parse(text) : null;
				} catch (e) {
					console.error("Non-JSON response from /api/admin/metrics:", text);
				}
				if (isMounted && json?.success) {
					setMetrics(json.data);
				}
			} catch (e) {
				console.error(e);
			} finally {
				if (isMounted) setIsLoading(false);
			}
		})();
		return () => {
			isMounted = false;
		};
	}, []);

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
						<div className="text-3xl font-bold text-[#071952] mb-1">{isLoading ? "…" : (metrics?.totalUsers ?? 0).toLocaleString()}</div>
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
						<div className="text-3xl font-bold text-[#071952] mb-1">{isLoading ? "…" : (metrics?.activeOffices ?? 0).toLocaleString()}</div>
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
						<div className="text-3xl font-bold text-[#071952] mb-1">{isLoading ? "…" : (metrics?.avgWaitMinutes != null ? `${metrics.avgWaitMinutes.toFixed(1)}m` : "—")}</div>
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
						<div className="text-3xl font-bold text-[#071952] mb-1">{isLoading ? "…" : (metrics?.queueEfficiencyPercent != null ? `${metrics.queueEfficiencyPercent.toFixed(1)}%` : "—")}</div>
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
								{metrics?.systemStatus?.databaseHealthy === false ? "Issue" : "Healthy"}
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
								{metrics?.systemStatus?.queueActive == null ? "Unknown" : metrics?.systemStatus?.queueActive ? "Active" : "Inactive"}
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
								{metrics?.systemStatus?.notificationsStatus === "active" ? "Active" : metrics?.systemStatus?.notificationsStatus === "warning" ? "Warning" : "Unknown"}
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
								{metrics?.systemStatus?.authenticationSecure === false ? "Issue" : "Secure"}
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
							{(metrics?.recentActivity ?? []).map((item) => (
								<div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
									<div className={`w-2 h-2 ${item.level === "error" ? "bg-red-500" : item.level === "warning" ? "bg-amber-500" : item.level === "success" ? "bg-emerald-500" : "bg-[#088395]"} rounded-full mt-2 flex-shrink-0`}></div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900">{item.title}</p>
										<p className="text-xs text-gray-500 mt-1">{item.description} - {new Date(item.timestamp).toLocaleString()}</p>
									</div>
								</div>
							))}
							{(metrics?.recentActivity ?? []).length === 0 && (
								<div className="text-sm text-gray-500">No recent activity.</div>
							)}
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
						{(metrics?.officePerformance ?? []).map((op) => (
							<div key={op.officeId} className="space-y-3 p-4 bg-gray-50 rounded-lg">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-gray-700">
										{op.officeName}
									</span>
									<span className={`text-sm font-bold ${op.efficiencyPercent == null ? "text-gray-500" : op.efficiencyPercent >= 90 ? "text-emerald-600" : op.efficiencyPercent >= 80 ? "text-amber-600" : "text-red-600"}`}>
										{op.efficiencyPercent == null ? "—" : `${op.efficiencyPercent.toFixed(0)}%`}
									</span>
								</div>
								<Progress value={op.efficiencyPercent ?? 0} className="h-2" />
							</div>
						))}
						{(metrics?.officePerformance ?? []).length === 0 && (
							<div className="text-sm text-gray-500">No office performance data.</div>
						)}
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
						<Link href="/admin/users" className="h-24">
							<Button
								variant="outline"
								className="h-full w-full flex flex-col gap-3 bg-white hover:bg-[#071952]/5 hover:border-[#071952]/20 transition-all duration-200 border-gray-200"
							>
								<div className="p-2 bg-[#071952]/10 rounded-lg">
									<Users className="w-6 h-6 text-[#071952]" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									Add User
								</span>
							</Button>
						</Link>

						<Link href="/admin/offices" className="h-24">
							<Button
								variant="outline"
								className="h-full w-full flex flex-col gap-3 bg-white hover:bg-[#088395]/5 hover:border-[#088395]/20 transition-all duration-200 border-gray-200"
							>
								<div className="p-2 bg-[#088395]/10 rounded-lg">
									<Building2 className="w-6 h-6 text-[#088395]" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									New Office
								</span>
							</Button>
						</Link>

						<Link href="/admin/reports" className="h-24">
							<Button
								variant="outline"
								className="h-full w-full flex flex-col gap-3 bg-white hover:bg-[#37B7C3]/5 hover:border-[#37B7C3]/20 transition-all duration-200 border-gray-200"
							>
								<div className="p-2 bg-[#37B7C3]/10 rounded-lg">
									<BarChart3 className="w-6 h-6 text-[#37B7C3]" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									View Reports
								</span>
							</Button>
						</Link>

						<Link href="/admin/settings" className="h-24">
							<Button
								variant="outline"
								className="h-full w-full flex flex-col gap-3 bg-white hover:bg-gray-500/5 hover:border-gray-500/20 transition-all duration-200 border-gray-200"
							>
								<div className="p-2 bg-gray-500/10 rounded-lg">
									<Settings className="w-6 h-6 text-gray-600" />
								</div>
								<span className="text-sm font-medium text-gray-700">
									System Settings
								</span>
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
