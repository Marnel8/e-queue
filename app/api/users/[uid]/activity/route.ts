import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Query activity logs for the user
    const activityRef = collection(db, "activity_logs");
    const q = query(
      activityRef,
      where("userId", "==", uid),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const activities = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString()
        };
      })
      .sort((a, b) => {
        // Sort by timestamp in descending order (newest first)
        const timestampA = new Date((a as any).timestamp || (a as any).createdAt || 0);
        const timestampB = new Date((b as any).timestamp || (b as any).createdAt || 0);
        return timestampB.getTime() - timestampA.getTime();
      });

    return NextResponse.json({
      success: true,
      activities: activities
    });

  } catch (error: any) {
    console.error("Error fetching activity log:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch activity log" },
      { status: 500 }
    );
  }
}
