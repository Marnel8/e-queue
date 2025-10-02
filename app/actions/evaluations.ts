"use server";

import { db } from "@/firebase/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where, Timestamp } from "firebase/firestore";

export type EvaluationQuestion = {
  id: string;
  question: string;
  type: "rating" | "text" | "yes_no" | "radio" | "checkbox";
  required: boolean;
  choices?: string[];
};

export type EvaluationFormCreateInput = {
  title: string;
  description: string;
  office: string;
  services: string[];
  questions: EvaluationQuestion[];
  status: "active" | "draft" | "archived";
};

export async function createEvaluationForm(input: EvaluationFormCreateInput): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const formsRef = collection(db, "evaluation_forms");
    const docRef = await addDoc(formsRef, {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Evaluation form saved", id: docRef.id };
  } catch (e) {
    return { success: false, message: "Failed to save evaluation form" };
  }
}

export type EvaluationFormRecord = EvaluationFormCreateInput & {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export async function listEvaluationForms(office?: string): Promise<{ success: boolean; message?: string; forms?: EvaluationFormRecord[] }> {
  try {
    const formsRef = collection(db, "evaluation_forms");
    const q = office ? query(formsRef, where("office", "==", office)) : undefined as any;
    const snap = await getDocs(q ?? formsRef);
    const forms: EvaluationFormRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      forms.push({
        id: docSnap.id,
        title: data.title,
        description: data.description,
        office: data.office,
        services: data.services,
        questions: data.questions,
        status: data.status,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt ?? null,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt ?? null,
      });
    });
    return { success: true, forms };
  } catch (e) {
    return { success: false, message: "Failed to load evaluation forms" };
  }
}


