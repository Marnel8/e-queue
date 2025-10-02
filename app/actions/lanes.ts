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

export type LaneType = "all" | "priority" | "regular";

export type LaneCreateInput = {
  name: string;
  description?: string;
  type: LaneType; // all = default for all; priority = only priority customers; regular = filtered by course/year
  allowedCourses?: string[]; // applies when type === "regular"
  allowedYearLevels?: string[]; // applies when type === "regular"
  services?: string[]; // display purposes
  status: "active" | "maintenance";
  order: number;
  office: string; // office name for scoping
};

export type LaneRecord = LaneCreateInput & {
  id: string;
  currentQueue?: number;
  avgWaitTime?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function createLane(
  input: LaneCreateInput
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const ref = collection(db, "lanes");
    const docRef = await addDoc(ref, {
      ...input,
      allowedCourses: Array.isArray(input.allowedCourses)
        ? input.allowedCourses
        : [],
      allowedYearLevels: Array.isArray(input.allowedYearLevels)
        ? input.allowedYearLevels
        : [],
      services: Array.isArray(input.services) ? input.services : [],
      currentQueue: 0,
      avgWaitTime: "N/A",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Lane created", id: docRef.id };
  } catch (e) {
    return { success: false, message: "Failed to create lane" };
  }
}

export async function listLanes(
  office?: string
): Promise<{ success: boolean; lanes?: LaneRecord[]; message?: string }> {
  try {
    const ref = collection(db, "lanes");
    const q = office ? query(ref, where("office", "==", office)) : ref;
    const snap = await getDocs(q);
    const lanes: LaneRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      lanes.push({
        id: docSnap.id,
        name: data.name ?? "",
        description: data.description ?? "",
        type: (data.type as LaneType) ?? "all",
        allowedCourses: Array.isArray(data.allowedCourses)
          ? data.allowedCourses
          : [],
        allowedYearLevels: Array.isArray(data.allowedYearLevels)
          ? data.allowedYearLevels
          : [],
        services: Array.isArray(data.services) ? data.services : [],
        status: (data.status as "active" | "maintenance") ?? "active",
        order: typeof data.order === "number" ? data.order : 0,
        office: data.office ?? "",
        currentQueue: typeof data.currentQueue === "number" ? data.currentQueue : 0,
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
    // Sort by order ascending on the server response to avoid Firestore index requirements
    lanes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return { success: true, lanes };
  } catch (e) {
    return { success: false, message: "Failed to load lanes" };
  }
}

export async function updateLane(
  laneId: string,
  updates: Partial<
    Omit<LaneCreateInput, "office"> & { currentQueue?: number; avgWaitTime?: string }
  >
): Promise<{ success: boolean; message: string }> {
  try {
    const ref = doc(db, "lanes", laneId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
    return { success: true, message: "Lane updated" };
  } catch (e) {
    return { success: false, message: "Failed to update lane" };
  }
}

export async function deleteLane(
  laneId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const ref = doc(db, "lanes", laneId);
    await deleteDoc(ref);
    return { success: true, message: "Lane deleted" };
  } catch (e) {
    return { success: false, message: "Failed to delete lane" };
  }
}


