"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Megaphone, Calendar, Eye, Edit, Trash2, Send } from "lucide-react"

export default function AnnouncementsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const announcements = [
    {
      id: 1,
      title: "System Maintenance Notice",
      content:
        "The E-Queue system will undergo scheduled maintenance on January 25, 2024, from 2:00 AM to 4:00 AM. Services will be temporarily unavailable during this period.",
      type: "maintenance",
      priority: "high",
      status: "published",
      publishDate: "2024-01-20",
      expiryDate: "2024-01-25",
      views: 245,
      createdBy: "Maria Santos",
    },
    {
      id: 2,
      title: "New Service Available: Online Certificate Requests",
      content:
        "We are pleased to announce that certificate requests can now be submitted online through the E-Queue system. Visit the services section to get started.",
      type: "service",
      priority: "medium",
      status: "published",
      publishDate: "2024-01-18",
      expiryDate: "2024-02-18",
      views: 189,
      createdBy: "Maria Santos",
    },
    {
      id: 3,
      title: "Holiday Schedule Update",
      content:
        "Please note the updated office hours during the upcoming holiday season. The registrar office will be closed on January 30-31, 2024.",
      type: "schedule",
      priority: "medium",
      status: "draft",
      publishDate: "2024-01-22",
      expiryDate: "2024-02-01",
      views: 0,
      createdBy: "Maria Santos",
    },
    {
      id: 4,
      title: "Queue System Updates",
      content:
        "We have implemented several improvements to reduce waiting times and enhance your experience. Thank you for your patience.",
      type: "update",
      priority: "low",
      status: "published",
      publishDate: "2024-01-15",
      expiryDate: "2024-01-30",
      views: 156,
      createdBy: "Maria Santos",
    },
  ]

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
        <Button className="gradient-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
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
                <p className="text-2xl font-bold text-[#071952]">{announcements.length}</p>
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
                  {announcements.filter((a) => a.status === "published").length}
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
                  {announcements.reduce((sum, a) => sum + a.views, 0)}
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
                <p className="text-2xl font-bold text-[#071952]">3</p>
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
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Create a new announcement for your office</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter announcement title" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" placeholder="Enter announcement content" className="min-h-24" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input id="publishDate" type="date" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" type="date" className="w-full" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="publishNow" />
              <Label htmlFor="publishNow">Publish immediately</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary">Create Announcement</Button>
            </div>
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
                    <p className="text-gray-600">Published</p>
                    <p className="font-semibold">{new Date(announcement.publishDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expires</p>
                    <p className="font-semibold">{new Date(announcement.expiryDate).toLocaleDateString()}</p>
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
        </CardContent>
      </Card>
    </div>
  )
}
