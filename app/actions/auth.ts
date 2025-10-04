"use server";

import { auth, db } from "@/firebase/firebase";
import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  getAuth
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { logUserAction } from "./activity-log";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface SignInData {
  email: string;
  password: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  userData?: any;
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface AdminCreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  officeId?: string | null;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  department?: string | null;
  position?: string | null;
  workStart?: string | null;
  workEnd?: string | null;
}

export async function signUpAdmin(data: SignUpData): Promise<AuthResult> {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: data.name,
    });

    // Save user data to Firestore
    const userRef = doc(db, "users", user.uid);
    const userData = {
      uid: user.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLoginAt: null,
    };
    
    await setDoc(userRef, userData);

    return {
      success: true,
      message: "Admin account created successfully!",
      user: user,
      userData: userData,
    };
  } catch (error: any) {
    let errorMessage = "An error occurred during sign up.";
    
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Create user as an admin without affecting current session
export async function adminCreateUser(data: AdminCreateUserData): Promise<AuthResult> {
  try {
    // Initialize a secondary app instance to avoid touching default auth state
    const secondaryAppName = "adminSecondary";
    const secondaryApp = getApps().find((a) => a.name === secondaryAppName)
      ? getApp(secondaryAppName)
      : initializeApp((auth.app as any).options, secondaryAppName);

    const secondaryAuth = getAuth(secondaryApp);

    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    await updateProfile(user, { displayName: data.name });

    const userRef = doc(db, "users", user.uid);
    const userData = {
      uid: user.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      officeId: data.officeId ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      bio: data.bio ?? null,
      department: data.department ?? null,
      position: data.position ?? null,
      workStart: data.workStart ?? null,
      workEnd: data.workEnd ?? null,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLoginAt: null,
    };

    await setDoc(userRef, userData);

    return {
      success: true,
      message: "User created successfully!",
      user: user,
      userData,
    };
  } catch (error: any) {
    let errorMessage = "Failed to create user.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    }
    return { success: false, message: errorMessage };
  }
}

export async function signIn(data: SignInData): Promise<AuthResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // Get user data from Firestore to verify role
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        message: "User data not found. Please contact support.",
      };
    }

    const userData = userDoc.data() as UserData;
    
    // Check if user is active
    if (!userData.isActive) {
      return {
        success: false,
        message: "Account is deactivated. Please contact support.",
      };
    }

    // Update last login time
    await setDoc(userRef, {
      ...userData,
      lastLoginAt: new Date().toISOString(),
    }, { merge: true });

    return {
      success: true,
      message: "Signed in successfully!",
      user: user,
      userData: {
        ...userData,
        lastLoginAt: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    let errorMessage = "An error occurred during sign in.";
    
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed attempts. Please try again later.";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function signOutUser(): Promise<AuthResult> {
  try {
    await signOut(auth);
    return {
      success: true,
      message: "Signed out successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred during sign out.",
    };
  }
}

// Get user data by UID
export async function getUserData(uid: string): Promise<{ success: boolean; userData?: UserData; message?: string }> {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const userData = userDoc.data() as UserData;
    return {
      success: true,
      userData: userData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching user data.",
    };
  }
}

// Get users by role
export async function getUsersByRole(role: string): Promise<{ success: boolean; users?: UserData[]; message?: string }> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", role));
    const querySnapshot = await getDocs(q);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserData);
    });

    return {
      success: true,
      users: users,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching users.",
    };
  }
}

// Update user data
export async function updateUserData(uid: string, updates: Partial<UserData>): Promise<{ success: boolean; message: string }> {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, updates, { merge: true });
    
    return {
      success: true,
      message: "User data updated successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while updating user data.",
    };
  }
}

// Deactivate user account
export async function deactivateUser(uid: string, adminUserId?: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get user data before deactivation for logging
    let userName = uid;
    if (adminUserId) {
      try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as any;
          userName = data.name || data.email || uid;
        }
      } catch (e) {
        // Continue with deactivation even if we can't get the name
      }
    }

    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { isActive: false }, { merge: true });

    // Log activity
    if (adminUserId) {
      await logUserAction(
        adminUserId,
        `Deactivated user: ${userName}`,
        "User Management",
        "update",
        `User: ${userName} (ID: ${uid}) - Account deactivated`,
        "user",
        uid
      );
    }
    
    return {
      success: true,
      message: "User account deactivated successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while deactivating user account.",
    };
  }
}

// Permanently delete user document from Firestore (does not remove Firebase Auth user)
export async function hardDeleteUser(uid: string, adminUserId?: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get user data before deletion for logging
    let userName = uid;
    if (adminUserId) {
      try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as any;
          userName = data.name || data.email || uid;
        }
      } catch (e) {
        // Continue with deletion even if we can't get the name
      }
    }

    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);

    // Log activity
    if (adminUserId) {
      await logUserAction(
        adminUserId,
        `Deleted user: ${userName}`,
        "User Management",
        "delete",
        `User: ${userName} (ID: ${uid}) - Permanently deleted`,
        "user",
        uid
      );
    }

    return { success: true, message: "User deleted permanently." };
  } catch (error: any) {
    return { success: false, message: "An error occurred while deleting user." };
  }
}

// Get all users from users collection
export async function getAllUsers(): Promise<{ success: boolean; users?: any[]; message?: string }> {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      success: true,
      users: users,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching users.",
    };
  }
}

// Get user by email from users collection
export async function getUserByEmail(email: string): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = {
      id: userDoc.id,
      ...userDoc.data(),
    };

    return {
      success: true,
      user: userData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "An error occurred while fetching user.",
    };
  }
}
