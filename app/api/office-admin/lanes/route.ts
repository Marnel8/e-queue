import { NextResponse } from "next/server";
import { createLane, listLanes } from "@/app/actions/lanes";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createLane(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const office = searchParams.get("office") || undefined;
    const result = await listLanes(office);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}


