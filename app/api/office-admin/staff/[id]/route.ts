import { NextResponse } from "next/server";
import { deleteStaff, updateStaff } from "@/app/actions/staff";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const result = await updateStaff(id, body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (_e) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await deleteStaff(id);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (_e) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}


