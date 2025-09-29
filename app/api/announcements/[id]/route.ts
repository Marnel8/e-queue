import { NextRequest, NextResponse } from "next/server";
import { getAnnouncementById, updateAnnouncement, deleteAnnouncement, incrementAnnouncementViews } from "@/app/actions/announcements";

// GET - Get announcement by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const incrementViews = searchParams.get("incrementViews") === "true";

    const result = await getAnnouncementById(params.id);

    if (result.success) {
      // Increment views if requested
      if (incrementViews) {
        await incrementAnnouncementViews(params.id);
      }

      return NextResponse.json({
        success: true,
        announcement: result.announcement
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error in announcement GET:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update announcement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      userId 
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (type !== undefined) updateData.type = type;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (publishDate !== undefined) updateData.publishDate = publishDate;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;

    const result = await updateAnnouncement(params.id, updateData, userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Announcement updated successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in announcement PUT:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteAnnouncement(params.id, userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Announcement deleted successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in announcement DELETE:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
