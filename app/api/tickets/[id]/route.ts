import { NextRequest, NextResponse } from "next/server";
import { updateTicketStatus } from "@/app/actions/tickets";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      status, 
      staffMember, 
      processingStartTime, 
      processingEndTime, 
      processingTimeMinutes, 
      completionReason 
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    const result = await updateTicketStatus(
      id,
      status,
      staffMember,
      processingStartTime,
      processingEndTime,
      processingTimeMinutes,
      completionReason
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in ticket PATCH:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
