"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XPGraph } from "@/components/xp-graph";
import { StreakCalendar } from "@/components/streak-calendar";
import Image from "next/image";
import type { UserProfile } from "@/lib/types";

interface ProfilePageProps {
  userProfile: UserProfile;
}

export function ProfilePage({ userProfile }: ProfilePageProps) {
  const [xp, setXp] = useState(userProfile.xp);
  const [streak, setStreak] = useState(userProfile.streak);
  const [mood, setMood] = useState(userProfile.mood);
  const [health, setHealth] = useState(userProfile.health);
  const [mana, setMana] = useState(userProfile.mana);

  // Calculate level based on XP (simple formula)
  const level = Math.floor(xp / 100) + 1;

  // Determine persona based on user's primary goal
  const persona =
    userProfile.goal === "productivity"
      ? "Scholar"
      : userProfile.goal === "fitness"
      ? "Warrior"
      : "Healer";

  return (
    <div className="min-h-screen flex flex-col bg-[#222034] text-[#f0ece2]">
      <TopBar xp={xp} streak={streak} mood={mood} health={health} mana={mana} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pixel-card bg-[#352f44] p-4 mb-6">
              <h1 className="text-xl text-[#f9c80e]">CHARACTER SHEET</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Character Info - Simplified */}
              <Card className="pixel-card bg-[#352f44] md:col-span-1 border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e]">PLAYER INFO</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6 gap-4">
                    <div className="w-24 h-24 bg-[#5c5470] border-4 border-black flex items-center justify-center overflow-hidden">
                      {userProfile.photoURL ? (
                        <Image
                          src={userProfile.photoURL || "/placeholder.svg"}
                          width={96}
                          height={96}
                          alt="user-image"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-4xl">
                          {userProfile.goal === "productivity"
                            ? "📚"
                            : userProfile.goal === "fitness"
                            ? "💪"
                            : "🧠"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h2 className="text-lg text-[#f9c80e] mb-1">
                        {userProfile.displayName}
                      </h2>
                      <p className="text-xs text-gray-400">
                        {userProfile.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full bg-[#5c5470] p-3 border-2 border-[#dbd8e3]">
                      <h2 className="text-sm text-[#f9c80e] mb-1">
                        LVL {level} {persona}
                      </h2>
                      <div className="w-full bg-[#352f44] h-4 mt-2 border border-black">
                        <div
                          className="bg-[#f9c80e] h-full"
                          style={{ width: `${xp % 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#dbd8e3] mt-1">
                        XP: {xp % 100}/100
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid grid-cols-2 bg-[#5c5470] border-4 border-black p-0">
                    <TabsTrigger
                      value="stats"
                      className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none border-r-2 border-black"
                    >
                      STATS
                    </TabsTrigger>
                    <TabsTrigger
                      value="streaks"
                      className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none"
                    >
                      STREAKS
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="mt-6 space-y-6">
                    <Card className="pixel-card bg-[#352f44] border-4 border-black">
                      <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                        <CardTitle className="text-[#f9c80e]">
                          XP PROGRESS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <XPGraph />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="streaks" className="mt-6">
                    <Card className="pixel-card bg-[#352f44] border-4 border-black">
                      <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                        <CardTitle className="text-[#f9c80e]">
                          STREAK CALENDAR
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <StreakCalendar />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
