import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Clock, FileText, CheckCircle, AlertCircle } from "lucide-react"

const services = [
  {
    id: 1,
    name: "Transcript Request",
    description: "Official academic transcript processing",
    requirements: ["Valid ID", "Request Form", "Payment Receipt"],
    estimatedTime: "15-20 minutes",
    fee: "₱150.00",
    status: "Active",
    dailyRequests: 23,
    avgWaitTime: "4.2m",
  },
  {
    id: 2,
    name: "Certificate Issuance",
    description: "Academic certificates and diplomas",
    requirements: ["Valid ID", "Application Form", "Clearance"],
    estimatedTime: "20-30 minutes",
    fee: "₱200.00",
    status: "Active",
    dailyRequests: 18,
    avgWaitTime: "6.8m",
  },
  {
    id: 3,
    name: "Enrollment Services",
    description: "Student enrollment and registration",
    requirements: ["Admission Documents", "Medical Certificate", "Payment"],
    estimatedTime: "30-45 minutes",
    fee: "₱500.00",
    status: "Active",
    dailyRequests: 15,
    avgWaitTime: "12.3m",
  },
  {
    id: 4,
    name: "Grade Verification",
    description: "Official grade verification and authentication",
    requirements: ["Valid ID", "Verification Form"],
    estimatedTime: "10-15 minutes",
    fee: "₱100.00",
    status: "Inactive",
    dailyRequests: 0,
    avgWaitTime: "N/A",
  },
]

const getStatusBadge = (status: string) => {
  return status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
}

const getStatusIcon = (status: string) => {
  return status === "Active" ? (
    <CheckCircle className="w-4 h-4 text-green-600" />
  ) : (
    <AlertCircle className="w-4 h-4 text-gray-600" />
  )
}

export default function ServiceManagement() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071952]">Service Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage office services and requirements</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search services..." className="pl-10 w-full sm:w-64" />
        </div>

        <Button className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Service Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">Service requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8m</div>
            <p className="text-xs text-muted-foreground">Average time</p>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Office Services</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Manage services offered by your office</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-48">Service</TableHead>
                  <TableHead className="min-w-32 hidden sm:table-cell">Requirements</TableHead>
                  <TableHead className="min-w-28">Processing Time</TableHead>
                  <TableHead className="min-w-20">Fee</TableHead>
                  <TableHead className="min-w-20">Status</TableHead>
                  <TableHead className="min-w-28 hidden md:table-cell">Performance</TableHead>
                  <TableHead className="text-right min-w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          {getStatusIcon(service.status)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm">{service.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{service.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="space-y-1">
                        {service.requirements.slice(0, 2).map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {req}
                          </Badge>
                        ))}
                        {service.requirements.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.requirements.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{service.estimatedTime}</TableCell>
                    <TableCell className="font-medium text-sm">{service.fee}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(service.status)}>{service.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-xs">
                        <div>{service.dailyRequests} requests today</div>
                        <div className="text-muted-foreground">{service.avgWaitTime} avg wait</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Service
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Manage Requirements
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Service Performance Today</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Real-time performance metrics for active services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {services
              .filter((service) => service.status === "Active")
              .map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{service.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{service.estimatedTime}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-sm sm:text-base">{service.dailyRequests} requests</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{service.avgWaitTime} avg wait</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
