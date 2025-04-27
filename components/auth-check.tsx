"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userExists } from "@/lib/firestore";
import { LoadingScreen } from "./loading-screen";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User is not signed in, redirect to auth page
        router.push("/auth");
      } else {
        // Check if user has a profile in Firestore
        try {
          const exists = await userExists();
          if (!exists) {
            // User is authenticated but doesn't have a profile, redirect to onboarding
            router.push("/onboarding");
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      // <div className="min-h-screen flex items-center justify-center bg-[#222034]">
      //   <div className="text-center">
      //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f9c80e] mb-4"></div>
      //     <p className="text-[#f0ece2]">LOADING YOUR ADVENTURE...</p>
      //   </div>
      // </div>
      <LoadingScreen />
    );
  }

  return <>{children}</>;
}
