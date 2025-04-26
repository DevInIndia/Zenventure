"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, Calendar, Award } from "lucide-react";

export default function MindPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
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

  // Meditation sessions
  const meditationSessions = [
    { name: "Beginner's Mind", duration: 5, completed: true },
    { name: "Focused Attention", duration: 10, completed: false },
    { name: "Body Scan", duration: 15, completed: false },
    { name: "Loving-Kindness", duration: 20, completed: false },
  ];

  // Mindfulness challenges
  const mindfulnessChallenges = [
    {
      name: "Digital Detox",
      description: "No screens for 2 hours",
      completed: true,
    },
    {
      name: "Mindful Eating",
      description: "Eat one meal without distractions",
      completed: false,
    },
    {
      name: "Gratitude Journal",
      description: "Write 3 things you're grateful for",
      completed: true,
    },
    {
      name: "Nature Walk",
      description: "Take a 15-minute walk outside",
      completed: false,
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
              <h1 className="text-xl text-[#f9c80e]">MIND TRAINING</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meditation Section */}
              <Card className="pixel-card bg-[#352f44] border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e] flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-[#43aa8b]" />
                    MEDITATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Progress</span>
                      <span className="text-sm text-[#43aa8b]">5/30 min</span>
                    </div>
                    <Progress value={16.7} className="h-4 bg-[#5c5470]">
                      <div
                        className="h-full bg-[#43aa8b]"
                        style={{ width: "16.7%" }}
                      ></div>
                    </Progress>

                    <div className="mt-6 space-y-4">
                      {meditationSessions.map((session, index) => (
                        <div
                          key={index}
                          className={`p-4 border-2 ${
                            session.completed
                              ? "border-[#43aa8b] bg-[#5c5470]"
                              : "border-[#5c5470] bg-[#352f44]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`p-2 ${
                                  session.completed
                                    ? "bg-[#43aa8b] text-black"
                                    : "bg-[#5c5470] text-[#dbd8e3]"
                                } mr-4`}
                              >
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium text-sm">
                                  {session.name}
                                </h3>
                                <p className="text-xs text-[#dbd8e3]">
                                  {session.duration} minutes
                                </p>
                              </div>
                            </div>
                            <Button
                              className={`pixel-button ${
                                session.completed
                                  ? "bg-[#5c5470] text-[#dbd8e3]"
                                  : "bg-[#43aa8b] text-black hover:bg-[#3a9579]"
                              }`}
                              disabled={session.completed}
                            >
                              {session.completed ? "COMPLETED" : "START"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mindfulness Challenges */}
              <Card className="pixel-card bg-[#352f44] border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e] flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-[#f9c80e]" />
                    MINDFULNESS CHALLENGES
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Weekly Progress</span>
                      <span className="text-sm text-[#f9c80e]">
                        2/7 challenges
                      </span>
                    </div>
                    <Progress value={28.6} className="h-4 bg-[#5c5470]">
                      <div
                        className="h-full bg-[#f9c80e]"
                        style={{ width: "28.6%" }}
                      ></div>
                    </Progress>

                    <div className="mt-6 space-y-4">
                      {mindfulnessChallenges.map((challenge, index) => (
                        <div
                          key={index}
                          className={`p-4 border-2 ${
                            challenge.completed
                              ? "border-[#f9c80e] bg-[#5c5470]"
                              : "border-[#5c5470] bg-[#352f44]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`p-2 ${
                                  challenge.completed
                                    ? "bg-[#f9c80e] text-black"
                                    : "bg-[#5c5470] text-[#dbd8e3]"
                                } mr-4`}
                              >
                                <Award className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium text-sm">
                                  {challenge.name}
                                </h3>
                                <p className="text-xs text-[#dbd8e3]">
                                  {challenge.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              className={`pixel-button ${
                                challenge.completed
                                  ? "bg-[#5c5470] text-[#dbd8e3]"
                                  : "bg-[#f9c80e] text-black hover:bg-[#f86624]"
                              }`}
                              disabled={challenge.completed}
                            >
                              {challenge.completed ? "COMPLETED" : "COMPLETE"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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
