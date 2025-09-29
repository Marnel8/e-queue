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

export interface AnnouncementData {
  id?: string;
  title: string;
  content: string;
  type: "maintenance" | "service" | "schedule" | "update";
  priority: "high" | "medium" | "low";
  status: "published" | "draft" | "scheduled";
  publishDate: string;
  expiryDate: string;
  views: number;
  createdBy: string;
  createdByUid: string;
  officeId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AnnouncementFilters {
  status?: string;
  type?: string;
  priority?: string;
  officeId?: string;
  limit?: number;
}

// Get all announcements with optional filters
export async function getAnnouncements(filters: AnnouncementFilters = {}): Promise<{ 
  success: boolean; 
  announcements?: AnnouncementData[]; 
  message?: string 
}> {
  try {
    const announcementsRef = collection(db, "announcements");
    let q = query(announcementsRef);

    // Apply filters
    if (filters.officeId) {
      q = query(q, where("officeId", "==", filters.officeId));
    }
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters.type) {
      q = query(q, where("type", "==", filters.type));
    }
    if (filters.priority) {
      q = query(q, where("priority", "==", filters.priority));
    }
    
    // Only add orderBy if we don't have officeId filter to avoid composite index requirement
    if (!filters.officeId) {
      q = query(q, orderBy("createdAt", "desc"));
    }
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    const announcements: AnnouncementData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        type: data.type,
        priority: data.priority,
        status: data.status,
        publishDate: data.publishDate,
        expiryDate: data.expiryDate,
        views: data.views || 0,
        createdBy: data.createdBy,
        createdByUid: data.createdByUid,
        officeId: data.officeId,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    // Sort by createdAt in descending order if we couldn't do it in the query
    if (filters.officeId) {
      announcements.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return { success: true, announcements };
  } catch (error: any) {
    console.error("Error getting announcements:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch announcements" 
    };
  }
}

// Get announcement by ID
export async function getAnnouncementById(id: string): Promise<{ 
  success: boolean; 
  announcement?: AnnouncementData; 
  message?: string 
}> {
  try {
    const announcementRef = doc(db, "announcements", id);
    const announcementSnap = await getDoc(announcementRef);

    if (!announcementSnap.exists()) {
      return { success: false, message: "Announcement not found" };
    }

    const data = announcementSnap.data();
    const announcement: AnnouncementData = {
      id: announcementSnap.id,
      title: data.title,
      content: data.content,
      type: data.type,
      priority: data.priority,
      status: data.status,
      publishDate: data.publishDate,
      expiryDate: data.expiryDate,
      views: data.views || 0,
      createdBy: data.createdBy,
      createdByUid: data.createdByUid,
      officeId: data.officeId,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };

    return { success: true, announcement };
  } catch (error: any) {
    console.error("Error getting announcement:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch announcement" 
    };
  }
}

// Create new announcement
export async function createAnnouncement(
  data: Omit<AnnouncementData, "id" | "createdAt" | "updatedAt" | "views">,
  userId: string
): Promise<{ success: boolean; announcementId?: string; message?: string }> {
  try {
    const announcementData = {
      ...data,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "announcements"), announcementData);

    // Log the activity
    await logUserAction(
      userId,
      `Created announcement: ${data.title}`,
      "Announcement Management",
      "create"
    );

    return { success: true, announcementId: docRef.id };
  } catch (error: any) {
    console.error("Error creating announcement:", error);
    return { 
      success: false, 
      message: error.message || "Failed to create announcement" 
    };
  }
}

// Update announcement
export async function updateAnnouncement(
  id: string,
  data: Partial<Omit<AnnouncementData, "id" | "createdAt" | "createdBy" | "createdByUid" | "officeId">>,
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const announcementRef = doc(db, "announcements", id);
    
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(announcementRef, updateData);

    // Log the activity
    await logUserAction(
      userId,
      `Updated announcement: ${data.title || 'ID: ' + id}`,
      "Announcement Management",
      "update"
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error updating announcement:", error);
    return { 
      success: false, 
      message: error.message || "Failed to update announcement" 
    };
  }
}

// Delete announcement
export async function deleteAnnouncement(
  id: string,
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const announcementRef = doc(db, "announcements", id);
    await deleteDoc(announcementRef);

    // Log the activity
    await logUserAction(
      userId,
      `Deleted announcement ID: ${id}`,
      "Announcement Management",
      "delete"
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting announcement:", error);
    return { 
      success: false, 
      message: error.message || "Failed to delete announcement" 
    };
  }
}

// Increment views for an announcement
export async function incrementAnnouncementViews(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const announcementRef = doc(db, "announcements", id);
    await updateDoc(announcementRef, {
      views: increment(1),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error incrementing announcement views:", error);
    return { 
      success: false, 
      message: error.message || "Failed to update views" 
    };
  }
}

// Get announcement statistics
export async function getAnnouncementStats(officeId?: string): Promise<{ 
  success: boolean; 
  stats?: {
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    totalViews: number;
    thisMonth: number;
  }; 
  message?: string 
}> {
  try {
    const announcementsRef = collection(db, "announcements");
    let q = query(announcementsRef);

    if (officeId) {
      q = query(q, where("officeId", "==", officeId));
    }

    const querySnapshot = await getDocs(q);
    const announcements: AnnouncementData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        type: data.type,
        priority: data.priority,
        status: data.status,
        publishDate: data.publishDate,
        expiryDate: data.expiryDate,
        views: data.views || 0,
        createdBy: data.createdBy,
        createdByUid: data.createdByUid,
        officeId: data.officeId,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: announcements.length,
      published: announcements.filter(a => a.status === "published").length,
      draft: announcements.filter(a => a.status === "draft").length,
      scheduled: announcements.filter(a => a.status === "scheduled").length,
      totalViews: announcements.reduce((sum, a) => sum + a.views, 0),
      thisMonth: announcements.filter(a => {
        if (!a.createdAt) return false;
        const createdDate = new Date(a.createdAt);
        return createdDate >= thisMonth;
      }).length,
    };

    return { success: true, stats };
  } catch (error: any) {
    console.error("Error getting announcement stats:", error);
    return { 
      success: false, 
      message: error.message || "Failed to fetch announcement statistics" 
    };
  }
}
