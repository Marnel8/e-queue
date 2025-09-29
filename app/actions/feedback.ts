"use server";

import { db } from "@/firebase/firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  increment
} from "firebase/firestore";
import { logUserAction } from "./activity-log";

export interface FeedbackData {
  id?: string;
  customerName: string;
  customerEmail?: string;
  service: string;
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  staffMember?: string;
  officeId: string;
  ticketId?: string;
  status: "pending" | "reviewed" | "resolved";
  response?: string;
  respondedBy?: string;
  respondedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface FeedbackFilters {
  status?: string;
  sentiment?: string;
  service?: string;
  rating?: number;
  officeId?: string;
  staffMember?: string;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Get all feedback with optional filters
export async function getFeedback(filters: FeedbackFilters = {}): Promise<{ 
  success: boolean; 
  feedback?: FeedbackData[]; 
  message?: string 
}> {
  try {
    const feedbackRef = collection(db, "feedback");
    let q = query(feedbackRef);

    // Apply filters
    if (filters.officeId) {
      q = query(q, where("officeId", "==", filters.officeId));
    }
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters.sentiment) {
      q = query(q, where("sentiment", "==", filters.sentiment));
    }
    if (filters.service) {
      q = query(q, where("service", "==", filters.service));
    }
    if (filters.rating) {
      q = query(q, where("rating", "==", filters.rating));
    }
    if (filters.staffMember) {
      q = query(q, where("staffMember", "==", filters.staffMember));
    }
    
    // Only add orderBy if we don't have officeId filter to avoid composite index requirement
    if (!filters.officeId) {
      q = query(q, orderBy("createdAt", "desc"));
    }
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    const feedback: FeedbackData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      feedback.push({
        id: doc.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        service: data.service,
        rating: data.rating,
        comment: data.comment,
        sentiment: data.sentiment,
        staffMember: data.staffMember,
        officeId: data.officeId,
        ticketId: data.ticketId,
        status: data.status,
        response: data.response,
        respondedBy: data.respondedBy,
        respondedAt: data.respondedAt?.toDate?.()?.toISOString() || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    // Sort by createdAt in descending order if we couldn't do it in the query
    if (filters.officeId) {
      feedback.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    }

    // Apply date filters if provided
    let filteredFeedback = feedback;
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredFeedback = filteredFeedback.filter(f => {
        if (!f.createdAt) return false;
        return new Date(f.createdAt) >= fromDate;
      });
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredFeedback = filteredFeedback.filter(f => {
        if (!f.createdAt) return false;
        return new Date(f.createdAt) <= toDate;
      });
    }

    return { success: true, feedback: filteredFeedback };
  } catch (error: any) {
    console.error("Error getting feedback:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch feedback" 
    };
  }
}

// Get feedback by ID
export async function getFeedbackById(id: string): Promise<{ 
  success: boolean; 
  feedback?: FeedbackData; 
  message?: string 
}> {
  try {
    const feedbackRef = doc(db, "feedback", id);
    const feedbackSnap = await getDoc(feedbackRef);

    if (!feedbackSnap.exists()) {
      return { success: false, message: "Feedback not found" };
    }

    const data = feedbackSnap.data();
    const feedback: FeedbackData = {
      id: feedbackSnap.id,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      service: data.service,
      rating: data.rating,
      comment: data.comment,
      sentiment: data.sentiment,
      staffMember: data.staffMember,
      officeId: data.officeId,
      ticketId: data.ticketId,
      status: data.status,
      response: data.response,
      respondedBy: data.respondedBy,
      respondedAt: data.respondedAt?.toDate?.()?.toISOString() || null,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };

    return { success: true, feedback };
  } catch (error: any) {
    console.error("Error getting feedback:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch feedback" 
    };
  }
}

// Create new feedback
export async function createFeedback(
  data: Omit<FeedbackData, "id" | "createdAt" | "updatedAt" | "respondedAt">,
  userId?: string
): Promise<{ success: boolean; feedbackId?: string; message?: string }> {
  try {
    // Determine sentiment based on rating
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (data.rating >= 4) {
      sentiment = "positive";
    } else if (data.rating <= 2) {
      sentiment = "negative";
    }

    const feedbackData = {
      ...data,
      sentiment,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "feedback"), feedbackData);

    // Log the activity if userId is provided
    if (userId) {
      await logUserAction(
        userId,
        `Created feedback for ${data.service} (${data.rating} stars)`,
        "Feedback Management",
        "create"
      );
    }

    return { success: true, feedbackId: docRef.id };
  } catch (error: any) {
    console.error("Error creating feedback:", error);
    return { 
      success: false, 
      message: error.message || "Failed to create feedback" 
    };
  }
}

// Update feedback
export async function updateFeedback(
  id: string,
  data: Partial<Omit<FeedbackData, "id" | "createdAt" | "customerName" | "customerEmail" | "service" | "rating" | "comment" | "officeId">>,
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const feedbackRef = doc(db, "feedback", id);
    
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    // If adding a response, set respondedAt
    if (data.response && !data.respondedAt) {
      updateData.respondedAt = serverTimestamp();
    }

    await updateDoc(feedbackRef, updateData);

    // Log the activity
    await logUserAction(
      userId,
      `Updated feedback ID: ${id}`,
      "Feedback Management",
      "update"
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error updating feedback:", error);
    return { 
      success: false, 
      message: error.message || "Failed to update feedback" 
    };
  }
}

// Delete feedback
export async function deleteFeedback(
  id: string,
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const feedbackRef = doc(db, "feedback", id);
    await deleteDoc(feedbackRef);

    // Log the activity
    await logUserAction(
      userId,
      `Deleted feedback ID: ${id}`,
      "Feedback Management",
      "delete"
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    return { 
      success: false, 
      message: error.message || "Failed to delete feedback" 
    };
  }
}

// Get feedback statistics
export async function getFeedbackStats(officeId?: string): Promise<{ 
  success: boolean; 
  stats?: {
    total: number;
    pending: number;
    reviewed: number;
    resolved: number;
    averageRating: number;
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
    thisMonth: number;
    thisWeek: number;
    byService: Record<string, number>;
    byStaff: Record<string, number>;
  }; 
  message?: string 
}> {
  try {
    const feedbackRef = collection(db, "feedback");
    let q = query(feedbackRef);

    if (officeId) {
      q = query(q, where("officeId", "==", officeId));
    }

    const querySnapshot = await getDocs(q);
    const feedback: FeedbackData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      feedback.push({
        id: doc.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        service: data.service,
        rating: data.rating,
        comment: data.comment,
        sentiment: data.sentiment,
        staffMember: data.staffMember,
        officeId: data.officeId,
        ticketId: data.ticketId,
        status: data.status,
        response: data.response,
        respondedBy: data.respondedBy,
        respondedAt: data.respondedAt?.toDate?.()?.toISOString() || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate statistics
    const total = feedback.length;
    const pending = feedback.filter(f => f.status === "pending").length;
    const reviewed = feedback.filter(f => f.status === "reviewed").length;
    const resolved = feedback.filter(f => f.status === "resolved").length;
    
    const ratings = feedback.map(f => f.rating).filter(r => typeof r === "number");
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;
    
    const positive = feedback.filter(f => f.sentiment === "positive").length;
    const neutral = feedback.filter(f => f.sentiment === "neutral").length;
    const negative = feedback.filter(f => f.sentiment === "negative").length;
    
    const positivePercentage = total > 0 ? Math.round((positive / total) * 100) : 0;
    const neutralPercentage = total > 0 ? Math.round((neutral / total) * 100) : 0;
    const negativePercentage = total > 0 ? Math.round((negative / total) * 100) : 0;
    
    const thisMonthCount = feedback.filter(f => {
      if (!f.createdAt) return false;
      const createdDate = new Date(f.createdAt);
      return createdDate >= thisMonth;
    }).length;
    
    const thisWeekCount = feedback.filter(f => {
      if (!f.createdAt) return false;
      const createdDate = new Date(f.createdAt);
      return createdDate >= thisWeek;
    }).length;

    // Group by service
    const byService: Record<string, number> = {};
    feedback.forEach(f => {
      byService[f.service] = (byService[f.service] || 0) + 1;
    });

    // Group by staff member
    const byStaff: Record<string, number> = {};
    feedback.forEach(f => {
      if (f.staffMember) {
        byStaff[f.staffMember] = (byStaff[f.staffMember] || 0) + 1;
      }
    });

    const stats = {
      total,
      pending,
      reviewed,
      resolved,
      averageRating: Math.round(averageRating * 10) / 10,
      positivePercentage,
      neutralPercentage,
      negativePercentage,
      thisMonth: thisMonthCount,
      thisWeek: thisWeekCount,
      byService,
      byStaff,
    };

    return { success: true, stats };
  } catch (error: any) {
    console.error("Error getting feedback stats:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch feedback statistics" 
    };
  }
}

// Respond to feedback
export async function respondToFeedback(
  id: string,
  response: string,
  userId: string,
  userName: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const feedbackRef = doc(db, "feedback", id);
    
    await updateDoc(feedbackRef, {
      response,
      respondedBy: userName,
      respondedAt: serverTimestamp(),
      status: "reviewed",
      updatedAt: serverTimestamp(),
    });

    // Log the activity
    await logUserAction(
      userId,
      `Responded to feedback ID: ${id}`,
      "Feedback Management",
      "update"
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error responding to feedback:", error);
    return { 
      success: false, 
      message: error.message || "Failed to respond to feedback" 
    };
  }
}
