import { NextRequest, NextResponse } from "next/server";
import { getFeedbackById, updateFeedback, deleteFeedback, respondToFeedback } from "@/app/actions/feedback";

// GET - Get feedback by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getFeedbackById(params.id);

    if (result.success) {
      return NextResponse.json({
        success: true,
        feedback: result.feedback
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error in feedback GET by ID:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update feedback
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      status, 
      response, 
      userId, 
      userName 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // If response is provided, use respondToFeedback function
    if (response && userName) {
      const result = await respondToFeedback(params.id, response, userId, userName);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: "Response added successfully"
        });
      } else {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 500 }
        );
      }
    }

    // Otherwise, update other fields
    const updateData: any = {};
    if (status) updateData.status = status;

    const result = await updateFeedback(params.id, updateData, userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Feedback updated successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in feedback PUT:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete feedback
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteFeedback(params.id, userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Feedback deleted successfully"
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
  }
  } catch (error: any) {
    console.error("Error in feedback DELETE:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
