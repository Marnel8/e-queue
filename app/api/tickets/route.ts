import { NextRequest, NextResponse } from "next/server";
import { createTicket, getTicketsByOffice, updateTicketStatus } from "@/app/actions/tickets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      ticketNumber, 
      customerName, 
      customerEmail, 
      customerPhone, 
      office, 
      service, 
      priority, 
      deskId, 
      deskName, 
      customerType, 
      appointmentDate, 
      walkInTime, 
      priorityLaneImage 
    } = body;

    if (!ticketNumber || !customerName || !customerEmail || !office || !service) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const result = await createTicket({
      ticketNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      office,
      service,
      priority: priority || "regular",
      status: "waiting",
      deskId: deskId || 1,
      deskName: deskName || "Desk 1",
      customerType: customerType || "walk-in",
      appointmentDate,
      walkInTime,
      priorityLaneImage,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        ticketId: result.ticketId,
        message: result.message
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in tickets POST:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const office = searchParams.get('office');
    const status = searchParams.get('status');

    if (!office) {
      return NextResponse.json(
        { success: false, message: "Office parameter is required" },
        { status: 400 }
      );
    }

    const result = await getTicketsByOffice(office, status || undefined);

    if (result.success) {
      return NextResponse.json({
        success: true,
        tickets: result.tickets
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in tickets GET:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
