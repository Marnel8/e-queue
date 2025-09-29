import { NextRequest, NextResponse } from "next/server";
import { getViolations, createViolation } from "@/app/actions/violations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const severity = searchParams.get("severity");
    const userId = searchParams.get("userId");
    const limitParam = searchParams.get("limit");

    const filters = {
      ...(status && { status }),
      ...(type && { type }),
      ...(severity && { severity }),
      ...(userId && { userId }),
      ...(limitParam && { limit: parseInt(limitParam) }),
    };

    const result = await getViolations(filters);

    if (result.success) {
      return NextResponse.json({
        success: true,
        violations: result.violations
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in violations GET:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createViolation(body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        violationId: result.violationId
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in violations POST:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
