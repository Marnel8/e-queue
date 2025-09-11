"use server";

import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type SystemSettings = {
  systemName: string;
  systemDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxQueueSize: number;
  voiceNotifications: boolean;
  notificationLanguage: "english" | "tagalog" | "both";
  updatedAt?: string;
};

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  systemName: "E-QUEUE - OMSC Mamburao",
  systemDescription: "Queue Management System for Occidental Mindoro State College",
  maintenanceMode: false,
  allowRegistration: true,
  maxQueueSize: 100,
  voiceNotifications: true,
  notificationLanguage: "english",
};

const SETTINGS_DOC = doc(db, "settings", "system");

export async function getSystemSettings(): Promise<{ success: boolean; data?: SystemSettings; message?: string }> {
  try {
    const snap = await getDoc(SETTINGS_DOC);
    if (!snap.exists()) {
      // Initialize with defaults
      const data: SystemSettings = { ...DEFAULT_SYSTEM_SETTINGS, updatedAt: new Date().toISOString() };
      await setDoc(SETTINGS_DOC, data, { merge: true });
      return { success: true, data };
    }
    const data = snap.data() as SystemSettings;
    return { success: true, data };
  } catch (e) {
    console.error("getSystemSettings error", e);
    return { success: false, message: "Failed to load settings" };
  }
}

export async function updateSystemSettings(input: Partial<SystemSettings>): Promise<{ success: boolean; message: string; data?: SystemSettings }> {
  try {
    const current = await getSystemSettings();
    const merged: SystemSettings = {
      ...(current.data ?? DEFAULT_SYSTEM_SETTINGS),
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(SETTINGS_DOC, merged, { merge: true });
    return { success: true, message: "Settings saved", data: merged };
  } catch (e) {
    console.error("updateSystemSettings error", e);
    return { success: false, message: "Failed to save settings" };
  }
}

export async function resetSystemSettings(): Promise<{ success: boolean; message: string; data?: SystemSettings }> {
  try {
    const data: SystemSettings = { ...DEFAULT_SYSTEM_SETTINGS, updatedAt: new Date().toISOString() };
    await setDoc(SETTINGS_DOC, data, { merge: true });
    return { success: true, message: "Settings reset to defaults", data };
  } catch (e) {
    console.error("resetSystemSettings error", e);
    return { success: false, message: "Failed to reset settings" };
  }
}


