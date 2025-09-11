"use client";

import { signInWithEmailAndPassword, User } from "firebase/auth";
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
    console.error("Sign in error:", error);
    
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