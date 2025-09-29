import { NextRequest, NextResponse } from "next/server";
import { getFeedback, createFeedback, getFeedbackStats } from "@/app/actions/feedback";

// GET - Get all feedback with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sentiment = searchParams.get("sentiment");
    const service = searchParams.get("service");
    const rating = searchParams.get("rating");
    const officeId = searchParams.get("officeId");
    const staffMember = searchParams.get("staffMember");
    const limitParam = searchParams.get("limit");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const stats = searchParams.get("stats");

    // If stats parameter is present, return statistics
    if (stats === "true") {
      const result = await getFeedbackStats(officeId || undefined);
      
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
      ...(sentiment && { sentiment }),
      ...(service && { service }),
      ...(rating && { rating: parseInt(rating) }),
      ...(officeId && { officeId }),
      ...(staffMember && { staffMember }),
      ...(limitParam && { limit: parseInt(limitParam) }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    };

    const result = await getFeedback(filters);

    if (result.success) {
      return NextResponse.json({
        success: true,
        feedback: result.feedback
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in feedback GET:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      service, 
      rating, 
      comment, 
      officeId, 
      staffMember, 
      ticketId,
      userId 
    } = body;

    // Validate required fields
    if (!customerName || !service || !rating || !comment || !officeId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const result = await createFeedback({
      customerName,
      customerEmail,
      service,
      rating,
      comment,
      officeId,
      staffMember,
      ticketId,
    }, userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        feedbackId: result.feedbackId,
        message: "Feedback created successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in feedback POST:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
