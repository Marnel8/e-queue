"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { getUserData, signOutUser, UserData } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Prevent multiple simultaneous fetches
        if (!isFetchingUserData) {
          setIsFetchingUserData(true);
          try {
            const result = await getUserData(user.uid);
            if (result.success && result.userData) {
              setUserData(result.userData);
            } else {
              // Set user data to null but keep the user authenticated
              setUserData(null);
            }
          } catch (error) {
            setUserData(null);
          } finally {
            setIsFetchingUserData(false);
          }
        }
      } else {
        setUser(null);
        setUserData(null);
        setIsFetchingUserData(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        setUser(null);
        setUserData(null);
        toast({
          title: "Success",
          description: "Signed out successfully!",
        });
        router.push("/login");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    userData,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
