"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	Shield,
	UserX,
	Lock,
	Clock,
	Search,
	Filter,
	Eye,
	Ban,
	CheckCircle,
	XCircle,
	Users,
	AlertCircle,
} from "lucide-react";
import { ViolationsDisplay } from "@/components/ui/violations-display";

interface ViolationStats {
	total: number;
	active: number;
	resolved: number;
	pending: number;
	byType: Record<string, number>;
	bySeverity: Record<string, number>;
}

export default function OfficeAdminViolationsPage() {
	const { user } = useAuth();
	const [stats, setStats] = useState<ViolationStats>({
		total: 0,
		active: 0,
		resolved: 0,
		pending: 0,
		byType: {},
		bySeverity: {}
	});
	const [loading, setLoading] = useState(true);

	// Load violation statistics
	useEffect(() => {
		const loadStats = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/violations/stats");
				if (response.ok) {
					const data = await response.json();
					setStats(data.stats || {
						total: 0,
						active: 0,
						resolved: 0,
						pending: 0,
						byType: {},
						bySeverity: {}
					});
				}
			} catch (error) {
				console.error("Error loading violation stats:", error);
			} finally {
				setLoading(false);
			}
		};

		loadStats();
	}, []);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-[#071952]">User Violations</h1>
				<p className="text-gray-600 mt-2">
					Monitor and manage user compliance and violations
				</p>
			</div>

			{/* Violations Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-red-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Active Violations
						</CardTitle>
						<div className="p-2 bg-red-500/10 rounded-lg">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-red-600 mb-1">
							{loading ? "..." : stats.active}
						</div>
						<p className="text-sm text-gray-500">
							Requires immediate attention
						</p>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-yellow-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Pending Review
						</CardTitle>
						<div className="p-2 bg-yellow-500/10 rounded-lg">
							<Clock className="h-5 w-5 text-yellow-600" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-yellow-600 mb-1">
							{loading ? "..." : stats.pending}
						</div>
						<p className="text-sm text-gray-500">Awaiting investigation</p>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-green-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Resolved
						</CardTitle>
						<div className="p-2 bg-green-500/10 rounded-lg">
							<CheckCircle className="h-5 w-5 text-green-600" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-green-600 mb-1">
							{loading ? "..." : stats.resolved}
						</div>
						<p className="text-sm text-gray-500">Successfully handled</p>
					</CardContent>
				</Card>

				<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-blue-50/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
						<CardTitle className="text-sm font-semibold text-gray-600">
							Total Violations
						</CardTitle>
						<div className="p-2 bg-blue-500/10 rounded-lg">
							<Users className="h-5 w-5 text-blue-600" />
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="text-3xl font-bold text-blue-600 mb-1">
							{loading ? "..." : stats.total}
						</div>
						<p className="text-sm text-gray-500">All violations</p>
					</CardContent>
				</Card>
			</div>

			{/* Violations Management */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Violations Display */}
				<div className="lg:col-span-2">
					<ViolationsDisplay userRole="office-admin" showActions={true} />
				</div>

				{/* Violations Statistics */}
				<div className="space-y-6">
					{/* Violation Types Breakdown */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-[#071952]">
								Violation Types
							</CardTitle>
							<CardDescription>Breakdown by violation category</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								{Object.entries(stats.byType).map(([type, count]) => {
									const typeColors = {
										security: { bg: "bg-red-500", badge: "bg-red-100 text-red-700" },
										fraud: { bg: "bg-orange-500", badge: "bg-orange-100 text-orange-700" },
										abuse: { bg: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
										attendance: { bg: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
										compliance: { bg: "bg-purple-500", badge: "bg-purple-100 text-purple-700" }
									};
									const colors = typeColors[type as keyof typeof typeColors] || { bg: "bg-gray-500", badge: "bg-gray-100 text-gray-700" };
									
									return (
										<div key={type} className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className={`w-3 h-3 ${colors.bg} rounded-full`}></div>
												<span className="text-sm font-medium capitalize">{type}</span>
											</div>
											<Badge className={colors.badge}>
												{loading ? "..." : count}
											</Badge>
										</div>
									);
								})}
								{Object.keys(stats.byType).length === 0 && !loading && (
									<div className="text-center text-gray-500 text-sm py-4">
										No violations by type
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Recent Actions */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-[#071952]">
								Recent Actions
							</CardTitle>
							<CardDescription>
								Latest violation management activities
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
									<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900">
											Violation resolved
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Juan Dela Cruz - Login attempts
										</p>
										<p className="text-xs text-gray-400">2 minutes ago</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
									<Ban className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900">
											User banned
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Maria Santos - Fraudulent activity
										</p>
										<p className="text-xs text-gray-400">15 minutes ago</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
									<Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900">
											Investigation started
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Pedro Garcia - Queue abuse
										</p>
										<p className="text-xs text-gray-400">1 hour ago</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

				</div>
			</div>
		</div>
	);
}
