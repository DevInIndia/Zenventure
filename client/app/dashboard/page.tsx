"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainDashboard } from "@/components/main-dashboard";
import { mockQuests } from "@/lib/mock-data";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    const userGoal = localStorage.getItem("userGoal");
    const userLevel = localStorage.getItem("userLevel");

    if (!userGoal || !userLevel) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <MainDashboard quests={mockQuests} />;
}
