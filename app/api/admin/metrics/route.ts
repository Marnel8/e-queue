import { NextResponse } from "next/server";
import { getAdminMetrics, getReportsData } from "@/app/actions/admin";

export async function GET() {
  try {
    const result = await getAdminMetrics();
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { range } = (body ?? {}) as { range?: "24h" | "7d" | "30d" | "90d" };
    const result = await getReportsData(range ?? "7d");
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


