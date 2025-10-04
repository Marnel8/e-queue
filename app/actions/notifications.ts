import { db } from "@/firebase/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

export interface CreateNotificationData {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  userId?: string
  officeId?: string
}

export async function createNotification(data: CreateNotificationData) {
  try {
    const notificationData = {
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority || 'medium',
      userId: data.userId || null,
      officeId: data.officeId || null,
      isRead: false,
      isArchived: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, "notifications"), notificationData)
    
    return {
      success: true,
      notificationId: docRef.id,
      notification: {
        id: docRef.id,
        ...notificationData,
        createdAt: notificationData.createdAt.toDate().toISOString(),
        updatedAt: notificationData.updatedAt.toDate().toISOString()
      }
    }
  } catch (error) {
    console.error("Error creating notification:", error)
    return {
      success: false,
      error: "Failed to create notification"
    }
  }
}

// Helper functions for common notification types
export async function createUserNotification(
  title: string, 
  message: string, 
  userId: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
) {
  return createNotification({
    title,
    message,
    type,
    priority,
    userId
  })
}

export async function createSystemNotification(
  title: string, 
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
) {
  return createNotification({
    title,
    message,
    type,
    priority
  })
}

export async function createOfficeNotification(
  title: string, 
  message: string, 
  officeId: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
) {
  return createNotification({
    title,
    message,
    type,
    priority,
    officeId
  })
}
