"use client";

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
import { Star, Send, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Feedback() {
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Feedback Form */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageSquare className="w-5 h-5" />
						System Evaluation
					</CardTitle>
					<CardDescription>
						Your feedback helps us improve the e-queue system and user
						experience.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label>Overall System Rating</Label>
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
						<Label htmlFor="experience">System Experience</Label>
						<Textarea
							id="experience"
							placeholder="Tell us about your experience using the e-queue system..."
							className="min-h-[120px]"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="suggestions">Suggestions for Improvement</Label>
						<Textarea
							id="suggestions"
							placeholder="How can we improve the e-queue system?"
							className="min-h-[80px]"
						/>
					</div>

					<Button className="w-full gradient-primary text-white">
						<Send className="w-4 h-4 mr-2" />
						Submit Evaluation
					</Button>
				</CardContent>
			</Card>

			{/* Recent Feedback */}
			<Card>
				<CardHeader>
					<CardTitle>Your Recent Evaluations</CardTitle>
					<CardDescription>
						System evaluations you've submitted in the past
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="border rounded-lg p-4">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<span className="font-medium">System Evaluation</span>
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
								The system is very user-friendly and easy to navigate. Booking
								tickets was straightforward.
							</p>
						</div>

						<div className="border rounded-lg p-4">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<span className="font-medium">System Evaluation</span>
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
								Excellent system! The real-time updates and notifications work
								perfectly.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
