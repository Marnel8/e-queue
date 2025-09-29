"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	MessageSquare,
	Star,
	TrendingUp,
	Edit,
	Trash2,
	Eye,
	Reply,
	Plus,
	X,
	Send,
	Save,
	ThumbsUp,
	ThumbsDown,
} from "lucide-react";

const ResponseSchema = z.object({
  response: z.string().min(1, "Response is required").max(1000, "Response must be less than 1000 characters"),
});

type ResponseForm = z.infer<typeof ResponseSchema>;

interface FeedbackData {
  id: string;
  customerName: string;
  customerEmail?: string;
  service: string;
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  staffMember?: string;
  officeId: string;
  ticketId?: string;
  status: "pending" | "reviewed" | "resolved";
  response?: string;
  respondedBy?: string;
  respondedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export default function FeedbackFormsPage() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recent");
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [respondingToId, setRespondingToId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    resolved: 0,
    averageRating: 0,
    positivePercentage: 0,
    neutralPercentage: 0,
    negativePercentage: 0,
    thisMonth: 0,
    thisWeek: 0,
  });

  const responseForm = useForm<ResponseForm>({
    resolver: zodResolver(ResponseSchema),
    defaultValues: {
      response: "",
    },
  });

  // Load feedback and stats
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid || !userData) return
      
      setIsLoading(true)
      try {
        // Load feedback
        const feedbackResponse = await fetch(`/api/feedback?officeId=${(userData as any).officeId || 'default'}`)
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          if (feedbackData.success) {
            setFeedback(feedbackData.feedback || [])
          }
        }

        // Load stats
        const statsResponse = await fetch(`/api/feedback?stats=true&officeId=${(userData as any).officeId || 'default'}`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats(statsData.stats || stats)
          }
        }
      } catch (error) {
        console.error("Error loading feedback:", error)
        toast({
          title: "Error",
          description: "Failed to load feedback",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user?.uid, userData, toast])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleResponse = async (values: ResponseForm, feedbackId: string) => {
    if (!user?.uid || !userData) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: values.response,
          userId: user.uid,
          userName: userData.name || "Unknown",
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Response added successfully"
        })
        
        // Reset form and close response form
        responseForm.reset()
        setRespondingToId(null)
        
        // Reload data
        const feedbackResponse = await fetch(`/api/feedback?officeId=${(userData as any).officeId || 'default'}`)
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          if (feedbackData.success) {
            setFeedback(feedbackData.feedback || [])
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add response",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error adding response:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    if (!user?.uid) return
    
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          userId: user.uid,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Status updated successfully"
        })
        
        // Reload data
        const feedbackResponse = await fetch(`/api/feedback?officeId=${(userData as any)?.officeId || 'default'}`)
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          if (feedbackData.success) {
            setFeedback(feedbackData.feedback || [])
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.uid) return
    
    if (!confirm("Are you sure you want to delete this feedback?")) return

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Feedback deleted successfully"
        })
        
        // Reload data
        const feedbackResponse = await fetch(`/api/feedback?officeId=${(userData as any)?.officeId || 'default'}`)
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          if (feedbackData.success) {
            setFeedback(feedbackData.feedback || [])
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete feedback",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting feedback:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case "negative":
        return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Evaluation</h1>
          <p className="text-gray-600">View customer feedback and system evaluation analytics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-[#071952]">
                  {isLoading ? "..." : stats.total}
                </p>
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
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-[#071952]">
                  {isLoading ? "..." : stats.averageRating}
                </p>
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
                <p className="text-sm text-gray-600">Positive</p>
                <p className="text-2xl font-bold text-[#071952]">
                  {isLoading ? "..." : `${stats.positivePercentage}%`}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-[#071952]">
                  {isLoading ? "..." : stats.thisMonth}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Recent Feedback Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Feedback</CardTitle>
                  <CardDescription>
                    Latest customer feedback responses
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : feedback.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No feedback yet</p>
                  <p className="text-sm">Customer feedback will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((feedbackItem) => (
                    <div
                      key={feedbackItem.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-gray-900">
                              {feedbackItem.customerName}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {feedbackItem.service}
                            </Badge>
                            <Badge className={getSentimentColor(feedbackItem.sentiment)}>
                              {feedbackItem.sentiment}
                            </Badge>
                            <Badge className={getStatusColor(feedbackItem.status)}>
                              {feedbackItem.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < feedbackItem.rating
                                      ? "text-yellow-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {mounted && feedbackItem.createdAt 
                                ? new Date(feedbackItem.createdAt).toLocaleDateString()
                                : "Loading..."
                              }
                            </span>
                            {feedbackItem.staffMember && (
                              <span className="text-sm text-gray-500">
                                • Served by: {feedbackItem.staffMember}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setRespondingToId(feedbackItem.id)}
                            disabled={respondingToId === feedbackItem.id}
                          >
                            <Reply className="w-4 h-4" />
                          </Button>
                          <Select
                            value={feedbackItem.status}
                            onValueChange={(value) => handleStatusUpdate(feedbackItem.id, value)}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(feedbackItem.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        "{feedbackItem.comment}"
                      </p>

                      {feedbackItem.response && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Reply className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Response from {feedbackItem.respondedBy}
                            </span>
                            {feedbackItem.respondedAt && (
                              <span className="text-xs text-blue-600">
                                {mounted ? new Date(feedbackItem.respondedAt).toLocaleDateString() : "Loading..."}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-blue-700">{feedbackItem.response}</p>
                        </div>
                      )}

                      {/* Response Form */}
                      {respondingToId === feedbackItem.id && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <form onSubmit={responseForm.handleSubmit((values) => handleResponse(values, feedbackItem.id))} className="space-y-3">
                            <div>
                              <Label htmlFor="response">Add Response</Label>
                              <Textarea 
                                id="response" 
                                placeholder="Enter your response to this feedback..."
                                className="min-h-20"
                                {...responseForm.register("response")} 
                              />
                              {responseForm.formState.errors.response && (
                                <p className="text-sm text-red-600">{responseForm.formState.errors.response.message}</p>
                              )}
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setRespondingToId(null)
                                  responseForm.reset()
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                size="sm"
                                className="gradient-primary"
                                disabled={isSubmitting}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {isSubmitting ? "Sending..." : "Send Response"}
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Statistics</CardTitle>
              <CardDescription>
                Overall feedback metrics and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {isLoading ? "..." : stats.total}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total Feedback
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {isLoading ? "..." : stats.averageRating}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average Rating
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {isLoading ? "..." : `${stats.positivePercentage}%`}
                  </div>
                  <p className="text-xs text-muted-foreground">Positive</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {isLoading ? "..." : stats.thisMonth}
                  </div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Breakdown of feedback status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="font-medium text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <span className="text-yellow-800 font-semibold">
                      {isLoading ? "..." : stats.pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="font-medium text-blue-800">
                        Reviewed
                      </span>
                    </div>
                    <span className="text-blue-800 font-semibold">
                      {isLoading ? "..." : stats.reviewed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium text-green-800">Resolved</span>
                    </div>
                    <span className="text-green-800 font-semibold">
                      {isLoading ? "..." : stats.resolved}
                    </span>
                  </div>
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
                      <span className="font-medium text-green-800">
                        Positive
                      </span>
                    </div>
                    <span className="text-green-800 font-semibold">
                      {isLoading ? "..." : `${stats.positivePercentage}%`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="font-medium text-yellow-800">
                        Neutral
                      </span>
                    </div>
                    <span className="text-yellow-800 font-semibold">
                      {isLoading ? "..." : `${stats.neutralPercentage}%`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium text-red-800">Negative</span>
                    </div>
                    <span className="text-red-800 font-semibold">
                      {isLoading ? "..." : `${stats.negativePercentage}%`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
