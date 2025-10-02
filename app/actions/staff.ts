"use server";

import { db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export type StaffStatus = "Online" | "Break" | "Offline";

export type StaffCreateInput = {
  name: string;
  email: string;
  position: string;
  status: StaffStatus;
  shift?: string;
  assignedLane?: string | null;
  assignedDesk?: string | null;
  deskId?: number | null;
  queuesHandled?: number;
  avgServiceTime?: string;
  lastActive?: string;
  office: string;
};

export type StaffRecord = StaffCreateInput & {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function createStaff(
  input: StaffCreateInput
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const ref = collection(db, "staff");
    const docRef = await addDoc(ref, {
      ...input,
      assignedLane: input.assignedLane ?? null,
      queuesHandled:
        typeof input.queuesHandled === "number" ? input.queuesHandled : 0,
      avgServiceTime: input.avgServiceTime ?? "N/A",
      lastActive: input.lastActive ?? "Active now",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Staff created", id: docRef.id };
  } catch (_e) {
    return { success: false, message: "Failed to create staff" };
  }
}

export async function listStaff(
  office?: string
): Promise<{ success: boolean; staff?: StaffRecord[]; message?: string }> {
  try {
    const ref = collection(db, "staff");
    const q = office ? query(ref, where("office", "==", office)) : ref;
    const snap = await getDocs(q);
    const staff: StaffRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      staff.push({
        id: docSnap.id,
        name: data.name ?? "",
        email: data.email ?? "",
        position: data.position ?? "",
        status: (data.status as StaffStatus) ?? "Offline",
        shift: data.shift ?? "",
        assignedLane: data.assignedLane ?? null,
        assignedDesk: data.assignedDesk ?? null,
        deskId:
          typeof data.deskId === "number" || data.deskId === null
            ? data.deskId
            : null,
        queuesHandled:
          typeof data.queuesHandled === "number" ? data.queuesHandled : 0,
        avgServiceTime: data.avgServiceTime ?? "N/A",
        lastActive: data.lastActive ?? "",
        office: data.office ?? "",
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
    return { success: true, staff };
  } catch (_e) {
    return { success: false, message: "Failed to load staff" };
  }
}

export async function updateStaff(
  staffId: string,
  updates: Partial<Omit<StaffCreateInput, "office"> & { lastActive?: string }>
): Promise<{ success: boolean; message: string }> {
  try {
    const ref = doc(db, "staff", staffId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
    return { success: true, message: "Staff updated" };
  } catch (_e) {
    return { success: false, message: "Failed to update staff" };
  }
}

export async function deleteStaff(
  staffId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const ref = doc(db, "staff", staffId);
    await deleteDoc(ref);
    return { success: true, message: "Staff deleted" };
  } catch (_e) {
    return { success: false, message: "Failed to delete staff" };
  }
}


