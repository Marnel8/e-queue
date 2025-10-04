"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Database, Users, Clock, CheckCircle } from "lucide-react";

export default function SeedDataPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedCount, setSeedCount] = useState(10);
  const [office, setOffice] = useState("Registrar Office");

  const handleSeedTickets = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/seed-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: seedCount,
          office: office
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Created ${result.tickets.length} test tickets for ${office}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed data",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seed Test Data</h1>
        <p className="text-muted-foreground">
          Create sample tickets and processing data for testing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Seed Tickets
            </CardTitle>
            <CardDescription>
              Create sample tickets for testing the queue system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="office">Office</Label>
              <Input
                id="office"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                placeholder="Registrar Office"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Number of Tickets</Label>
              <Input
                id="count"
                type="number"
                value={seedCount}
                onChange={(e) => setSeedCount(parseInt(e.target.value) || 10)}
                min="1"
                max="50"
              />
            </div>
            <Button 
              onClick={handleSeedTickets} 
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding ? "Creating..." : "Create Test Tickets"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Current state of the queue system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Ticket Management System Active</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Processing Time Tracking Enabled</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Real-time Data Collection</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Ready for Staff Processing</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
          <CardDescription>
            Follow these steps to test the real processing time tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Create Test Data</h4>
            <p className="text-sm text-muted-foreground">
              Use the form above to create sample tickets for testing.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">2. Staff Processing</h4>
            <p className="text-sm text-muted-foreground">
              Go to the Staff page and process tickets using "Next Customer" or "Skip Customer" buttons.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">3. View Real Data</h4>
            <p className="text-sm text-muted-foreground">
              Check the Office Admin Services page to see real processing times based on actual staff completion times.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
