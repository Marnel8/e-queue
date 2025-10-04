"use server";

import { db } from "@/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface ActivityLogData {
  userId: string;
  action: string;
  service: string;
  type: "create" | "update" | "delete" | "publish" | "report" | "login" | "logout";
  details?: string;
  resourceType?: "user" | "office" | "service" | "staff" | "announcement" | "feedback" | "violation" | "queue" | "ticket";
  resourceId?: string;
}

export async function logActivity(data: ActivityLogData): Promise<{ success: boolean; message: string }> {
  try {
    const activityRef = collection(db, "activity_logs");
    
    await addDoc(activityRef, {
      ...data,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Activity logged successfully"
    };
  } catch (error: any) {
    console.error("Error logging activity:", error);
    return {
      success: false,
      message: "Failed to log activity"
    };
  }
}

export async function logUserAction(
  userId: string, 
  action: string, 
  service: string, 
  type: ActivityLogData["type"] = "update",
  details?: string,
  resourceType?: ActivityLogData["resourceType"],
  resourceId?: string
) {
  return logActivity({
    userId,
    action,
    service,
    type,
    details,
    resourceType,
    resourceId
  });
}
