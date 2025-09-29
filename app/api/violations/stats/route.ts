import { NextRequest, NextResponse } from "next/server";
import { getViolationStats } from "@/app/actions/violations";

export async function GET(request: NextRequest) {
  try {
    const result = await getViolationStats();

    if (result.success) {
      return NextResponse.json({
        success: true,
        stats: result.stats
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in violations stats GET:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
