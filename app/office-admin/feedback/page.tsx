"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, MessageSquare, Star, TrendingUp, Edit, Trash2, Eye } from "lucide-react"

export default function FeedbackFormsPage() {
  const [activeTab, setActiveTab] = useState("forms")

  const feedbackForms = [
    {
      id: 1,
      title: "Service Quality Assessment",
      description: "Evaluate overall service quality and staff performance",
      questions: 8,
      responses: 245,
      avgRating: 4.2,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Wait Time Feedback",
      description: "Assess customer satisfaction with waiting times",
      questions: 5,
      responses: 189,
      avgRating: 3.8,
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      title: "Facility Cleanliness",
      description: "Rate the cleanliness and comfort of office facilities",
      questions: 6,
      responses: 156,
      avgRating: 4.5,
      status: "draft",
      createdAt: "2024-01-08",
    },
  ]

  const recentFeedback = [
    {
      id: 1,
      customerName: "John Doe",
      service: "Transcript Request",
      rating: 5,
      comment: "Excellent service! Very quick and professional staff.",
      date: "2024-01-20",
      sentiment: "positive",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      service: "Enrollment",
      rating: 3,
      comment: "Service was okay but the waiting time was too long.",
      date: "2024-01-20",
      sentiment: "neutral",
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      service: "Certificate Request",
      rating: 2,
      comment: "Staff was not very helpful and seemed rushed.",
      date: "2024-01-19",
      sentiment: "negative",
    },
    {
      id: 4,
      customerName: "Sarah Wilson",
      service: "ID Replacement",
      rating: 4,
      comment: "Good service overall, just need better signage.",
      date: "2024-01-19",
      sentiment: "positive",
    },
  ]

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-gray-600">Create and manage customer feedback forms</p>
        </div>
        <Button className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-[#071952]">{feedbackForms.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#088395]/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#088395]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-[#071952]">590</p>
              </div>
              <div className="w-10 h-10 bg-[#37B7C3]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#37B7C3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-[#071952]">4.2</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-[#071952]">47</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Forms</CardTitle>
              <CardDescription>Manage your customer feedback forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackForms.map((form) => (
                  <div key={form.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{form.title}</h3>
                          <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{form.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Questions</p>
                        <p className="font-semibold">{form.questions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Responses</p>
                        <p className="font-semibold">{form.responses}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{form.avgRating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-semibold">{new Date(form.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>Latest customer feedback responses</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Forms</SelectItem>
                      <SelectItem value="service">Service Quality</SelectItem>
                      <SelectItem value="wait">Wait Time</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{feedback.customerName}</h4>
                          <Badge variant="outline" className="text-xs">
                            {feedback.service}
                          </Badge>
                          <Badge className={getSentimentColor(feedback.sentiment)}>{feedback.sentiment}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            {new Date(feedback.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">"{feedback.comment}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Breakdown of customer ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#088395] h-2 rounded-full" style={{ width: `${rating * 20}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{rating * 20}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>Customer sentiment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium text-green-800">Positive</span>
                    </div>
                    <span className="text-green-800 font-semibold">65%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="font-medium text-yellow-800">Neutral</span>
                    </div>
                    <span className="text-yellow-800 font-semibold">25%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium text-red-800">Negative</span>
                    </div>
                    <span className="text-red-800 font-semibold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
