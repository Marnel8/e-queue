"use server";

import { db } from "@/firebase/firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { logUserAction } from "./activity-log";

export interface OfficeData {
  id?: string;
  name: string;
  type: string;
  location: string;
  focalPerson: string;
  focalPersonEmail?: string;
  focalPersonPhone?: string;
  status: "Active" | "Inactive" | "Maintenance";
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OfficeService {
  id?: string;
  officeId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OfficeResult {
  success: boolean;
  message: string;
  office?: OfficeData;
  offices?: OfficeData[];
}

// Add a new office
export async function addOffice(data: Omit<OfficeData, 'id' | 'createdAt' | 'updatedAt'>, userId?: string): Promise<OfficeResult> {
  try {
    const officesRef = collection(db, "offices");
    
    const officeData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(officesRef, officeData);
    
    // Get the created document to return with the ID
    const createdDoc = await getDoc(docRef);
    const office = {
      id: docRef.id,
      ...createdDoc.data(),
    } as OfficeData;

    // Log activity
    if (userId) {
      await logUserAction(
        userId,
        `Created office: ${data.name}`,
        "Office Management",
        "create",
        `Office: ${data.name} (${data.type}) at ${data.location}`,
        "office",
        docRef.id
      );
    }

    return {
      success: true,
      message: "Office added successfully!",
      office: office,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while adding the office.",
    };
  }
}

// Get all offices
export async function getAllOffices(): Promise<OfficeResult> {
  try {
    const officesRef = collection(db, "offices");
    const q = query(officesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const offices: OfficeData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      offices.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt ?? null,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt ?? null,
      });
    });

    return {
      success: true,
      offices: offices,
      message: "Offices retrieved successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching offices.",
    };
  }
}

// Get office by ID
export async function getOfficeById(officeId: string): Promise<OfficeResult> {
  try {
    const officeRef = doc(db, "offices", officeId);
    const officeDoc = await getDoc(officeRef);
    
    if (!officeDoc.exists()) {
      return {
        success: false,
        message: "Office not found.",
      };
    }

    const data = officeDoc.data() as any;
    const office: OfficeData = {
      id: officeDoc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt ?? null,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt ?? null,
    };

    return {
      success: true,
      office: office,
      message: "Office retrieved successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching the office.",
    };
  }
}

// Update office
export async function updateOffice(officeId: string, updates: Partial<OfficeData>, userId?: string): Promise<OfficeResult> {
  try {
    const officeRef = doc(db, "offices", officeId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(officeRef, updateData);
    
    // Get the updated document
    const updatedDoc = await getDoc(officeRef);
    const office = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as OfficeData;

    // Log activity
    if (userId) {
      const updatedFields = Object.keys(updates).join(", ");
      await logUserAction(
        userId,
        `Updated office: ${office.name || officeId}`,
        "Office Management",
        "update",
        `Updated fields: ${updatedFields}`,
        "office",
        officeId
      );
    }

    return {
      success: true,
      message: "Office updated successfully!",
      office: office,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while updating the office.",
    };
  }
}

// Delete office
export async function deleteOffice(officeId: string, userId?: string): Promise<OfficeResult> {
  try {
    // Get office data before deletion for logging
    let officeName = officeId;
    if (userId) {
      try {
        const officeRef = doc(db, "offices", officeId);
        const officeDoc = await getDoc(officeRef);
        if (officeDoc.exists()) {
          const data = officeDoc.data() as any;
          officeName = data.name || officeId;
        }
      } catch (e) {
        // Continue with deletion even if we can't get the name
      }
    }

    const officeRef = doc(db, "offices", officeId);
    await deleteDoc(officeRef);

    // Log activity
    if (userId) {
      await logUserAction(
        userId,
        `Deleted office: ${officeName}`,
        "Office Management",
        "delete",
        `Office: ${officeName} (ID: ${officeId})`,
        "office",
        officeId
      );
    }
    
    return {
      success: true,
      message: "Office deleted successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while deleting the office.",
    };
  }
}

// Get offices by status
export async function getOfficesByStatus(status: "Active" | "Inactive" | "Maintenance"): Promise<OfficeResult> {
  try {
    const officesRef = collection(db, "offices");
    const q = query(officesRef, where("status", "==", status), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const offices: OfficeData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      offices.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt ?? null,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt ?? null,
      });
    });

    return {
      success: true,
      offices: offices,
      message: `Offices with status '${status}' retrieved successfully!`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching offices by status.",
    };
  }
}

