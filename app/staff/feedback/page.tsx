import { StaffLayout } from "@/components/staff/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Search, Filter, Calendar } from "lucide-react"

const feedbackData = [
  {
    id: 1,
    customerName: "Juan Dela Cruz",
    service: "Transcript Request",
    rating: 5,
    comment: "Very efficient service! Ana was very helpful and the process was quick. Thank you!",
    date: "2024-01-15 10:30 AM",
    sentiment: "positive",
    staffMember: "Ana Rodriguez",
  },
  {
    id: 2,
    customerName: "Maria Santos",
    service: "Certificate Issuance",
    rating: 4,
    comment: "Good service overall, but the waiting time could be improved. Staff was friendly though.",
    date: "2024-01-15 09:45 AM",
    sentiment: "positive",
    staffMember: "Ana Rodriguez",
  },
  {
    id: 3,
    customerName: "Pedro Garcia",
    service: "Enrollment",
    rating: 2,
    comment: "Long waiting time and the process was confusing. Need better guidance for new students.",
    date: "2024-01-15 08:20 AM",
    sentiment: "negative",
    staffMember: "Carlos Mendoza",
  },
  {
    id: 4,
    customerName: "Ana Rodriguez",
    service: "Grade Verification",
    rating: 5,
    comment: "Perfect service! Very quick and professional. The staff explained everything clearly.",
    date: "2024-01-14 03:15 PM",
    sentiment: "positive",
    staffMember: "Ana Rodriguez",
  },
  {
    id: 5,
    customerName: "Carlos Mendoza",
    service: "Transcript Request",
    rating: 3,
    comment: "Average service. The process was okay but could be faster. Staff was polite.",
    date: "2024-01-14 02:30 PM",
    sentiment: "neutral",
    staffMember: "Elena Santos",
  },
]

const getSentimentBadge = (sentiment: string) => {
  const variants = {
    positive: "bg-green-100 text-green-800",
    neutral: "bg-gray-100 text-gray-800",
    negative: "bg-red-100 text-red-800",
  }
  return variants[sentiment as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <ThumbsUp className="w-4 h-4 text-green-600" />
    case "negative":
      return <ThumbsDown className="w-4 h-4 text-red-600" />
    default:
      return <MessageSquare className="w-4 h-4 text-gray-600" />
  }
}

export default function CustomerFeedback() {
  return (
    <StaffLayout title="Customer Feedback" description="View and analyze customer feedback for your services">
      <div className="space-y-6">
        {/* Feedback Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.3</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">89%</div>
              <p className="text-xs text-muted-foreground">Positive sentiment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground">Your average</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Feedback</CardTitle>
            <CardDescription>Filter feedback by service, rating, or date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search feedback..." className="pl-10" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                <Select>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="transcript">Transcript Request</SelectItem>
                    <SelectItem value="certificate">Certificate Issuance</SelectItem>
                    <SelectItem value="enrollment">Enrollment</SelectItem>
                    <SelectItem value="verification">Grade Verification</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="bg-transparent w-full sm:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Date Range</span>
                  <span className="sm:hidden">Date</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>Latest customer feedback and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackData.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {getSentimentIcon(feedback.sentiment)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{feedback.customerName}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <Badge variant="outline" className="text-xs w-fit">
                            {feedback.service}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">Served by: {feedback.staffMember}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className={getSentimentBadge(feedback.sentiment)}>{feedback.sentiment}</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground pl-0 sm:pl-13">{feedback.comment}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pl-0 sm:pl-13">
                    <span className="text-xs text-muted-foreground">{feedback.date}</span>
                    <Button variant="ghost" size="sm" className="text-xs w-fit sm:w-auto">
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" className="bg-transparent">
                Load More Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  )
}
