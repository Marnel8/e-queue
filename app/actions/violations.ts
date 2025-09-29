import { db } from "@/firebase/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { z } from "zod";

export interface ViolationData {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  violation: string;
  details: string;
  type: "security" | "fraud" | "abuse" | "attendance" | "compliance";
  severity: "high" | "medium" | "low";
  status: "active" | "resolved" | "pending";
  reportedBy: string;
  reportedByName: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  notes?: string;
}

export const ViolationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "User name is required"),
  userEmail: z.string().email("Valid email is required"),
  violation: z.string().min(1, "Violation description is required"),
  details: z.string().min(1, "Details are required"),
  type: z.enum(["security", "fraud", "abuse", "attendance", "compliance"]),
  severity: z.enum(["high", "medium", "low"]),
  status: z.enum(["active", "resolved", "pending"]),
  reportedBy: z.string().min(1, "Reporter ID is required"),
  reportedByName: z.string().min(1, "Reporter name is required"),
  notes: z.string().optional(),
});

export type ViolationForm = z.infer<typeof ViolationSchema>;

// Create a new violation
export async function createViolation(data: ViolationForm): Promise<{ success: boolean; message: string; violationId?: string }> {
  try {
    const violationRef = collection(db, "violations");
    
    const violationData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(violationRef, violationData);

    return {
      success: true,
      message: "Violation created successfully",
      violationId: docRef.id
    };
  } catch (error: any) {
    console.error("Error creating violation:", error);
    return {
      success: false,
      message: "Failed to create violation"
    };
  }
}

// Get all violations with optional filters
export async function getViolations(filters?: {
  status?: string;
  type?: string;
  severity?: string;
  userId?: string;
  limit?: number;
}): Promise<{ success: boolean; violations?: ViolationData[]; message?: string }> {
  try {
    const violationsRef = collection(db, "violations");
    let q = query(violationsRef);

    if (filters?.status) {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters?.type) {
      q = query(q, where("type", "==", filters.type));
    }
    if (filters?.severity) {
      q = query(q, where("severity", "==", filters.severity));
    }
    if (filters?.userId) {
      q = query(q, where("userId", "==", filters.userId));
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    const violations = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        resolvedAt: doc.data().resolvedAt?.toDate?.()?.toISOString(),
      }))
      .sort((a, b) => {
        // Sort by createdAt in descending order (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }) as ViolationData[];

    return {
      success: true,
      violations: violations
    };
  } catch (error: any) {
    console.error("Error fetching violations:", error);
    return {
      success: false,
      message: "Failed to fetch violations"
    };
  }
}

// Update violation status
export async function updateViolationStatus(
  violationId: string, 
  status: "active" | "resolved" | "pending",
  resolvedBy?: string,
  resolvedByName?: string,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const violationRef = doc(db, "violations", violationId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === "resolved") {
      updateData.resolvedAt = serverTimestamp();
      if (resolvedBy) updateData.resolvedBy = resolvedBy;
      if (resolvedByName) updateData.resolvedByName = resolvedByName;
    }
    if (notes) updateData.notes = notes;

    await updateDoc(violationRef, updateData);

    return {
      success: true,
      message: "Violation status updated successfully"
    };
  } catch (error: any) {
    console.error("Error updating violation:", error);
    return {
      success: false,
      message: "Failed to update violation"
    };
  }
}

// Delete violation
export async function deleteViolation(violationId: string): Promise<{ success: boolean; message: string }> {
  try {
    const violationRef = doc(db, "violations", violationId);
    await deleteDoc(violationRef);

    return {
      success: true,
      message: "Violation deleted successfully"
    };
  } catch (error: any) {
    console.error("Error deleting violation:", error);
    return {
      success: false,
      message: "Failed to delete violation"
    };
  }
}

// Get violation statistics
export async function getViolationStats(): Promise<{ 
  success: boolean; 
  stats?: {
    total: number;
    active: number;
    resolved: number;
    pending: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  }; 
  message?: string 
}> {
  try {
    const violationsRef = collection(db, "violations");
    const snapshot = await getDocs(violationsRef);
    
    const violations = snapshot.docs.map(doc => doc.data());
    
    const stats = {
      total: violations.length,
      active: violations.filter(v => v.status === "active").length,
      resolved: violations.filter(v => v.status === "resolved").length,
      pending: violations.filter(v => v.status === "pending").length,
      byType: violations.reduce((acc, v) => {
        acc[v.type] = (acc[v.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySeverity: violations.reduce((acc, v) => {
        acc[v.severity] = (acc[v.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return {
      success: true,
      stats
    };
  } catch (error: any) {
    console.error("Error fetching violation stats:", error);
    return {
      success: false,
      message: "Failed to fetch violation statistics"
    };
  }
}
