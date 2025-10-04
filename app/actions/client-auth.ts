"use client";

import { signInWithEmailAndPassword, User, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

export interface SignInData {
  email: string;
  password: string;
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

export async function signInClient(data: SignInData): Promise<AuthResult> {
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

    return {
      success: true,
      message: "Signed in successfully!",
      user: user,
      userData: userData,
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

export async function changePasswordClient(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      return { success: false, message: "No authenticated user." };
    }

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);

    return { success: true, message: "Password updated successfully." };
  } catch (error: any) {
    let errorMessage = "Failed to update password.";
    if (error.code === "auth/wrong-password") {
      errorMessage = "Current password is incorrect.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "New password is too weak (min 6 characters).";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many attempts. Try again later.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}

export async function forgotPasswordClient(email: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("Attempting to send password reset email to:", email);
    console.log("Firebase auth instance:", auth);
    console.log("Auth current user:", auth.currentUser);
    
    await sendPasswordResetEmail(auth, email);
    
    console.log("Password reset email sent successfully");
    
    return { 
      success: true, 
      message: "Password reset email sent successfully. Please check your inbox and spam folder." 
    };
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    let errorMessage = "Failed to send password reset email.";
    
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email address.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many requests. Please try again later.";
    } else if (error.code === "auth/invalid-action-code") {
      errorMessage = "Invalid action code. Please try again.";
    } else if (error.code === "auth/expired-action-code") {
      errorMessage = "The action code has expired. Please try again.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, message: errorMessage };
  }
}