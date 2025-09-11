import { NextRequest, NextResponse } from "next/server";
import { addOfficeService, getOfficeServices } from "@/app/actions/offices";

// GET - Get services for an office
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getOfficeServices(params.id);
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API get office services error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add service to office
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, isActive } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Service name is required" },
        { status: 400 }
      );
    }

    const result = await addOfficeService(params.id, {
      name,
      description: description || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API add office service error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
