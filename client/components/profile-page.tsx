"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XPGraph } from "@/components/xp-graph";
import { StreakCalendar } from "@/components/streak-calendar";
import { MoodLog } from "@/components/mood-log";
import { Shield, Sword, Brain, Heart, Award, Star, Zap } from "lucide-react";

export function ProfilePage() {
  const [xp, setXp] = useState(250);
  const [streak, setStreak] = useState(7);
  const [mood, setMood] = useState("😊");
  const [health, setHealth] = useState(80);
  const [mana, setMana] = useState(60);

  // Calculate level based on XP (simple formula)
  const level = Math.floor(xp / 100) + 1;

  // Determine persona based on user's primary goal
  const userGoal = localStorage.getItem("userGoal") || "productivity";
  const persona =
    userGoal === "productivity"
      ? "Scholar"
      : userGoal === "fitness"
      ? "Warrior"
      : "Healer";

  // Character stats
  const stats = {
    strength: userGoal === "fitness" ? 8 : 4,
    intelligence: userGoal === "productivity" ? 8 : 4,
    wisdom: userGoal === "mindfulness" ? 8 : 4,
    dexterity: 5,
    constitution: 6,
    charisma: 5,
  };

  // Achievements
  const achievements = [
    {
      name: "First Quest",
      description: "Complete your first quest",
      earned: true,
    },
    {
      name: "Streak Master",
      description: "Maintain a 7-day streak",
      earned: true,
    },
    {
      name: "Mind Over Matter",
      description: "Complete 10 mindfulness quests",
      earned: false,
    },
    {
      name: "Fitness Fanatic",
      description: "Complete 10 fitness quests",
      earned: false,
    },
    {
      name: "Productivity Pro",
      description: "Complete 10 productivity quests",
      earned: true,
    },
  ];

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
              {/* Character Info */}
              <Card className="pixel-card bg-[#352f44] md:col-span-1 border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e]">PLAYER INFO</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-[#5c5470] border-4 border-black mb-4 flex items-center justify-center">
                      <span className="text-4xl">
                        {userGoal === "productivity"
                          ? "📚"
                          : userGoal === "fitness"
                          ? "💪"
                          : "🧠"}
                      </span>
                    </div>
                    <h2 className="text-lg text-[#f9c80e] mb-1">
                      LVL {level} {persona}
                    </h2>
                    <p className="text-xs text-[#dbd8e3]">XP: {xp}/300</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">STRENGTH</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 mx-0.5 ${
                              i < stats.strength
                                ? "bg-[#f86624]"
                                : "bg-[#5c5470]"
                            } border border-black`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">INTELLIGENCE</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 mx-0.5 ${
                              i < stats.intelligence
                                ? "bg-[#43aa8b]"
                                : "bg-[#5c5470]"
                            } border border-black`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">WISDOM</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 mx-0.5 ${
                              i < stats.wisdom ? "bg-[#f9c80e]" : "bg-[#5c5470]"
                            } border border-black`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">DEXTERITY</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 mx-0.5 ${
                              i < stats.dexterity
                                ? "bg-[#f86624]"
                                : "bg-[#5c5470]"
                            } border border-black`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">CONSTITUTION</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 mx-0.5 ${
                              i < stats.constitution
                                ? "bg-[#43aa8b]"
                                : "bg-[#5c5470]"
                            } border border-black`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">CHARISMA</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 mx-0.5 ${
                              i < stats.charisma
                                ? "bg-[#f9c80e]"
                                : "bg-[#5c5470]"
                            } border border-black`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid grid-cols-3 bg-[#5c5470] border-4 border-black p-0">
                    <TabsTrigger
                      value="stats"
                      className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none border-r-2 border-black"
                    >
                      STATS
                    </TabsTrigger>
                    <TabsTrigger
                      value="achievements"
                      className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none border-r-2 border-black"
                    >
                      ACHIEVEMENTS
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none"
                    >
                      HISTORY
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

                  <TabsContent value="achievements" className="mt-6">
                    <Card className="pixel-card bg-[#352f44] border-4 border-black">
                      <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                        <CardTitle className="text-[#f9c80e]">
                          ACHIEVEMENTS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid gap-4">
                          {achievements.map((achievement, index) => (
                            <div
                              key={index}
                              className={`p-4 border-2 ${
                                achievement.earned
                                  ? "border-[#f9c80e] bg-[#5c5470]"
                                  : "border-[#5c5470] bg-[#352f44] opacity-70"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`p-2 ${
                                    achievement.earned
                                      ? "bg-[#f9c80e] text-black"
                                      : "bg-[#5c5470] text-[#dbd8e3]"
                                  } mr-4`}
                                >
                                  <Award className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm">
                                    {achievement.name}
                                  </h3>
                                  <p className="text-xs text-[#dbd8e3]">
                                    {achievement.description}
                                  </p>
                                </div>
                                {achievement.earned && (
                                  <Badge className="ml-auto bg-[#f9c80e] text-black">
                                    EARNED
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history" className="mt-6">
                    <Card className="pixel-card bg-[#352f44] border-4 border-black">
                      <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                        <CardTitle className="text-[#f9c80e]">
                          MOOD TRACKER
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <MoodLog />
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
