"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Bell, Plus, Trash2 } from "lucide-react"

export default function TestNotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<"info" | "success" | "warning" | "error" | "system">("info")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCreateNotification = async () => {
    if (!title || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
          priority
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Notification created successfully!"
        })
        setTitle("")
        setMessage("")
        setType("info")
        setPriority("medium")
      } else {
        throw new Error(data.error || "Failed to create notification")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create notification",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/notifications/seed", {
        method: "POST"
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Created ${data.results.length} sample notifications!`
        })
      } else {
        throw new Error(data.error || "Failed to seed notifications")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to seed notifications",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearNotifications = async () => {
    setIsLoading(true)
    try {
      // This would need to be implemented in the API
      toast({
        title: "Info",
        description: "Clear notifications feature not implemented yet"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear notifications",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Test Notifications</h1>
        <p className="mt-2 text-gray-600">Create and manage test notifications for the admin panel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Notification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Notification
            </CardTitle>
            <CardDescription>
              Create a new notification to test the notification system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleCreateNotification}
              disabled={isLoading || !title || !message}
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create Notification"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Quick actions for testing the notification system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSeedNotifications}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? "Seeding..." : "Seed Sample Notifications"}
            </Button>

            <Button 
              onClick={handleClearNotifications}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? "Clearing..." : "Clear All Notifications"}
            </Button>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How to Test</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click "Seed Sample Notifications" to create test data</li>
                <li>• Check the bell icon in the header for notifications</li>
                <li>• Click on notifications to mark them as read</li>
                <li>• Use the delete button to remove notifications</li>
                <li>• Try creating custom notifications with the form</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
