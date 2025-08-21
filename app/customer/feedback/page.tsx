"use client";

import { CustomerLayout } from "@/components/customer/layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Star, Send, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";

export default function Feedback() {
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);

	// Office → Service mapping (kept in sync with ticket issuance services)
	const officeToServices = useMemo(
		() => ({
			registrar: [
				{ id: "transcript", name: "Transcript Request" },
				{ id: "certificate", name: "Certificate Issuance" },
				{ id: "enrollment", name: "Enrollment Services" },
			],
			cashier: [
				{ id: "tuition", name: "Tuition Payment" },
				{ id: "fees", name: "Fee Collection" },
				{ id: "refunds", name: "Refunds" },
			],
			"student-affairs": [
				{ id: "student-id", name: "Student ID" },
				{ id: "scholarship", name: "Scholarship Application" },
				{ id: "disciplinary", name: "Disciplinary Matters" },
			],
			library: [
				{ id: "borrowing", name: "Book Borrowing" },
				{ id: "research", name: "Research Assistance" },
				{ id: "computer", name: "Computer Access" },
			],
			guidance: [
				{ id: "counseling", name: "Counseling" },
				{ id: "clearance", name: "Guidance Clearance" },
			],
			admin: [
				{ id: "requests", name: "Document Requests" },
				{ id: "certificates", name: "Certificate Processing" },
				{ id: "inquiries", name: "General Inquiries" },
			],
			clinic: [
				{ id: "consultation", name: "Consultation" },
				{ id: "first-aid", name: "First Aid" },
				{ id: "medical-cert", name: "Medical Certificate" },
			],
			marketing: [
				{ id: "admissions", name: "Admissions Inquiry" },
				{ id: "campus-tour", name: "Campus Tour Scheduling" },
				{ id: "info-request", name: "Information Request" },
			],
		}),
		[]
	);

	const [selectedOffice, setSelectedOffice] = useState<string>("");
	const [selectedService, setSelectedService] = useState<string>("");

	const availableServices = selectedOffice
		? officeToServices[selectedOffice as keyof typeof officeToServices] || []
		: [];

	return (
		<CustomerLayout
			title="Feedback"
			description="Share your experience and help us improve"
		>
			<div className="max-w-2xl mx-auto space-y-6">
				{/* Feedback Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="w-5 h-5" />
							Submit Feedback
						</CardTitle>
						<CardDescription>
							Your feedback helps us improve our services and reduce waiting
							times.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="office">Office</Label>
							<Select
								value={selectedOffice}
								onValueChange={(value) => {
									setSelectedOffice(value);
									// Auto-select the first service for the chosen office
									const first =
										officeToServices[
											value as keyof typeof officeToServices
										]?.[0]?.id || "";
									setSelectedService(first);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select office you visited" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="student-affairs">SAS Office</SelectItem>
									<SelectItem value="registrar">Registrar</SelectItem>
									<SelectItem value="guidance">Guidance</SelectItem>
									<SelectItem value="cashier">Cashier</SelectItem>
									<SelectItem value="admin">Admin Office</SelectItem>
									<SelectItem value="clinic">Clinic</SelectItem>
									<SelectItem value="library">Library</SelectItem>
									<SelectItem value="marketing">Marketing Center</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="service">Service</Label>
							<Select
								value={selectedService}
								onValueChange={setSelectedService}
								disabled={!selectedOffice}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											selectedOffice
												? "Select service received"
												: "Select an office first"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{availableServices.map((svc) => (
										<SelectItem key={svc.id} value={svc.id}>
											{svc.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Overall Rating</Label>
							<div className="flex items-center gap-1">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										className="p-1"
										onMouseEnter={() => setHoveredRating(star)}
										onMouseLeave={() => setHoveredRating(0)}
										onClick={() => setRating(star)}
									>
										<Star
											className={`w-8 h-8 ${
												star <= (hoveredRating || rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									</button>
								))}
								<span className="ml-2 text-sm text-muted-foreground">
									{rating > 0 && `${rating} out of 5 stars`}
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="comments">Comments</Label>
							<Textarea
								id="comments"
								placeholder="Tell us about your experience..."
								className="min-h-[120px]"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="suggestions">Suggestions for Improvement</Label>
							<Textarea
								id="suggestions"
								placeholder="How can we improve our services?"
								className="min-h-[80px]"
							/>
						</div>

						<Button className="w-full gradient-primary text-white">
							<Send className="w-4 h-4 mr-2" />
							Submit Feedback
						</Button>
					</CardContent>
				</Card>

				{/* Recent Feedback */}
				<Card>
					<CardHeader>
						<CardTitle>Your Recent Feedback</CardTitle>
						<CardDescription>
							Feedback you've submitted in the past
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="border rounded-lg p-4">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<span className="font-medium">Registrar Office</span>
										<div className="flex">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`w-4 h-4 ${
														star <= 4
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
									</div>
									<span className="text-sm text-muted-foreground">
										Jan 14, 2024
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Great service! The staff was very helpful and the process was
									quick.
								</p>
							</div>

							<div className="border rounded-lg p-4">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<span className="font-medium">Cashier Office</span>
										<div className="flex">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`w-4 h-4 ${
														star <= 5
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
									</div>
									<span className="text-sm text-muted-foreground">
										Jan 12, 2024
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Excellent service! No waiting time and very efficient staff.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</CustomerLayout>
	);
}
