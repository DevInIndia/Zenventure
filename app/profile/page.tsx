"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfilePage } from "@/components/profile-page";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/lib/types";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const profile = await getUserProfile();

          if (profile) {
            setUserProfile(profile);
            setIsLoading(false);
          } else {
            // User doesn't have a profile, redirect to onboarding
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setIsLoading(false);
        }
      } else {
        // User is not signed in, redirect to auth page
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return userProfile ? <ProfilePage userProfile={userProfile} /> : null;
}
