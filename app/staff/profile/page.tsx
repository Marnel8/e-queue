"use client"

import { useState } from "react"
import { StaffLayout } from "@/components/staff/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Clock, 
  Edit, 
  Save, 
  X, 
  Camera,
  Shield,
  Award,
  Star,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react"

const staffProfile = {
  id: "STAFF001",
  firstName: "Ana",
  lastName: "Rodriguez",
  email: "ana.rodriguez@omsc.edu.ph",
  phone: "+63 912 345 6789",
  position: "Senior Staff",
  department: "Registrar Office",
  employeeId: "2024-001",
  hireDate: "2020-03-15",
  address: "123 Mamburao Street, Occidental Mindoro",
  bio: "Dedicated staff member with 4+ years of experience in student services. Specializes in transcript processing and enrollment assistance.",
  skills: ["Student Records Management", "Customer Service", "Document Processing", "Queue Management"],
  languages: ["English", "Filipino", "Spanish"],
  performance: {
    rating: 4.7,
    customersServed: 1247,
    avgServiceTime: "4.2 minutes",
    satisfactionRate: "96%",
    efficiencyScore: "94%"
  },
  schedule: {
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workHours: "8:00 AM - 5:00 PM",
    breakTime: "12:00 PM - 1:00 PM"
  }
}

export default function StaffProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: staffProfile.firstName,
    lastName: staffProfile.lastName,
    email: staffProfile.email,
    phone: staffProfile.phone,
    address: staffProfile.address,
    bio: staffProfile.bio
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving profile:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: staffProfile.firstName,
      lastName: staffProfile.lastName,
      email: staffProfile.email,
      phone: staffProfile.phone,
      address: staffProfile.address,
      bio: staffProfile.bio
    })
    setIsEditing(false)
  }

  return (
    <StaffLayout title="My Profile" description="Manage your profile information and view performance metrics">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="border-2 border-[#071952] bg-gradient-to-br from-[#EBF4F6] to-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
                    <AvatarImage src="/placeholder-user.jpg" alt="Staff Avatar" />
                    <AvatarFallback className="bg-[#088395] text-white text-2xl font-bold">
                      {staffProfile.firstName[0]}{staffProfile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-white border-2 border-[#088395] hover:bg-[#088395] hover:text-white"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#071952]">
                    {staffProfile.firstName} {staffProfile.lastName}
                  </h1>
                  <p className="text-lg text-[#088395] font-medium">{staffProfile.position}</p>
                  <p className="text-sm text-gray-600">{staffProfile.department}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <Badge className="bg-[#37B7C3] text-white">Employee ID: {staffProfile.employeeId}</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 lg:ml-auto">
                <div className="text-center p-3 bg-white rounded-lg border border-[#37B7C3]">
                  <div className="text-2xl font-bold text-[#071952]">{staffProfile.performance.rating}</div>
                  <div className="flex items-center justify-center gap-1 text-sm text-[#088395]">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Rating</span>
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-[#37B7C3]">
                  <div className="text-2xl font-bold text-[#071952]">{staffProfile.performance.customersServed}</div>
                  <div className="text-sm text-[#088395]">Served</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-[#37B7C3]">
                  <div className="text-2xl font-bold text-[#071952]">{staffProfile.performance.avgServiceTime}</div>
                  <div className="text-sm text-[#088395]">Avg Time</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-[#37B7C3]">
                  <div className="text-2xl font-bold text-[#071952]">{staffProfile.performance.satisfactionRate}</div>
                  <div className="text-sm text-[#088395]">Satisfaction</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#088395]" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Your basic profile information</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-transparent"
                  >
                    {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSave} className="gradient-primary text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="bg-transparent">
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-[#088395]" />
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{staffProfile.firstName} {staffProfile.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-[#088395]" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{staffProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-[#088395]" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{staffProfile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#088395]" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium">{staffProfile.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Bio</p>
                      <p className="font-medium">{staffProfile.bio}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills & Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#088395]" />
                  Skills & Languages
                </CardTitle>
                <CardDescription>Your professional skills and language proficiencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Professional Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {staffProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-[#EBF4F6] text-[#071952] border-[#37B7C3]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {staffProfile.languages.map((language, index) => (
                      <Badge key={index} className="bg-[#088395] text-white">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#088395]" />
                  Work Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-[#088395]" />
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-medium">{staffProfile.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-[#088395]" />
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{staffProfile.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#088395]" />
                  <div>
                    <p className="text-sm text-gray-600">Hire Date</p>
                    <p className="font-medium">{new Date(staffProfile.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-[#088395]" />
                  <div>
                    <p className="text-sm text-gray-600">Work Hours</p>
                    <p className="font-medium">{staffProfile.schedule.workHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#088395]" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-[#37B7C3] to-[#088395] text-white rounded-lg">
                  <div className="text-3xl font-bold mb-1">{staffProfile.performance.rating}</div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">Average Rating</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-green-800">Efficiency Score</span>
                    <span className="font-medium text-green-800">{staffProfile.performance.efficiencyScore}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm text-blue-800">Satisfaction Rate</span>
                    <span className="font-medium text-blue-800">{staffProfile.performance.satisfactionRate}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm text-purple-800">Avg Service Time</span>
                    <span className="font-medium text-purple-800">{staffProfile.performance.avgServiceTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#088395]" />
                  Work Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Work Days</p>
                  <div className="flex flex-wrap gap-1">
                    {staffProfile.schedule.workDays.map((day, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Break Time</p>
                  <p className="text-sm text-gray-600">{staffProfile.schedule.breakTime}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}
