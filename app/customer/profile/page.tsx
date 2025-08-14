import { CustomerLayout } from "@/components/customer/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Upload, Save } from "lucide-react"

export default function Profile() {
  return (
    <CustomerLayout title="Profile" description="Manage your account information">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Juan Dela Cruz</h2>
                <p className="text-muted-foreground">Student ID: 2021-12345</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">Regular Student</Badge>
                  <Badge className="bg-green-500 text-white">Verified</Badge>
                </div>
              </div>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Juan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Dela Cruz" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="juan.delacruz@omsc.edu.ph" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+63 912 345 6789" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select defaultValue="bsit">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bsit">BS Information Technology</SelectItem>
                    <SelectItem value="bscs">BS Computer Science</SelectItem>
                    <SelectItem value="bsba">BS Business Administration</SelectItem>
                    <SelectItem value="bsed">BS Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearLevel">Year Level</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="gradient-primary text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Priority Status */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Status</CardTitle>
            <CardDescription>Upload documents for priority queue access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Upload Priority Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload PWD ID, Senior Citizen ID, or other priority documents
              </p>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Accepted file types: PDF, JPG, PNG (Max 5MB)</p>
              <p>Documents will be verified within 24-48 hours</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your E-Queue usage summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24</div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">22</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">4.8</div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  )
}
