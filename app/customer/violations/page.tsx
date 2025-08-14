"use client";

import { CustomerLayout } from "@/components/customer/layout";
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
	AlertTriangle,
	Shield,
	CheckCircle,
	Clock,
	AlertCircle,
	Info,
} from "lucide-react";
import { ViolationsDisplay } from "@/components/ui/violations-display";

export default function CustomerViolationsPage() {
	return (
		<CustomerLayout
			title="Account Violations"
			description="Review your account status and any violations"
		>
			<div className="space-y-6">
				{/* Account Status Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
							<CardTitle className="text-sm font-semibold text-gray-600">
								Account Status
							</CardTitle>
							<div className="p-2 bg-green-500/10 rounded-lg">
								<Shield className="h-5 w-5 text-green-600" />
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-2xl font-bold text-green-600 mb-1">
								Active
							</div>
							<p className="text-sm text-gray-500">
								Your account is in good standing
							</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
							<CardTitle className="text-sm font-semibold text-gray-600">
								Violation Score
							</CardTitle>
							<div className="p-2 bg-blue-500/10 rounded-lg">
								<AlertTriangle className="h-5 w-5 text-blue-600" />
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-2xl font-bold text-blue-600 mb-1">Low</div>
							<p className="text-sm text-gray-500">Minimal risk level</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
							<CardTitle className="text-sm font-semibold text-gray-600">
								Last Review
							</CardTitle>
							<div className="p-2 bg-gray-500/10 rounded-lg">
								<Clock className="h-5 w-5 text-gray-600" />
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="text-2xl font-bold text-gray-600 mb-1">
								2 days
							</div>
							<p className="text-sm text-gray-500">
								Since last violation check
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Violations Display */}
				<ViolationsDisplay userRole="customer" showActions={false} />

				{/* Account Guidelines */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Info className="w-5 h-5 text-blue-600" />
							Account Guidelines
						</CardTitle>
						<CardDescription>
							Important information about maintaining a good account standing
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<h4 className="font-semibold text-gray-900">Do's</h4>
								<ul className="space-y-2 text-sm text-gray-600">
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>Attend scheduled appointments on time</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>Provide accurate information when booking</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>Cancel tickets in advance if unable to attend</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>Follow office rules and regulations</span>
									</li>
								</ul>
							</div>

							<div className="space-y-3">
								<h4 className="font-semibold text-gray-900">Don'ts</h4>
								<ul className="space-y-2 text-sm text-gray-600">
									<li className="flex items-start gap-2">
										<AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
										<span>No-show for scheduled appointments</span>
									</li>
									<li className="flex items-start gap-2">
										<AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
										<span>Submit false or misleading information</span>
									</li>
									<li className="flex items-start gap-2">
										<AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
										<span>Create multiple accounts or tickets</span>
									</li>
									<li className="flex items-start gap-2">
										<AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
										<span>Engage in disruptive behavior</span>
									</li>
								</ul>
							</div>
						</div>

						<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<h5 className="font-semibold text-blue-900 mb-2">
								Violation Consequences
							</h5>
							<div className="text-sm text-blue-800 space-y-1">
								<p>
									<strong>1st Violation:</strong> Warning notification
								</p>
								<p>
									<strong>2nd Violation:</strong> Temporary queue restrictions
									(24 hours)
								</p>
								<p>
									<strong>3rd Violation:</strong> Extended restrictions (7 days)
								</p>
								<p>
									<strong>4th+ Violation:</strong> Account suspension review
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Appeal Process */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertCircle className="w-5 h-5 text-orange-600" />
							Appeal Process
						</CardTitle>
						<CardDescription>
							How to appeal violations if you believe they were issued in error
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
								<div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900">
										Submit Appeal
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Contact the office administrator within 48 hours of
										receiving the violation
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
								<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900">
										Review Process
									</p>
									<p className="text-xs text-gray-500 mt-1">
										Your appeal will be reviewed within 3-5 business days
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
								<div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900">
										Resolution
									</p>
									<p className="text-xs text-gray-500 mt-1">
										You will be notified of the decision via email and in-app
										notification
									</p>
								</div>
							</div>
						</div>

						<div className="flex gap-3">
							<Button variant="outline" className="flex-1">
								Contact Administrator
							</Button>
							<Button variant="outline" className="flex-1">
								View Appeal History
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</CustomerLayout>
	);
}
