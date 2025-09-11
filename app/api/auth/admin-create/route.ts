import { NextRequest, NextResponse } from "next/server";
import { adminCreateUser } from "@/app/actions/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, officeId, phone, address, bio, department, position, workStart, workEnd } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const result = await adminCreateUser({
      name,
      email,
      password,
      role,
      officeId: officeId ?? null,
      phone: phone ?? null,
      address: address ?? null,
      bio: bio ?? null,
      department: department ?? null,
      position: position ?? null,
      workStart: workStart ?? null,
      workEnd: workEnd ?? null,
    } as any);

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("API admin-create error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


