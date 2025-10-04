import { NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase/firebase"
import { doc, updateDoc, deleteDoc, getDoc, Timestamp } from "firebase/firestore"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { isRead, isArchived } = body

    const updateData: any = {
      updatedAt: Timestamp.now()
    }

    if (typeof isRead === "boolean") {
      updateData.isRead = isRead
    }

    if (typeof isArchived === "boolean") {
      updateData.isArchived = isArchived
    }

    await updateDoc(doc(db, "notifications", id), updateData)

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await deleteDoc(doc(db, "notifications", id))

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const notificationDoc = await getDoc(doc(db, "notifications", id))

    if (!notificationDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      )
    }

    const notification = {
      id: notificationDoc.id,
      ...notificationDoc.data(),
      createdAt: notificationDoc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: notificationDoc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      notification
    })

  } catch (error) {
    console.error("Error fetching notification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch notification" },
      { status: 500 }
    )
  }
}
