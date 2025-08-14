"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const entries = [
	{ id: "A016", customer: "Juan Dela Cruz", office: "Registrar", service: "Transcript Request", time: "10:35 AM", evaluated: true },
	{ id: "B045", customer: "Maria Santos", office: "Cashier", service: "Tuition Payment", time: "10:40 AM", evaluated: false },
]

export default function LogbookPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Transaction Logbook</h1>
					<p className="text-gray-600">Printable queue history with evaluation status</p>
				</div>
				<Button onClick={() => window.print()}>Print Logbook</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Today's Transactions</CardTitle>
					<CardDescription>Completed and in-progress entries</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{entries.map((e) => (
							<div key={e.id} className="flex items-center justify-between p-3 border rounded">
								<div className="min-w-0">
									<div className="font-medium truncate">#{e.id} • {e.customer}</div>
									<div className="text-xs text-gray-600 truncate">{e.office} • {e.service} • {e.time}</div>
								</div>
								<Badge className={e.evaluated ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
									{e.evaluated ? "Evaluation Complete" : "Evaluation Pending"}
								</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}


