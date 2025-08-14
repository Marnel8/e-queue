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
import { Plus, Search, MoreHorizontal, Edit, Trash2, User, Clock, CheckCircle } from "lucide-react"

const staffMembers = [
  {
    id: 1,
    name: "Ana Rodriguez",
    email: "ana.rodriguez@omsc.edu.ph",
    position: "Senior Staff",
    status: "Online",
    shift: "Morning (8:00 AM - 4:00 PM)",
    queuesHandled: 23,
    avgServiceTime: "4.2m",
    lastActive: "Active now",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@omsc.edu.ph",
    position: "Staff Member",
    status: "Online",
    shift: "Morning (8:00 AM - 4:00 PM)",
    queuesHandled: 18,
    avgServiceTime: "5.1m",
    lastActive: "Active now",
  },
  {
    id: 3,
    name: "Elena Santos",
    email: "elena.santos@omsc.edu.ph",
    position: "Staff Member",
    status: "Break",
    shift: "Afternoon (12:00 PM - 8:00 PM)",
    queuesHandled: 15,
    avgServiceTime: "3.8m",
    lastActive: "5 minutes ago",
  },
  {
    id: 4,
    name: "Roberto Garcia",
    email: "roberto.garcia@omsc.edu.ph",
    position: "Junior Staff",
    status: "Offline",
    shift: "Afternoon (12:00 PM - 8:00 PM)",
    queuesHandled: 12,
    avgServiceTime: "6.3m",
    lastActive: "2 hours ago",
  },
]

const getStatusBadge = (status: string) => {
  const variants = {
    Online: "bg-green-100 text-green-800",
    Break: "bg-yellow-100 text-yellow-800",
    Offline: "bg-gray-100 text-gray-800",
  }
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Online":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "Break":
      return <Clock className="w-4 h-4 text-yellow-600" />
    default:
      return <User className="w-4 h-4 text-gray-600" />
  }
}

export default function StaffManagement() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071952]">Staff Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your office staff and their schedules</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input type="text" placeholder="Search staff members..." className="pl-10 w-full sm:w-64" />
        </div>

        <Button className="gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Assigned to office</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">6</div>
            <p className="text-xs text-muted-foreground">Active right now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Break</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <p className="text-xs text-muted-foreground">Taking break</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9m</div>
            <p className="text-xs text-muted-foreground">Service time</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Staff Members</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage your office staff and monitor their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-48">Staff Member</TableHead>
                  <TableHead className="min-w-24">Position</TableHead>
                  <TableHead className="min-w-20">Status</TableHead>
                  <TableHead className="min-w-32 hidden sm:table-cell">Shift</TableHead>
                  <TableHead className="min-w-28 hidden md:table-cell">Performance</TableHead>
                  <TableHead className="min-w-24 hidden lg:table-cell">Last Active</TableHead>
                  <TableHead className="text-right min-w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                          {getStatusIcon(staff.status)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{staff.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{staff.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{staff.position}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(staff.status)}>{staff.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs hidden sm:table-cell">{staff.shift}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-xs">
                        <div>{staff.queuesHandled} queues handled</div>
                        <div className="text-muted-foreground">{staff.avgServiceTime} avg time</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                      {staff.lastActive}
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
                            Edit Staff
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Staff
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

      {/* Staff Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Staff Performance Overview</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Individual performance metrics for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {staffMembers.slice(0, 3).map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{staff.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{staff.position}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm sm:text-base">{staff.queuesHandled} queues</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{staff.avgServiceTime} avg time</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
