"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { logUserAction } from "@/app/actions/activity-log"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Megaphone, Calendar, Eye, Edit, Trash2, Send, Save, X } from "lucide-react"

const AnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required").max(2000, "Content must be less than 2000 characters"),
  type: z.enum(["maintenance", "service", "schedule", "update"], {
    required_error: "Please select a type",
  }),
  priority: z.enum(["high", "medium", "low"], {
    required_error: "Please select a priority",
  }),
  publishDate: z.string().min(1, "Publish date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  publishNow: z.boolean().optional(),
}).refine((data) => {
  const publishDate = new Date(data.publishDate);
  const expiryDate = new Date(data.expiryDate);
  return expiryDate > publishDate;
}, {
  message: "Expiry date must be after publish date",
  path: ["expiryDate"],
});

type AnnouncementForm = z.infer<typeof AnnouncementSchema>;

interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  type: "maintenance" | "service" | "schedule" | "update";
  priority: "high" | "medium" | "low";
  status: "published" | "draft" | "scheduled";
  publishDate: string;
  expiryDate: string;
  views: number;
  createdBy: string;
  createdByUid: string;
  officeId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export default function AnnouncementsPage() {
  const { user, userData } = useAuth()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    scheduled: 0,
    totalViews: 0,
    thisMonth: 0,
  })

  const form = useForm<AnnouncementForm>({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "update",
      priority: "medium",
      publishDate: "",
      expiryDate: "",
      publishNow: false,
    },
  })

  // Load announcements and stats
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid || !userData) return
      
      setIsLoading(true)
      try {
        // Load announcements
        const announcementsResponse = await fetch(`/api/announcements?officeId=${(userData as any).officeId || 'default'}`)
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          if (announcementsData.success) {
            setAnnouncements(announcementsData.announcements || [])
          }
        }

        // Load stats
        const statsResponse = await fetch(`/api/announcements?stats=true&officeId=${(userData as any).officeId || 'default'}`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats(statsData.stats || stats)
          }
        }
      } catch (error) {
        console.error("Error loading announcements:", error)
        toast({
          title: "Error",
          description: "Failed to load announcements",
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

  const onSubmit = async (values: AnnouncementForm) => {
    if (!user?.uid || !userData) return
    
    setIsSubmitting(true)
    try {
      const status = values.publishNow ? "published" : "draft"
      
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          type: values.type,
          priority: values.priority,
          status,
          publishDate: values.publishDate,
          expiryDate: values.expiryDate,
          createdBy: userData.name || "Unknown",
          createdByUid: user.uid,
          officeId: (userData as any).officeId || "default",
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Announcement created successfully"
        })
        
        // Reset form
        form.reset()
        setShowCreateForm(false)
        
        // Reload data
        const announcementsResponse = await fetch(`/api/announcements?officeId=${(userData as any).officeId || 'default'}`)
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          if (announcementsData.success) {
            setAnnouncements(announcementsData.announcements || [])
          }
        }

        const statsResponse = await fetch(`/api/announcements?stats=true&officeId=${(userData as any).officeId || 'default'}`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats(statsData.stats || stats)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create announcement",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (announcement: AnnouncementData) => {
    setEditingId(announcement.id)
    form.reset({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      publishDate: announcement.publishDate,
      expiryDate: announcement.expiryDate,
      publishNow: announcement.status === "published",
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!user?.uid) return
    
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Announcement deleted successfully"
        })
        
        // Reload data
        const announcementsResponse = await fetch(`/api/announcements?officeId=${(userData as any)?.officeId || 'default'}`)
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          if (announcementsData.success) {
            setAnnouncements(announcementsData.announcements || [])
          }
        }

        const statsResponse = await fetch(`/api/announcements?stats=true&officeId=${(userData as any)?.officeId || 'default'}`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats(statsData.stats || stats)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete announcement",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting announcement:", error)
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive"
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "service":
        return "bg-blue-100 text-blue-800"
      case "schedule":
        return "bg-yellow-100 text-yellow-800"
      case "update":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Create and manage office announcements</p>
        </div>
        <Button 
          className="gradient-primary" 
          onClick={() => {
            setEditingId(null)
            form.reset()
            setShowCreateForm(!showCreateForm)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Announcements</p>
                <p className="text-2xl font-bold text-[#071952]">
                  {isLoading ? "..." : stats.total}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#088395]/10 rounded-lg flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[#088395]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-[#071952]">
                  {isLoading ? "..." : stats.published}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-[#071952]">
                  {isLoading ? "..." : stats.totalViews}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#37B7C3]/10 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#37B7C3]" />
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
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Announcement" : "Create New Announcement"}
            </CardTitle>
            <CardDescription>
              {editingId ? "Update the announcement details" : "Create a new announcement for your office"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter announcement title" 
                    {...form.register("title")} 
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select onValueChange={(value) => form.setValue("type", value as any)} value={form.watch("type")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Enter announcement content" 
                  className="min-h-24"
                  {...form.register("content")} 
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={(value) => form.setValue("priority", value as any)} value={form.watch("priority")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.priority && (
                    <p className="text-sm text-red-600">{form.formState.errors.priority.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input 
                    id="publishDate" 
                    type="date" 
                    {...form.register("publishDate")} 
                  />
                  {form.formState.errors.publishDate && (
                    <p className="text-sm text-red-600">{form.formState.errors.publishDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    type="date" 
                    {...form.register("expiryDate")} 
                  />
                  {form.formState.errors.expiryDate && (
                    <p className="text-sm text-red-600">{form.formState.errors.expiryDate.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="publishNow" 
                  checked={form.watch("publishNow")}
                  onCheckedChange={(checked) => form.setValue("publishNow", checked)}
                />
                <Label htmlFor="publishNow">Publish immediately</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingId(null)
                    form.reset()
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="gradient-primary"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Announcement" : "Create Announcement"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Announcements</CardTitle>
              <CardDescription>Manage your office announcements</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No announcements yet</p>
              <p className="text-sm">Create your first announcement to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <Badge className={getStatusColor(announcement.status)}>{announcement.status}</Badge>
                        <Badge className={getTypeColor(announcement.type)}>{announcement.type}</Badge>
                        <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // TODO: Implement view functionality
                          toast({
                            title: "View",
                            description: "View functionality coming soon"
                          })
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Published</p>
                      <p className="font-semibold">
                        {mounted ? new Date(announcement.publishDate).toLocaleDateString() : announcement.publishDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expires</p>
                      <p className="font-semibold">
                        {mounted ? new Date(announcement.expiryDate).toLocaleDateString() : announcement.expiryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Views</p>
                      <p className="font-semibold">{announcement.views}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created By</p>
                      <p className="font-semibold">{announcement.createdBy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
