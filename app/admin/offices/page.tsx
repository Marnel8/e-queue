"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Users, Clock, TrendingUp, MoreHorizontal, RefreshCw, Mail, Phone } from "lucide-react"
import AddOfficeForm from "@/components/admin/add-office-form"
import EditOfficeForm from "@/components/admin/edit-office-form"
import DeleteOfficeDialog from "@/components/admin/delete-office-dialog"
import { toast } from "sonner"

interface Office {
  id: string;
  name: string;
  type: string;
  location: string;
  focalPerson: string;
  focalPersonEmail?: string;
  focalPersonPhone?: string;
  status: "Active" | "Inactive" | "Maintenance";
  createdAt?: any;
  updatedAt?: any;
}

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 90) return "text-green-600"
  if (efficiency >= 80) return "text-yellow-600"
  return "text-red-600"
}

export default function OfficeManagement() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOffices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/offices");
      const result = await response.json();
      
      if (result.success) {
        setOffices(result.offices || []);
      } else {
        toast.error("Failed to fetch offices");
      }
    } catch (error) {
      toast.error("An error occurred while fetching offices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleOfficeAdded = () => {
    fetchOffices();
  };

  // Calculate totals
  const totalOffices = offices.length;
  const activeOffices = offices.filter(office => office.status === 'Active').length;
  const inactiveOffices = offices.filter(office => office.status === 'Inactive').length;
  const maintenanceOffices = offices.filter(office => office.status === 'Maintenance').length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#071952]">Office Management</h1>
          <p className="text-gray-700 mt-2">Manage campus offices and their services</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading offices...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#071952]">Office Management</h1>
        <p className="text-gray-700 mt-2">Manage campus offices and their services</p>
      </div>

      {/* Enhanced Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[#071952] mb-1">{totalOffices}</p>
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
                <p className="text-3xl font-bold text-[#071952] mb-1">{activeOffices}</p>
                <p className="text-sm font-medium text-gray-600">Active Offices</p>
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
                <p className="text-3xl font-bold text-[#071952] mb-1">{inactiveOffices}</p>
                <p className="text-sm font-medium text-gray-600">Inactive Offices</p>
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
                <p className="text-3xl font-bold text-[#071952] mb-1">{maintenanceOffices}</p>
                <p className="text-sm font-medium text-gray-600">Under Maintenance</p>
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
          <p className="text-gray-700">Manage and monitor all campus offices</p>
        </div>
        <AddOfficeForm onOfficeAdded={handleOfficeAdded} />
      </div>

      {/* Enhanced Offices Grid */}
      {offices.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Offices Found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first office.</p>
            <AddOfficeForm onOfficeAdded={handleOfficeAdded} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offices.map((office) => (
          <Card key={office.id} className="border-0 shadow-sm hover:shadow-lg hover:border-[#071952]/10 transition-all duration-300 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#071952]/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#071952]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#071952] mb-1">{office.name}</CardTitle>
                    <CardDescription className="text-gray-700 font-medium">{office.type}</CardDescription>
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
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Office Information */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                      <p className="text-sm text-gray-900 font-medium">{office.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Focal Person</p>
                      <p className="text-sm text-gray-900 font-medium">{office.focalPerson}</p>
                    </div>
                    {office.focalPersonEmail && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email
                        </p>
                        <p className="text-sm text-gray-900 font-medium">{office.focalPersonEmail}</p>
                      </div>
                    )}
                    {office.focalPersonPhone && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Phone
                        </p>
                        <p className="text-sm text-gray-900 font-medium">{office.focalPersonPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Services Note */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Services:</strong> Managed by office admin
                </p>
              </div>

              {/* Enhanced Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <EditOfficeForm 
                  office={office} 
                  onOfficeUpdated={handleOfficeAdded}
                />
                <DeleteOfficeDialog 
                  office={office} 
                  onOfficeDeleted={handleOfficeAdded}
                />
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  )
}

