import { NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase/firebase"
import { collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, doc, Timestamp } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitCount = parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    let notificationsQuery = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )

    if (unreadOnly) {
      notificationsQuery = query(
        collection(db, "notifications"),
        where("isRead", "==", false),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      )
    }

    const notificationsSnapshot = await getDocs(notificationsQuery)
    const notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }))

    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length
    })

  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, userId, officeId, priority = "medium" } = body

    if (!title || !message || !type) {
      return NextResponse.json(
        { success: false, error: "Title, message, and type are required" },
        { status: 400 }
      )
    }

    const notificationData = {
      title,
      message,
      type,
      priority,
      userId: userId || null,
      officeId: officeId || null,
      isRead: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(collection(db, "notifications"), notificationData)

    return NextResponse.json({
      success: true,
      notification: {
        id: docRef.id,
        ...notificationData,
        createdAt: notificationData.createdAt.toDate().toISOString(),
        updatedAt: notificationData.updatedAt.toDate().toISOString()
      }
    })

  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, isRead } = body

    if (!notificationId || typeof isRead !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Notification ID and isRead status are required" },
        { status: 400 }
      )
    }

    await updateDoc(doc(db, "notifications", notificationId), {
      isRead,
      updatedAt: Timestamp.now()
    })

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully"
    })

  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
      { status: 500 }
    )
  }
}
