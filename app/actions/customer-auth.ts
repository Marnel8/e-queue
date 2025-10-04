"use client";

import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile,
  User
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

export interface CustomerSignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  userData?: any;
}

export interface CustomerUserData {
  uid: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
}

export async function signUpCustomer(data: CustomerSignUpData): Promise<AuthResult> {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    // Update user profile with display name
    const fullName = `${data.firstName} ${data.lastName}`;
    await updateProfile(user, {
      displayName: fullName,
    });

    // Send email verification
    await sendEmailVerification(user);

    // Save user data to Firestore
    const userRef = doc(db, "users", user.uid);
    const userData: CustomerUserData = {
      uid: user.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      name: fullName,
      email: data.email,
      phone: data.phone,
      studentId: data.studentId,
      role: "customer",
      createdAt: new Date().toISOString(),
      isActive: true,
      emailVerified: false,
      lastLoginAt: null,
    };
    
    await setDoc(userRef, userData);

    return {
      success: true,
      message: "Account created successfully! Please check your email to verify your account.",
      user: user,
      userData: userData,
    };
  } catch (error: any) {
    let errorMessage = "An error occurred during registration.";
    
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage = "Email/password accounts are not enabled. Please contact support.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many requests. Please try again later.";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
