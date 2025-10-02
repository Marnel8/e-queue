import { NextRequest } from "next/server";
import { listLogbookEntries } from "@/app/actions/logbook";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const office = searchParams.get("office") || undefined;
	const officeId = searchParams.get("officeId") || undefined;
	const department = searchParams.get("department") || undefined;
	const date = searchParams.get("date") || undefined;
	const res = await listLogbookEntries({ office, officeId, department, date });
	return Response.json(res, { status: res.success ? 200 : 500 });
}


