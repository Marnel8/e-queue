import { NextRequest, NextResponse } from "next/server";
import { updateViolationStatus, deleteViolation } from "@/app/actions/violations";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, resolvedBy, resolvedByName, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Violation ID is required" },
        { status: 400 }
      );
    }

    const result = await updateViolationStatus(
      id,
      status,
      resolvedBy,
      resolvedByName,
      notes
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
    console.error("Error in violation PUT:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Violation ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteViolation(id);

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
    console.error("Error in violation DELETE:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
