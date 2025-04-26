"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Award, Zap, Star, Calendar, Clock } from "lucide-react";
import { Dumbbell } from "lucide-react";
import { Brain } from "lucide-react";

export default function StreaksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(7);
  const [mood, setMood] = useState("😊");
  const [health, setHealth] = useState(80);
  const [mana, setMana] = useState(60);
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

  // Active streaks
  const activeStreaks = [
    {
      name: "Daily Login",
      current: 7,
      target: 30,
      reward: "50 XP",
      icon: Calendar,
    },
    {
      name: "Workout Streak",
      current: 3,
      target: 7,
      reward: "Health +10",
      icon: Dumbbell,
    },
    {
      name: "Meditation",
      current: 5,
      target: 10,
      reward: "Mana +15",
      icon: Brain,
    },
  ];

  // Chain reaction rewards (from the bonus tracks image)
  const chainReactions = [
    {
      name: "Morning Victory",
      activities: [
        { name: "Wake up 7 AM", points: 3, completed: true },
        { name: "Exercise", points: 4, completed: false },
        { name: "Healthy breakfast", points: 3, completed: false },
      ],
      bonus: 3,
      totalPoints: 13,
    },
    {
      name: "Evening Wind Down",
      activities: [
        { name: "No screens after 9 PM", points: 2, completed: true },
        { name: "Read for 20 minutes", points: 3, completed: true },
        { name: "Meditate before sleep", points: 4, completed: false },
      ],
      bonus: 3,
      totalPoints: 12,
    },
    {
      name: "Productivity Boost",
      activities: [
        { name: "Plan your day", points: 2, completed: true },
        { name: "Deep work session", points: 5, completed: false },
        { name: "Review accomplishments", points: 2, completed: false },
      ],
      bonus: 3,
      totalPoints: 12,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
              <h1 className="text-xl text-[#f9c80e]">STREAKS & CHAINS</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Streaks */}
              <Card className="pixel-card bg-[#352f44] border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e] flex items-center">
                    <Target className="h-5 w-5 mr-2 text-[#f86624]" />
                    ACTIVE STREAKS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {activeStreaks.map((streak, index) => (
                      <div
                        key={index}
                        className="p-4 border-2 border-[#5c5470] bg-[#352f44]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-[#5c5470] text-[#dbd8e3] mr-4">
                              <streak.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">
                                {streak.name}
                              </h3>
                              <div className="flex items-center mt-1">
                                <div className="flex space-x-1">
                                  {[...Array(streak.target)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 ${
                                        i < streak.current
                                          ? "bg-[#f9c80e]"
                                          : "bg-[#5c5470]"
                                      } border border-black`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-[#dbd8e3] ml-2">
                                  {streak.current}/{streak.target} days
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-[#f9c80e] text-black">
                            {streak.reward}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chain Reaction Rewards */}
              <Card className="pixel-card bg-[#352f44] border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e] flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-[#f9c80e]" />
                    CHAIN REACTION REWARDS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {chainReactions.map((chain, index) => (
                      <div
                        key={index}
                        className="p-4 border-2 border-[#5c5470] bg-[#352f44]"
                      >
                        <h3 className="font-medium text-sm text-[#f9c80e] mb-3 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          {chain.name}
                          <Badge className="ml-auto bg-[#f9c80e] text-black">
                            {chain.totalPoints} POINTS
                          </Badge>
                        </h3>

                        <div className="space-y-2 mb-3">
                          {chain.activities.map((activity, actIndex) => (
                            <div
                              key={actIndex}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 mr-2 ${
                                    activity.completed
                                      ? "bg-[#43aa8b]"
                                      : "bg-[#5c5470]"
                                  } flex items-center justify-center text-xs border border-black`}
                                >
                                  {activity.completed ? "✓" : ""}
                                </div>
                                <span
                                  className={`text-xs ${
                                    activity.completed
                                      ? "text-[#dbd8e3]"
                                      : "text-[#dbd8e3]"
                                  }`}
                                >
                                  {activity.name}
                                </span>
                              </div>
                              <span className="text-xs text-[#f9c80e]">
                                +{activity.points} pts
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-[#5c5470] pt-2 flex items-center justify-between">
                          <span className="text-xs text-[#43aa8b]">
                            Chain completion bonus
                          </span>
                          <span className="text-xs text-[#43aa8b]">
                            +{chain.bonus} pts
                          </span>
                        </div>

                        <Button
                          className="w-full mt-3 pixel-button bg-[#43aa8b] text-black hover:bg-[#3a9579]"
                          disabled={!chain.activities.some((a) => !a.completed)}
                        >
                          CONTINUE CHAIN
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
