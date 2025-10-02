"use server";

import { db } from "@/firebase/firebase";
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	Timestamp,
} from "firebase/firestore";

export type LogbookEntry = {
	id: string;
	customer: string;
	office: string;
	department: string;
	service: string;
	date: string; // ISO date string (yyyy-mm-dd)
	time: string; // e.g., 10:35 AM
	evaluated: boolean;
};

export async function listLogbookEntries(params: {
	office?: string;
	officeId?: string;
	department?: string;
	date?: string; // yyyy-mm-dd
}): Promise<{ success: boolean; message?: string; entries?: LogbookEntry[] }> {
	try {
		const ref = collection(db, "transaction_logbook");
		const filters: any[] = [];
		if (params.office) filters.push(where("office", "==", params.office));
		if (params.officeId) filters.push(where("officeId", "==", params.officeId));
		if (params.department) filters.push(where("department", "==", params.department));
		if (params.date) filters.push(where("date", "==", params.date));
		const q = filters.length > 0 ? query(ref, ...filters, orderBy("time", "asc")) : query(ref, orderBy("date", "desc"));
		const snap = await getDocs(q);
		const entries: LogbookEntry[] = [];
		snap.forEach((docSnap) => {
			const data = docSnap.data() as any;
			entries.push({
				id: data.id ?? docSnap.id,
				customer: data.customer ?? "",
				office: data.office ?? "",
				department: data.department ?? "",
				service: data.service ?? "",
				date:
					typeof data.date === "string"
						? data.date
						: data.date instanceof Timestamp
						? data.date.toDate().toISOString().slice(0, 10)
						: "",
				time: data.time ?? "",
				evaluated: Boolean(data.evaluated),
			});
		});
		return { success: true, entries };
	} catch (e) {
		return { success: false, message: "Failed to load logbook entries" };
	}
}


