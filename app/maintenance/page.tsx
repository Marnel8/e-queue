"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Image from "next/image";

export default function MaintenancePage() {
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const json = await res.json();
        if (json?.success && json.data) {
          setSystemSettings(json.data);
        }
      } catch (e) {
        // Error handled by UI state
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full animate-pulse mx-auto mb-4" />
            <div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded mx-auto" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="E-QUEUE Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
        </div>

        {/* Maintenance Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-yellow-600">
              System Under Maintenance
            </CardTitle>
            <CardDescription>
              {systemSettings?.systemName || "E-QUEUE"} is currently undergoing maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                We're working to improve your experience. Please check back later.
              </p>
              <p className="text-xs text-muted-foreground">
                {systemSettings?.systemDescription || "Queue Management System for Occidental Mindoro State College"}
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Last updated: {systemSettings?.updatedAt ? new Date(systemSettings.updatedAt).toLocaleString() : 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            For urgent assistance, please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