// Update office status
export async function updateOfficeStatus(officeId: string, status: "Active" | "Inactive" | "Maintenance"): Promise<OfficeResult> {
  try {
    const officeRef = doc(db, "offices", officeId);
    await updateDoc(officeRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
    
    return {
      success: true,
      message: `Office status updated to '${status}' successfully!`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while updating office status.",
    };
  }
}

// Add service to office
export async function addOfficeService(officeId: string, serviceData: Omit<OfficeService, 'id' | 'officeId' | 'createdAt' | 'updatedAt'>, userId?: string): Promise<{ success: boolean; message: string; service?: OfficeService }> {
  try {
    const servicesRef = collection(db, "office_services");
    
    const service = {
      ...serviceData,
      officeId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(servicesRef, service);
    
    // Log activity
    if (userId) {
      await logUserAction(
        userId,
        `Added service: ${serviceData.name}`,
        "Service Management",
        "create",
        `Service: ${serviceData.name} for office ${officeId}`,
        "service",
        docRef.id
      );
    }
    
    return {
      success: true,
      message: "Service added successfully!",
      service: {
        id: docRef.id,
        officeId,
        ...service,
      } as OfficeService,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while adding the service.",
    };
  }
}

// Get services for an office
export async function getOfficeServices(officeId: string): Promise<{ success: boolean; services?: OfficeService[]; message?: string }> {
  try {
    const servicesRef = collection(db, "office_services");
    const q = query(servicesRef, where("officeId", "==", officeId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const services: OfficeService[] = [];
    querySnapshot.forEach((doc) => {
      services.push({
        id: doc.id,
        ...doc.data(),
      } as OfficeService);
    });

    return {
      success: true,
      services: services,
      message: "Services retrieved successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching services.",
    };
  }
}

// Update office service
export async function updateOfficeService(serviceId: string, updates: Partial<OfficeService>, userId?: string): Promise<{ success: boolean; message: string }> {
  try {
    const serviceRef = doc(db, "office_services", serviceId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(serviceRef, updateData);
    
    // Log activity
    if (userId) {
      const updatedFields = Object.keys(updates).join(", ");
      await logUserAction(
        userId,
        `Updated service: ${serviceId}`,
        "Service Management",
        "update",
        `Updated fields: ${updatedFields}`,
        "service",
        serviceId
      );
    }
    
    return {
      success: true,
      message: "Service updated successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while updating the service.",
    };
  }
}

// Delete office service
export async function deleteOfficeService(serviceId: string, userId?: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get service data before deletion for logging
    let serviceName = serviceId;
    if (userId) {
      try {
        const serviceRef = doc(db, "office_services", serviceId);
        const serviceDoc = await getDoc(serviceRef);
        if (serviceDoc.exists()) {
          const data = serviceDoc.data() as any;
          serviceName = data.name || serviceId;
        }
      } catch (e) {
        // Continue with deletion even if we can't get the name
      }
    }

    const serviceRef = doc(db, "office_services", serviceId);
    await deleteDoc(serviceRef);

    // Log activity
    if (userId) {
      await logUserAction(
        userId,
        `Deleted service: ${serviceName}`,
        "Service Management",
        "delete",
        `Service: ${serviceName} (ID: ${serviceId})`,
        "service",
        serviceId
      );
    }
    
    return {
      success: true,
      message: "Service deleted successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while deleting the service.",
    };
  }
}
