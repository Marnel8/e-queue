"use client"

import { useState } from "react"
import { CustomerLayout } from "@/components/customer/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, MapPin, Calendar, Users, AlertCircle, CheckCircle, Download, X, Ticket, Building2 } from "lucide-react"

const currentTicket = {
  ticketNumber: "A015",
  office: "Registrar Office",
  service: "Transcript Request",
  bookedTime: "10:30 AM",
  estimatedWait: "15 minutes",
  position: 3,
  totalInQueue: 8,
  status: "Waiting",
  fee: "₱150.00",
  requirements: ["Valid ID", "Request Form", "Payment Receipt"],
}

const upcomingTickets = [
  {
    id: 1,
    ticketNumber: "B023",
    office: "Cashier Office",
    service: "Tuition Payment",
    date: "2024-01-16",
    time: "2:00 PM",
    status: "Scheduled",
  },
]

export default function CustomerDashboard() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const handleCancelTicket = () => {
    // TODO: Implement cancel ticket logic
    console.log("Cancelling ticket:", currentTicket.ticketNumber)
    setShowCancelDialog(false)
  }

  const handleDownloadTicket = () => {
    // TODO: Implement download ticket logic
    console.log("Downloading ticket:", currentTicket.ticketNumber)
  }

  return (
    <CustomerLayout title="My Queue" description="Monitor your queue status and manage tickets">
      <div className="space-y-6">
        {/* Current Ticket Status */}
        {currentTicket && (
          <Card className="border-2 border-[#071952] bg-gradient-to-br from-[#EBF4F6] to-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[#071952]">
                  <Ticket className="w-5 h-5 text-[#071952]" />
                  Current Ticket
                </CardTitle>
                <Badge className="bg-[#088395] text-white font-medium px-3 py-1">{currentTicket.status}</Badge>
              </div>
              <CardDescription className="text-gray-700">You are currently in queue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#071952] mb-2 bg-white px-4 py-2 rounded-lg border-2 border-[#37B7C3]">
                      {currentTicket.ticketNumber}
                    </div>
                    <p className="text-gray-700 font-medium">Your Ticket Number</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
                      <Building2 className="w-4 h-4 text-[#088395]" />
                      <span className="text-gray-800 font-medium">{currentTicket.office}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
                      <MapPin className="w-4 h-4 text-[#088395]" />
                      <span className="text-gray-800 font-medium">{currentTicket.service}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
                      <Calendar className="w-4 h-4 text-[#088395]" />
                      <span className="text-gray-800 font-medium">Booked for {currentTicket.bookedTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white p-2 rounded border">
                      <Clock className="w-4 h-4 text-[#088395]" />
                      <span className="text-gray-800 font-medium">Estimated wait: {currentTicket.estimatedWait}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Queue Position */}
                  <div className="text-center p-6 bg-gradient-to-br from-[#37B7C3] to-[#088395] text-white rounded-lg border-2 border-[#071952] shadow-md">
                    <div className="text-3xl font-bold mb-1">{currentTicket.position}</div>
                    <p className="text-sm opacity-90 font-medium">Position in queue</p>
                    <div className="mt-4">
                      <Progress
                        value={(currentTicket.position / currentTicket.totalInQueue) * 100}
                        className="h-3 bg-white/20"
                      />
                      <p className="text-xs mt-2 opacity-90">
                        {currentTicket.position} of {currentTicket.totalInQueue} customers
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <h4 className="font-semibold mb-3 text-[#071952]">Required Documents</h4>
                    <div className="space-y-2">
                      {currentTicket.requirements.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded border border-green-200"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-800 font-medium">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleDownloadTicket} className="flex-1 gradient-primary text-white font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Download Ticket
                </Button>
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Ticket
                </Button>
              </div>

              {/* Live Updates */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-[#071952]">Live Updates</span>
                </div>
                <div className="space-y-2 text-sm text-gray-800">
                  <p className="font-medium">• Currently serving: A012</p>
                  <p className="font-medium">• Average service time: 6 minutes</p>
                  <p className="font-medium">• Your estimated call time: 10:45 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Active Ticket */}
        {!currentTicket && (
          <Card className="border-2 border-gray-200">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-[#088395] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#071952]">No Active Ticket</h3>
              <p className="text-gray-700 mb-6">You don't have any active queue tickets at the moment.</p>
              <Button className="gradient-primary text-white font-medium px-6 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Ticket
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Tickets */}
        {upcomingTickets.length > 0 && (
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-[#071952]">Upcoming Tickets</CardTitle>
              <CardDescription className="text-gray-700">Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border-2 border-[#37B7C3] rounded-lg bg-gradient-to-r from-[#EBF4F6] to-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#088395] rounded-full flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#071952]">{ticket.ticketNumber}</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {ticket.office} - {ticket.service}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#071952]">
                        {ticket.date} at {ticket.time}
                      </p>
                      <Badge className="bg-[#37B7C3] text-white font-medium">{ticket.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#37B7C3] hover:border-[#088395] bg-gradient-to-br from-white to-[#EBF4F6]">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-[#088395] mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-[#071952]">Book New Ticket</h3>
              <p className="text-sm text-gray-700">Schedule your next office visit</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#37B7C3] hover:border-[#088395] bg-gradient-to-br from-white to-[#EBF4F6]">
            <CardContent className="p-6 text-center">
              <Building2 className="w-12 h-12 text-[#088395] mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-[#071952]">Browse Offices</h3>
              <p className="text-sm text-gray-700">View available offices and services</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-[#37B7C3] hover:border-[#088395] bg-gradient-to-br from-white to-[#EBF4F6]">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-[#088395] mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-[#071952]">Queue Status</h3>
              <p className="text-sm text-gray-700">Check current queue lengths</p>
            </CardContent>
          </Card>
        </div>

        {/* Cancel Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 border-2 border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Cancel Ticket
                </CardTitle>
                <CardDescription className="text-red-600">Are you sure you want to cancel your ticket?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    <strong>Warning:</strong> Cancelling your ticket will remove you from the queue. You'll need to book
                    a new ticket to rejoin.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setShowCancelDialog(false)} variant="outline" className="flex-1">
                    Keep Ticket
                  </Button>
                  <Button
                    onClick={handleCancelTicket}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    Cancel Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
