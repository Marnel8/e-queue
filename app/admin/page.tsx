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
} from "lucide-react";

export default function AdminDashboard() {
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
		</div>
	);
}
