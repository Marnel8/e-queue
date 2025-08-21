import { CustomerLayout } from "@/components/customer/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EvaluationLoading() {
	return (
		<CustomerLayout
			title="Service Evaluation"
			description="Rate your service experience and provide feedback"
		>
			<div className="space-y-6">
				{/* Evaluation Form Skeleton */}
				<Card className="border-2 border-[#37B7C3] bg-gradient-to-br from-[#EBF4F6] to-white">
					<CardHeader>
						<Skeleton className="h-8 w-64" />
						<Skeleton className="h-4 w-96" />
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Service Information Skeleton */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</div>

						{/* Rating Categories Skeleton */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="space-y-3">
									<Skeleton className="h-4 w-32" />
									<div className="flex items-center justify-between">
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<Skeleton key={star} className="h-8 w-8 rounded" />
											))}
										</div>
										<Skeleton className="h-4 w-12" />
									</div>
									<Skeleton className="h-3 w-48" />
								</div>
							))}
						</div>

						{/* Comments Skeleton */}
						<div className="space-y-3">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-3 w-64" />
						</div>

						{/* Submit Button Skeleton */}
						<div className="flex justify-end">
							<Skeleton className="h-10 w-40" />
						</div>
					</CardContent>
				</Card>

				{/* Recent Evaluations Skeleton */}
				<Card className="border-2 border-gray-200">
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[1, 2].map((i) => (
								<div
									key={i}
									className="p-4 border-2 border-[#37B7C3] rounded-lg bg-gradient-to-r from-[#EBF4F6] to-white"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="space-y-2">
											<Skeleton className="h-5 w-32" />
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-20" />
										</div>
										<div className="flex items-center gap-2">
											<div className="flex gap-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<Skeleton key={star} className="h-6 w-6 rounded" />
												))}
											</div>
											<Skeleton className="h-6 w-20" />
										</div>
									</div>
									<Skeleton className="h-16 w-full" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Guidelines Skeleton */}
				<Card className="border-2 border-blue-200 bg-blue-50">
					<CardHeader>
						<Skeleton className="h-6 w-48" />
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="flex items-start gap-2">
									<Skeleton className="h-3 w-3 rounded-full mt-1" />
									<Skeleton className="h-3 w-64" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</CustomerLayout>
	);
}

