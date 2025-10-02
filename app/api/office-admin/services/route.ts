import { NextResponse } from "next/server";
import { createService, listServices } from "@/app/actions/services";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const result = await createService(body);
		return NextResponse.json(result, { status: result.success ? 200 : 400 });
	} catch (e) {
		return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const office = searchParams.get("office") || undefined;
		const result = await listServices(office);
		return NextResponse.json(result, { status: result.success ? 200 : 400 });
	} catch (e) {
		return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
	}
}


