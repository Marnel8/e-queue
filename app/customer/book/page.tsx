"use client"

import type React from "react"

import { useState } from "react"
import { CustomerLayout } from "@/components/customer/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Clock, FileText, Users, CheckCircle, Upload, AlertCircle } from "lucide-react"

const offices = [
  {
    id: "registrar",
    name: "Registrar Office",
    description: "Student records and enrollment services",
    currentQueue: 8,
    avgWaitTime: "6.2 minutes",
    status: "Open",
  },
  {
    id: "cashier",
    name: "Cashier Office",
    description: "Payment processing and financial services",
    currentQueue: 5,
    avgWaitTime: "4.8 minutes",
    status: "Open",
  },
  {
    id: "student-affairs",
    name: "Student Affairs Office",
    description: "Student support and welfare services",
    currentQueue: 12,
    avgWaitTime: "12.3 minutes",
    status: "Open",
  },
  {
    id: "library",
    name: "Library Services",
    description: "Library resources and research support",
    currentQueue: 3,
    avgWaitTime: "3.1 minutes",
    status: "Open",
  },
]

const services = {
  registrar: [
    { id: "transcript", name: "Transcript Request", time: "15-20 min", fee: "₱150.00" },
    { id: "certificate", name: "Certificate Issuance", time: "20-30 min", fee: "₱200.00" },
    { id: "enrollment", name: "Enrollment Services", time: "30-45 min", fee: "₱500.00" },
  ],
  cashier: [
    { id: "tuition", name: "Tuition Payment", time: "10-15 min", fee: "₱0.00" },
    { id: "fees", name: "Fee Collection", time: "5-10 min", fee: "₱0.00" },
    { id: "refunds", name: "Refunds", time: "15-20 min", fee: "₱0.00" },
  ],
  "student-affairs": [
    { id: "student-id", name: "Student ID", time: "10-15 min", fee: "₱100.00" },
    { id: "scholarship", name: "Scholarship Application", time: "20-30 min", fee: "₱0.00" },
    { id: "disciplinary", name: "Disciplinary Matters", time: "30-60 min", fee: "₱0.00" },
  ],
  library: [
    { id: "borrowing", name: "Book Borrowing", time: "5-10 min", fee: "₱0.00" },
    { id: "research", name: "Research Assistance", time: "15-30 min", fee: "₱0.00" },
    { id: "computer", name: "Computer Access", time: "10-15 min", fee: "₱0.00" },
  ],
}

const timeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
]

export default function BookTicket() {
  const [step, setStep] = useState(1)
  const [selectedOffice, setSelectedOffice] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [isPriority, setIsPriority] = useState(false)
  const [priorityFile, setPriorityFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const selectedOfficeData = offices.find((office) => office.id === selectedOffice)
  const availableServices = selectedOffice ? services[selectedOffice as keyof typeof services] || [] : []
  const selectedServiceData = availableServices.find((service) => service.id === selectedService)

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // TODO: Implement booking logic
    console.log("Booking ticket:", {
      office: selectedOffice,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      priority: isPriority,
      notes,
    })
    setIsSubmitted(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPriorityFile(file)
    }
  }

  if (isSubmitted) {
    return (
      <CustomerLayout title="Booking Confirmation" description="Your ticket has been successfully booked">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              <CardDescription>Your queue ticket has been successfully booked</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ticket Details */}
              <div className="border rounded-lg p-6 bg-primary/5">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-primary">A016</div>
                  <div>
                    <p className="font-semibold">{selectedOfficeData?.name}</p>
                    <p className="text-muted-foreground">{selectedServiceData?.name}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Date: {selectedDate?.toLocaleDateString()}</p>
                    <p>Time: {selectedTime}</p>
                    <p>Fee: {selectedServiceData?.fee}</p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You will receive notifications when it's almost your turn. Please arrive 10 minutes before your
                  scheduled time.
                </p>
                <div className="flex gap-4">
                  <Button className="flex-1 gradient-primary text-white">Download Ticket</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View My Queue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout title="Book Ticket" description="Schedule your office visit">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center px-4">
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground border"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-3 px-4">
            <div className="text-xs sm:text-sm text-muted-foreground text-center">
              Step {step} of 4:{" "}
              {step === 1
                ? "Select Office"
                : step === 2
                  ? "Choose Service"
                  : step === 3
                    ? "Pick Date & Time"
                    : "Review & Confirm"}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Select Office"}
              {step === 2 && "Choose Service"}
              {step === 3 && "Pick Date & Time"}
              {step === 4 && "Review & Confirm"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Choose the office you need to visit"}
              {step === 2 && "Select the service you require"}
              {step === 3 && "Choose your preferred date and time"}
              {step === 4 && "Review your booking details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Select Office */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offices.map((office) => (
                  <Card
                    key={office.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOffice === office.id ? "ring-2 ring-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedOffice(office.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-6 h-6 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base">{office.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{office.description}</p>
                          </div>
                        </div>
                        <Badge
                          variant={office.status === "Open" ? "default" : "secondary"}
                          className="flex-shrink-0 text-xs"
                        >
                          {office.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{office.currentQueue} in queue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{office.avgWaitTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 2: Choose Service */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">{selectedOfficeData?.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedOfficeData?.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {availableServices.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedService === service.id ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-secondary" />
                            <div>
                              <h3 className="font-medium">{service.name}</h3>
                              <p className="text-sm text-muted-foreground">Processing time: {service.time}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{service.fee}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Pick Date & Time */}
            {step === 3 && (
              <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Select Date</Label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                      className="rounded-md border w-full max-w-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Select Time</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`h-10 text-sm ${selectedTime === time ? "gradient-primary text-white" : "bg-transparent"}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>

                  {/* Priority Option */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="priority"
                        checked={isPriority}
                        onCheckedChange={(checked) => setIsPriority(checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="priority" className="text-sm font-medium leading-5">
                        I have priority status (PWD, Senior Citizen, Pregnant)
                      </Label>
                    </div>

                    {isPriority && (
                      <div className="space-y-3">
                        <Label htmlFor="priority-file" className="text-sm">
                          Upload Priority ID/Document
                        </Label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Input
                            id="priority-file"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                            className="flex-1"
                          />
                          <Upload className="w-4 h-4 text-muted-foreground" />
                        </div>
                        {priorityFile && <p className="text-sm text-green-600">✓ {priorityFile.name} uploaded</p>}
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Booking Details</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-muted-foreground">Office:</span>
                        <span className="font-medium">{selectedOfficeData?.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">{selectedServiceData?.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-muted-foreground">Processing Time:</span>
                        <span className="font-medium">{selectedServiceData?.time}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-muted-foreground">Fee:</span>
                        <span className="font-medium">{selectedServiceData?.fee}</span>
                      </div>
                      {isPriority && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-muted-foreground">Priority:</span>
                          <Badge className="bg-red-100 text-red-800 w-fit">Priority Queue</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Important Reminders</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Please arrive 10 minutes before your scheduled time</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Bring all required documents and valid ID</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>You can cancel your ticket up to 1 hour before your appointment</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>You will receive notifications when it's almost your turn</span>
                      </div>
                    </div>

                    {notes && (
                      <div>
                        <h4 className="font-medium mb-2">Your Notes</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={step === 1}
                className="bg-transparent order-2 sm:order-1"
              >
                Back
              </Button>

              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !selectedOffice) ||
                    (step === 2 && !selectedService) ||
                    (step === 3 && (!selectedDate || !selectedTime))
                  }
                  className="gradient-primary text-white order-1 sm:order-2"
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gradient-primary text-white order-1 sm:order-2">
                  Confirm Booking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}
