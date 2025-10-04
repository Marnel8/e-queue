"use server";

import { db } from "@/firebase/firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { logUserAction } from "./activity-log";

export interface TicketData {
  id?: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  office: string;
  service: string;
  priority: "regular" | "priority" | "vip";
  status: "waiting" | "current" | "processing" | "completed" | "cancelled" | "skipped";
  deskId: number;
  deskName: string;
  assignedStaff?: string;
  customerType: "appointment" | "walk-in";
  appointmentDate?: string;
  walkInTime?: string;
  priorityLaneImage?: string;
  createdAt: string;
  updatedAt: string;
  processingStartTime?: string;
  processingEndTime?: string;
  processingTimeMinutes?: number;
  completedBy?: string;
  completionReason?: string;
  notes?: string;
}

export interface ProcessingTimeData {
  id?: string;
  ticketId: string;
  ticketNumber: string;
  service: string;
  office: string;
  processingStartTime: string;
  processingEndTime: string;
  processingTimeMinutes: number;
  staffMember: string;
  deskId: number;
  completionReason: "completed" | "skipped";
  createdAt: string;
}

// Create a new ticket
export async function createTicket(data: Omit<TicketData, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; ticketId?: string; message: string }> {
  try {
    const ticketData: Omit<TicketData, 'id'> = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "tickets"), ticketData);

    // Log the activity
    await logUserAction(
      data.customerEmail,
      `Created ticket ${data.ticketNumber}`,
      "Ticket Management",
      "create"
    );

    return {
      success: true,
      ticketId: docRef.id,
      message: "Ticket created successfully"
    };
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return {
      success: false,
      message: error.message || "Failed to create ticket"
    };
  }
}

// Update ticket status
export async function updateTicketStatus(
  ticketId: string, 
  status: TicketData['status'],
  staffMember?: string,
  processingStartTime?: string,
  processingEndTime?: string,
  processingTimeMinutes?: number,
  completionReason?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const ticketRef = doc(db, "tickets", ticketId);
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (staffMember) updateData.assignedStaff = staffMember;
    if (processingStartTime) updateData.processingStartTime = processingStartTime;
    if (processingEndTime) updateData.processingEndTime = processingEndTime;
    if (processingTimeMinutes) updateData.processingTimeMinutes = processingTimeMinutes;
    if (completionReason) updateData.completionReason = completionReason;

    await updateDoc(ticketRef, updateData);

    // If ticket is completed, create processing time record
    if (status === "completed" || status === "skipped") {
      const ticketDoc = await getDoc(ticketRef);
      if (ticketDoc.exists()) {
        const ticketData = ticketDoc.data() as TicketData;
        
        await addDoc(collection(db, "processing_times"), {
          ticketId,
          ticketNumber: ticketData.ticketNumber,
          service: ticketData.service,
          office: ticketData.office,
          processingStartTime: processingStartTime || ticketData.processingStartTime,
          processingEndTime: processingEndTime || new Date().toISOString(),
          processingTimeMinutes: processingTimeMinutes || ticketData.processingTimeMinutes,
          staffMember: staffMember || ticketData.assignedStaff,
          deskId: ticketData.deskId,
          completionReason: completionReason || status,
          createdAt: new Date().toISOString(),
        } as ProcessingTimeData);
      }
    }

    // Log the activity
    if (staffMember) {
      await logUserAction(
        staffMember,
        `Updated ticket ${ticketId} status to ${status}`,
        "Ticket Management",
        "update"
      );
    }

    return {
      success: true,
      message: "Ticket status updated successfully"
    };
  } catch (error: any) {
    console.error("Error updating ticket status:", error);
    return {
      success: false,
      message: error.message || "Failed to update ticket status"
    };
  }
}

// Get tickets for a specific office
export async function getTicketsByOffice(office: string, status?: string): Promise<{ success: boolean; tickets?: TicketData[]; message?: string }> {
  try {
    let q = query(
      collection(db, "tickets"),
      where("office", "==", office),
      orderBy("createdAt", "asc")
    );

    if (status) {
      q = query(
        collection(db, "tickets"),
        where("office", "==", office),
        where("status", "==", status),
        orderBy("createdAt", "asc")
      );
    }

    const querySnapshot = await getDocs(q);
    const tickets: TicketData[] = [];

    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id,
        ...doc.data()
      } as TicketData);
    });

    return {
      success: true,
      tickets
    };
  } catch (error: any) {
    console.error("Error fetching tickets:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch tickets"
    };
  }
}

// Get processing times for services
export async function getProcessingTimesByOffice(office: string, service?: string): Promise<{ success: boolean; processingTimes?: ProcessingTimeData[]; message?: string }> {
  try {
    let q = query(
      collection(db, "processing_times"),
      where("office", "==", office),
      orderBy("createdAt", "desc")
    );

    if (service) {
      q = query(
        collection(db, "processing_times"),
        where("office", "==", office),
        where("service", "==", service),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const processingTimes: ProcessingTimeData[] = [];

    querySnapshot.forEach((doc) => {
      processingTimes.push({
        id: doc.id,
        ...doc.data()
      } as ProcessingTimeData);
    });

    return {
      success: true,
      processingTimes
    };
  } catch (error: any) {
    console.error("Error fetching processing times:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch processing times"
    };
  }
}

// Get processing time statistics
export async function getProcessingTimeStats(office: string, service?: string): Promise<{ 
  success: boolean; 
  stats?: {
    averageProcessingTimeMinutes: number;
    totalCompletions: number;
    byService: Record<string, { average: number; count: number }>;
    lastUpdated: string;
  }; 
  message?: string 
}> {
  try {
    const result = await getProcessingTimesByOffice(office, service);
    
    if (!result.success || !result.processingTimes) {
      return {
        success: false,
        message: "Failed to fetch processing times"
      };
    }

    const processingTimes = result.processingTimes;
    
    if (processingTimes.length === 0) {
      return {
        success: true,
        stats: {
          averageProcessingTimeMinutes: 0,
          totalCompletions: 0,
          byService: {},
          lastUpdated: new Date().toISOString()
        }
      };
    }

    // Calculate overall average
    const totalTime = processingTimes.reduce((sum, pt) => sum + pt.processingTimeMinutes, 0);
    const averageProcessingTimeMinutes = totalTime / processingTimes.length;

    // Calculate by service
    const byService: Record<string, { average: number; count: number }> = {};
    const serviceGroups = processingTimes.reduce((groups, pt) => {
      if (!groups[pt.service]) {
        groups[pt.service] = [];
      }
      groups[pt.service].push(pt);
      return groups;
    }, {} as Record<string, ProcessingTimeData[]>);

    Object.entries(serviceGroups).forEach(([service, times]) => {
      const serviceTotal = times.reduce((sum, pt) => sum + pt.processingTimeMinutes, 0);
      byService[service] = {
        average: serviceTotal / times.length,
        count: times.length
      };
    });

    return {
      success: true,
      stats: {
        averageProcessingTimeMinutes: Math.round(averageProcessingTimeMinutes * 10) / 10,
        totalCompletions: processingTimes.length,
        byService,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error("Error calculating processing time stats:", error);
    return {
      success: false,
      message: error.message || "Failed to calculate processing time statistics"
    };
  }
}
