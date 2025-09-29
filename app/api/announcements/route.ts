import { NextRequest, NextResponse } from "next/server";
import { getAnnouncements, createAnnouncement, getAnnouncementStats } from "@/app/actions/announcements";

// GET - Get all announcements with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const priority = searchParams.get("priority");
    const officeId = searchParams.get("officeId");
    const limitParam = searchParams.get("limit");
    const stats = searchParams.get("stats");

    // If stats parameter is present, return statistics
    if (stats === "true") {
      const result = await getAnnouncementStats(officeId || undefined);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          stats: result.stats
        });
      } else {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 500 }
        );
      }
    }

    const filters = {
      ...(status && { status }),
      ...(type && { type }),
      ...(priority && { priority }),
      ...(officeId && { officeId }),
      ...(limitParam && { limit: parseInt(limitParam) }),
    };

    const result = await getAnnouncements(filters);

    if (result.success) {
      return NextResponse.json({
        success: true,
        announcements: result.announcements
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in announcements GET:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      content, 
      type, 
      priority, 
      status, 
      publishDate, 
      expiryDate, 
      createdBy, 
      createdByUid, 
      officeId 
    } = body;

    // Validate required fields
    if (!title || !content || !type || !priority || !status || !publishDate || !expiryDate || !createdBy || !createdByUid || !officeId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const announcementData = {
      title,
      content,
      type,
      priority,
      status,
      publishDate,
      expiryDate,
      createdBy,
      createdByUid,
      officeId,
    };

    const result = await createAnnouncement(announcementData, createdByUid);

    if (result.success) {
      return NextResponse.json({
        success: true,
        announcementId: result.announcementId,
        message: "Announcement created successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in announcements POST:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
