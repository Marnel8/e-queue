import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Users, Clock, TrendingUp, Plus, MoreHorizontal } from "lucide-react"

const offices = [
  {
    id: 1,
    name: "Registrar Office",
    description: "Student records and enrollment services",
    staff: 8,
    activeQueues: 3,
    avgWaitTime: "6.2m",
    efficiency: 96,
    status: "Active",
    services: ["Enrollment", "Transcript Request", "Certificate Issuance"],
  },
  {
    id: 2,
    name: "Cashier Office",
    description: "Payment processing and financial services",
    staff: 5,
    activeQueues: 2,
    avgWaitTime: "4.8m",
    efficiency: 94,
    status: "Active",
    services: ["Tuition Payment", "Fee Collection", "Refunds"],
  },
  {
    id: 3,
    name: "Student Affairs Office",
    description: "Student support and welfare services",
    staff: 6,
    activeQueues: 4,
    avgWaitTime: "12.3m",
    efficiency: 87,
    status: "Active",
    services: ["Student ID", "Scholarship", "Disciplinary"],
  },
  {
    id: 4,
    name: "Library Services",
    description: "Library resources and research support",
    staff: 4,
    activeQueues: 1,
    avgWaitTime: "3.1m",
    efficiency: 92,
    status: "Active",
    services: ["Book Borrowing", "Research Assistance", "Computer Access"],
  },
  {
    id: 5,
    name: "IT Services",
    description: "Technical support and system maintenance",
    staff: 3,
    activeQueues: 2,
    avgWaitTime: "18.7m",
    efficiency: 78,
    status: "Maintenance",
    services: ["System Support", "Account Issues", "Hardware Repair"],
  },
]

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 90) return "text-green-600"
  if (efficiency >= 80) return "text-yellow-600"
  return "text-red-600"
}

export default function OfficeManagement() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#071952]">Office Management</h1>
        <p className="text-gray-600 mt-2">Manage campus offices and their services</p>
      </div>

      {/* Enhanced Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[#071952] mb-1">24</p>
                <p className="text-sm font-medium text-gray-600">Total Offices</p>
              </div>
              <div className="p-3 bg-[#071952]/10 rounded-xl">
                <Building2 className="w-6 h-6 text-[#071952]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[#071952] mb-1">156</p>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
              </div>
              <div className="p-3 bg-[#088395]/10 rounded-xl">
                <Users className="w-6 h-6 text-[#088395]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[#071952] mb-1">8.5m</p>
                <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
              </div>
              <div className="p-3 bg-[#37B7C3]/10 rounded-xl">
                <Clock className="w-6 h-6 text-[#37B7C3]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[#071952] mb-1">89.4%</p>
                <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#071952] mb-1">Office Directory</h2>
          <p className="text-gray-600">Manage and monitor all campus offices</p>
        </div>
        <Button className="bg-[#071952] hover:bg-[#071952]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Office
        </Button>
      </div>

      {/* Enhanced Offices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offices.map((office) => (
          <Card key={office.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#071952]/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#071952]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#071952] mb-1">{office.name}</CardTitle>
                    <CardDescription className="text-gray-600">{office.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={office.status === "Active" ? "default" : "secondary"}
                    className={
                      office.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                    }
                  >
                    {office.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Enhanced Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[#071952]/5 rounded-lg">
                  <p className="text-2xl font-bold text-[#071952] mb-1">{office.staff}</p>
                  <p className="text-xs font-medium text-gray-600">Staff Members</p>
                </div>
                <div className="text-center p-3 bg-[#088395]/5 rounded-lg">
                  <p className="text-2xl font-bold text-[#088395] mb-1">{office.activeQueues}</p>
                  <p className="text-xs font-medium text-gray-600">Active Queues</p>
                </div>
                <div className="text-center p-3 bg-[#37B7C3]/5 rounded-lg">
                  <p className="text-2xl font-bold text-[#37B7C3] mb-1">{office.avgWaitTime}</p>
                  <p className="text-xs font-medium text-gray-600">Avg Wait Time</p>
                </div>
              </div>

              {/* Enhanced Efficiency */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Queue Efficiency</span>
                  <span className={`text-sm font-bold ${getEfficiencyColor(office.efficiency)}`}>
                    {office.efficiency}%
                  </span>
                </div>
                <Progress value={office.efficiency} className="h-2" />
              </div>

              {/* Enhanced Services */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Services Offered</p>
                <div className="flex flex-wrap gap-2">
                  {office.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white hover:bg-gray-50 border-gray-200">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Enhanced Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white hover:bg-[#071952]/5 hover:border-[#071952]/20 transition-all duration-200"
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white hover:bg-[#088395]/5 hover:border-[#088395]/20 transition-all duration-200"
                >
                  Manage Staff
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
