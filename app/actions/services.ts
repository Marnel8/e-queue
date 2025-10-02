"use server";

import { db } from "@/firebase/firebase";
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	serverTimestamp,
	Timestamp,
	updateDoc,
	doc,
	deleteDoc,
} from "firebase/firestore";

export type ServiceCreateInput = {
	name: string;
	description?: string;
	requirements?: string[];
	estimatedTime?: string;
	fee?: string;
	status: "Active" | "Inactive";
	office: string; // office name for filtering similar to evaluations
};

export type ServiceRecord = ServiceCreateInput & {
	id: string;
	dailyRequests?: number;
	avgWaitTime?: string;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export async function createService(input: ServiceCreateInput): Promise<{ success: boolean; message: string; id?: string }>{
	try {
		const ref = collection(db, "services");
		const docRef = await addDoc(ref, {
			...input,
			dailyRequests: 0,
			avgWaitTime: "N/A",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});
		return { success: true, message: "Service created", id: docRef.id };
	} catch (e) {
		return { success: false, message: "Failed to create service" };
	}
}

export async function listServices(office?: string): Promise<{ success: boolean; services?: ServiceRecord[]; message?: string }>{
	try {
		const ref = collection(db, "services");
		const q = office ? query(ref, where("office", "==", office)) : ref;
		const snap = await getDocs(q);
		const services: ServiceRecord[] = [];
		snap.forEach((docSnap) => {
			const data = docSnap.data() as any;
			services.push({
				id: docSnap.id,
				name: data.name ?? "",
				description: data.description ?? "",
				requirements: Array.isArray(data.requirements) ? data.requirements : [],
				estimatedTime: data.estimatedTime ?? "",
				fee: data.fee ?? "",
				status: data.status ?? "Inactive",
				office: data.office ?? "",
				dailyRequests: typeof data.dailyRequests === "number" ? data.dailyRequests : 0,
				avgWaitTime: data.avgWaitTime ?? "N/A",
				createdAt:
					data.createdAt instanceof Timestamp
						? data.createdAt.toDate().toISOString()
						: data.createdAt ?? null,
				updatedAt:
					data.updatedAt instanceof Timestamp
						? data.updatedAt.toDate().toISOString()
						: data.updatedAt ?? null,
			});
		});
		return { success: true, services };
	} catch (e) {
		return { success: false, message: "Failed to load services" };
	}
}

export async function updateService(
	serviceId: string,
	updates: Partial<Omit<ServiceCreateInput, "office"> & { dailyRequests?: number; avgWaitTime?: string }>
): Promise<{ success: boolean; message: string }>{
	try {
		const ref = doc(db, "services", serviceId);
		await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
		return { success: true, message: "Service updated" };
	} catch (e) {
		return { success: false, message: "Failed to update service" };
	}
}

export async function deleteService(serviceId: string): Promise<{ success: boolean; message: string }>{
	try {
		const ref = doc(db, "services", serviceId);
		await deleteDoc(ref);
		return { success: true, message: "Service deleted" };
	} catch (e) {
		return { success: false, message: "Failed to delete service" };
	}
}


