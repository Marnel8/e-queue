import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, updateUserData, deactivateUser, hardDeleteUser } from "@/app/actions/auth";

export async function GET() {
  try {
    const result = await getAllUsers();
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("API get users error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, updates } = body as { uid?: string; updates?: Record<string, unknown> };
    if (!uid || !updates) {
      return NextResponse.json({ success: false, message: "Missing uid or updates" }, { status: 400 });
    }
    const result = await updateUserData(uid, updates as any);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("API update user error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("id");
    const mode = searchParams.get("mode") || "deactivate";
    if (!uid) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }
    const result = mode === "hard" ? await hardDeleteUser(uid) : await deactivateUser(uid);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("API delete(deactivate) user error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


