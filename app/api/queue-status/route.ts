import { NextResponse } from 'next/server';

interface QueueItem {
  id: string;
  ticketNumber: string;
  service: string;
  status: "waiting" | "serving" | "completed";
  estimatedWaitTime: number;
  priority: "normal" | "priority" | "vip";
  timestamp: string;
  deskId: number;
  assignedStaff?: string;
}

interface Desk {
  id: number;
  name: string;
  assignedStaff: string | null;
  status: "active" | "inactive" | "break";
}

interface ServiceQueue {
  serviceName: string;
  currentServing: string | null;
  waitingCount: number;
  estimatedWaitTime: number;
  queue: QueueItem[];
  desks: Desk[];
}

// Mock desk data - in a real application, this would come from a database
function generateMockDesks(): Desk[] {
  return [
    { id: 1, name: "Desk 1", assignedStaff: "Ana Rodriguez", status: "active" },
    { id: 2, name: "Desk 2", assignedStaff: "Carlos Mendoza", status: "active" },
    { id: 3, name: "Desk 3", assignedStaff: "Elena Santos", status: "break" },
    { id: 4, name: "Desk 4", assignedStaff: null, status: "inactive" },
  ];
}

// Simulated queue data for school registrar office - in a real application, this would come from a database
function generateMockQueueData(): ServiceQueue[] {
  const services = [
    "Transcript Request",
    "Certificate Issuance", 
    "Enrollment Services",
    "Grade Verification",
    "ID Replacement",
    "Form Requests",
    "Clearance Processing",
    "Information Inquiry",
    "Document Authentication",
    "Academic Records"
  ];

  const mockDesks = generateMockDesks();
  const activeDesks = mockDesks.filter(desk => desk.status === "active");

  return services.map((service, index) => {
    // More realistic queue lengths based on school service type
    let waitingCount: number;
    let estimatedWaitTime: number;
    
    if (service.includes("Transcript")) {
      waitingCount = Math.floor(Math.random() * 15) + 8; // Usually busy
      estimatedWaitTime = Math.floor(Math.random() * 20) + 15;
    } else if (service.includes("Enrollment")) {
      waitingCount = Math.floor(Math.random() * 12) + 6;
      estimatedWaitTime = Math.floor(Math.random() * 25) + 20;
    } else if (service.includes("Certificate")) {
      waitingCount = Math.floor(Math.random() * 10) + 5;
      estimatedWaitTime = Math.floor(Math.random() * 18) + 12;
    } else if (service.includes("ID Replacement")) {
      waitingCount = Math.floor(Math.random() * 8) + 3;
      estimatedWaitTime = Math.floor(Math.random() * 15) + 10;
    } else if (service.includes("Form")) {
      waitingCount = Math.floor(Math.random() * 6) + 2;
      estimatedWaitTime = Math.floor(Math.random() * 10) + 5;
    } else if (service.includes("Clearance")) {
      waitingCount = Math.floor(Math.random() * 8) + 4;
      estimatedWaitTime = Math.floor(Math.random() * 20) + 15;
    } else if (service.includes("Information")) {
      waitingCount = Math.floor(Math.random() * 4) + 1;
      estimatedWaitTime = Math.floor(Math.random() * 8) + 3;
    } else {
      waitingCount = Math.floor(Math.random() * 8) + 3;
      estimatedWaitTime = Math.floor(Math.random() * 15) + 10;
    }
    
    // Generate mock queue items
    const queue: QueueItem[] = [];
    const servicePrefix = service.split(' ').map(word => word[0]).join('');
    
    // Add current serving item (more realistic timing)
    if (Math.random() > 0.2 && activeDesks.length > 0) { // 80% chance of having someone currently being served
      const randomDesk = activeDesks[Math.floor(Math.random() * activeDesks.length)];
      queue.push({
        id: `${index}-serving`,
        ticketNumber: `${servicePrefix}-${String(index + 1).padStart(3, '0')}`,
        service,
        status: "serving",
        estimatedWaitTime: 0,
        priority: Math.random() > 0.85 ? "vip" : Math.random() > 0.65 ? "priority" : "normal",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        deskId: randomDesk.id,
        assignedStaff: randomDesk.assignedStaff || undefined
      });
    }

    // Add waiting items with more realistic priorities
    for (let i = 1; i <= Math.min(waitingCount, 10); i++) {
      let priority: "normal" | "priority" | "vip" = "normal";
      if (Math.random() > 0.92) {
        priority = "vip"; // 8% chance
      } else if (Math.random() > 0.75) {
        priority = "priority"; // 17% chance
      }
      
      // Assign to next available desk in round-robin fashion
      const deskIndex = activeDesks.length > 0 ? (i - 1) % activeDesks.length : 0;
      const assignedDesk = activeDesks[deskIndex] || { id: 1, assignedStaff: null };
      
      queue.push({
        id: `${index}-waiting-${i}`,
        ticketNumber: `${servicePrefix}-${String(index + 1 + i).padStart(3, '0')}`,
        service,
        status: "waiting",
        estimatedWaitTime: Math.floor(Math.random() * estimatedWaitTime) + 5,
        priority,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        deskId: assignedDesk.id,
        assignedStaff: assignedDesk.assignedStaff || undefined
      });
    }

    return {
      serviceName: service,
      currentServing: queue.find(q => q.status === "serving")?.ticketNumber || null,
      waitingCount,
      estimatedWaitTime,
      queue,
      desks: mockDesks
    };
  });
}

export async function GET() {
  try {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const queueData = generateMockQueueData();
    
    return NextResponse.json({
      success: true,
      data: queueData,
      timestamp: new Date().toISOString(),
      message: "Queue status retrieved successfully"
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve queue status",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
