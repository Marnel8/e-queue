"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, Users, Clock, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react"

export default function QueueLanesPage() {
  const [activeTab, setActiveTab] = useState("lanes")

  const queueLanes = [
    {
      id: 1,
      name: "Priority Lane",
      description: "For senior citizens, PWDs, and pregnant women",
      services: ["Enrollment", "Transcript Request", "Certificate Request"],
      currentQueue: 3,
      avgWaitTime: "5 mins",
      status: "active",
      order: 1,
    },
    {
      id: 2,
      name: "Regular Lane A",
      description: "General services for students",
      services: ["Enrollment", "ID Replacement", "Form Requests"],
      currentQueue: 12,
      avgWaitTime: "15 mins",
      status: "active",
      order: 2,
    },
    {
      id: 3,
      name: "Regular Lane B",
      description: "General services for students",
      services: ["Transcript Request", "Certificate Request", "Clearance"],
      currentQueue: 8,
      avgWaitTime: "12 mins",
      status: "active",
      order: 3,
    },
    {
      id: 4,
      name: "Express Lane",
      description: "Quick services only",
      services: ["Form Requests", "Information Inquiry"],
      currentQueue: 5,
      avgWaitTime: "3 mins",
      status: "maintenance",
      order: 4,
    },
  ]

  const queueSettings = {
    maxTicketsPerUser: 3,
    advanceBookingDays: 7,
    operatingHours: {
      start: "08:00",
      end: "17:00",
    },
    breakTimes: [
      { start: "12:00", end: "13:00", name: "Lunch Break" },
      { start: "15:00", end: "15:15", name: "Afternoon Break" },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600">Manage queue lanes and system settings</p>
        </div>
        <Button className="gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Queue Lane
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Lanes</p>
                <p className="text-2xl font-bold text-[#071952]">3</p>
              </div>
              <div className="w-10 h-10 bg-[#088395]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#088395]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold text-[#071952]">28</p>
              </div>
              <div className="w-10 h-10 bg-[#37B7C3]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#37B7C3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-[#071952]">12m</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold text-[#071952]">94%</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="lanes">Queue Lanes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="lanes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queue Lanes</CardTitle>
              <CardDescription>Manage and organize your queue lanes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queueLanes.map((lane) => (
                  <div key={lane.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{lane.name}</h3>
                          <Badge variant={lane.status === "active" ? "default" : "secondary"}>{lane.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{lane.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current Queue</p>
                        <p className="font-semibold">{lane.currentQueue} people</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Wait Time</p>
                        <p className="font-semibold">{lane.avgWaitTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Services</p>
                        <p className="font-semibold">{lane.services.length} services</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Available Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {lane.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic queue settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxTickets">Max Tickets Per User</Label>
                  <Input
                    id="maxTickets"
                    type="number"
                    defaultValue={queueSettings.maxTicketsPerUser}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advanceBooking">Advance Booking (Days)</Label>
                  <Input
                    id="advanceBooking"
                    type="number"
                    defaultValue={queueSettings.advanceBookingDays}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Opening Time</Label>
                    <Input id="startTime" type="time" defaultValue={queueSettings.operatingHours.start} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Closing Time</Label>
                    <Input id="endTime" type="time" defaultValue={queueSettings.operatingHours.end} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Break Times</CardTitle>
                <CardDescription>Configure office break schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {queueSettings.breakTimes.map((breakTime, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{breakTime.name}</h4>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <Input type="time" defaultValue={breakTime.start} className="text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <Input type="time" defaultValue={breakTime.end} className="text-sm" />
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Break Time
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button className="gradient-primary">Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
