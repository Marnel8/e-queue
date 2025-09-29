import { NextRequest, NextResponse } from "next/server";
import { addOffice, getAllOffices, updateOffice, deleteOffice } from "@/app/actions/offices";

// GET - Get all offices
export async function GET() {
  try {
    const result = await getAllOffices();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add new office
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, location, focalPerson, focalPersonEmail, focalPersonPhone, status } = body;

    // Validate required fields
    if (!name || !type || !location || !focalPerson || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name, type, location, focalPerson, status" },
        { status: 400 }
      );
    }

    const result = await addOffice({
      name,
      type,
      location,
      focalPerson,
      focalPersonEmail,
      focalPersonPhone,
      status,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update office
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, type, location, focalPerson, focalPersonEmail, focalPersonPhone, status } = body;

    // Validate required fields
    if (!id || !name || !type || !location || !focalPerson || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: id, name, type, location, focalPerson, status" },
        { status: 400 }
      );
    }

    const result = await updateOffice(id, {
      name,
      type,
      location,
      focalPerson,
      focalPersonEmail,
      focalPersonPhone,
      status,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete office
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Office ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteOffice(id);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
