import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArchivesLoading() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<Skeleton className="w-10 h-10 rounded-lg" />
					<div>
						<Skeleton className="w-32 h-8 mb-2" />
						<Skeleton className="w-64 h-4" />
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<Skeleton className="w-10 h-10 rounded-lg" />
									<div className="flex-1">
										<Skeleton className="w-20 h-4 mb-2" />
										<Skeleton className="w-12 h-8" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<Skeleton className="w-32 h-6" />
				</CardHeader>
				<CardContent className="space-y-4">
					<Skeleton className="w-full h-10" />
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i}>
								<Skeleton className="w-20 h-4 mb-2" />
								<Skeleton className="w-full h-10" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Table */}
			<Card>
				<CardHeader>
					<Skeleton className="w-40 h-6 mb-2" />
					<Skeleton className="w-48 h-4" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Table Header */}
						<div className="grid grid-cols-9 gap-4 p-4 border-b">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
								<Skeleton key={i} className="w-full h-4" />
							))}
						</div>

						{/* Table Rows */}
						{[1, 2, 3, 4, 5].map((row) => (
							<div key={row} className="grid grid-cols-9 gap-4 p-4 border-b">
								{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
									<Skeleton key={col} className="w-full h-4" />
								))}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
