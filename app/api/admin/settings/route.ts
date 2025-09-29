import { NextRequest, NextResponse } from "next/server";
import { getSystemSettings, updateSystemSettings, resetSystemSettings } from "@/app/actions/settings";

export async function GET() {
  try {
    const result = await getSystemSettings();
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await updateSystemSettings(body ?? {});
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json().catch(() => ({}));
    if (action === "reset") {
      const result = await resetSystemSettings();
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }
    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


