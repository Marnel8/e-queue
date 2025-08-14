"use client"

import { CustomerLayout } from "@/components/customer/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Send, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  return (
    <CustomerLayout title="Feedback" description="Share your experience and help us improve">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Submit Feedback
            </CardTitle>
            <CardDescription>Your feedback helps us improve our services and reduce waiting times.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="office">Office</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select office you visited" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registrar">Registrar Office</SelectItem>
                  <SelectItem value="cashier">Cashier Office</SelectItem>
                  <SelectItem value="student-affairs">Student Affairs Office</SelectItem>
                  <SelectItem value="library">Library Services</SelectItem>
                  <SelectItem value="guidance">Guidance Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select service received" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transcript">Transcript Request</SelectItem>
                  <SelectItem value="certificate">Certificate Issuance</SelectItem>
                  <SelectItem value="payment">Tuition Payment</SelectItem>
                  <SelectItem value="id">Student ID</SelectItem>
                  <SelectItem value="enrollment">Enrollment</SelectItem>
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
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{rating > 0 && `${rating} out of 5 stars`}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" placeholder="Tell us about your experience..." className="min-h-[120px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestions">Suggestions for Improvement</Label>
              <Textarea id="suggestions" placeholder="How can we improve our services?" className="min-h-[80px]" />
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
            <CardDescription>Feedback you've submitted in the past</CardDescription>
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
                          className={`w-4 h-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Jan 14, 2024</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Great service! The staff was very helpful and the process was quick.
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
                          className={`w-4 h-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Jan 12, 2024</span>
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
  )
}
