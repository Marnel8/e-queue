"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const entries = [
	{
		id: "A016",
		customer: "Juan Dela Cruz",
		department: "Registrar",
		service: "Transcript Request",
		time: "10:35 AM",
		date: "2024-01-15",
		evaluated: true,
	},
	{
		id: "B045",
		customer: "Maria Santos",
		department: "Cashier",
		service: "Tuition Payment",
		time: "10:40 AM",
		date: "2024-01-15",
		evaluated: false,
	},
	{
		id: "C023",
		customer: "Pedro Garcia",
		department: "Student Affairs",
		service: "ID Replacement",
		time: "11:15 AM",
		date: "2024-01-14",
		evaluated: true,
	},
	{
		id: "D078",
		customer: "Ana Rodriguez",
		department: "Registrar",
		service: "Enrollment",
		time: "09:30 AM",
		date: "2024-01-14",
		evaluated: true,
	},
];

export default function LogbookPage() {
	const [selectedDate, setSelectedDate] = useState("");

	const filteredEntries = selectedDate
		? entries.filter((entry) => entry.date === selectedDate)
		: entries;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Transaction Logbook
					</h1>
					<p className="text-gray-600">
						Printable queue history with evaluation status
					</p>
				</div>
				<Button onClick={() => window.print()}>Print Logbook</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Today's Transactions</CardTitle>
					<CardDescription>Completed and in-progress entries</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<Label htmlFor="date-filter">Filter by Date:</Label>
								<Input
									id="date-filter"
									type="date"
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									className="w-auto"
								/>
							</div>
							{selectedDate && (
								<Button
									variant="outline"
									onClick={() => setSelectedDate("")}
									size="sm"
								>
									Clear Filter
								</Button>
							)}
						</div>

						<div className="space-y-3">
							{filteredEntries.map((e) => (
								<div
									key={e.id}
									className="flex items-center justify-between p-3 border rounded"
								>
									<div className="min-w-0">
										<div className="font-medium truncate">
											#{e.id} • {e.customer}
										</div>
										<div className="text-xs text-gray-600 truncate">
											{e.department} • {e.service} • {e.date} • {e.time}
										</div>
									</div>
									<Badge
										className={
											e.evaluated
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}
									>
										{e.evaluated ? "Evaluation Complete" : "Evaluation Pending"}
									</Badge>
								</div>
							))}
						</div>

						{filteredEntries.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								No transactions found for the selected date.
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
