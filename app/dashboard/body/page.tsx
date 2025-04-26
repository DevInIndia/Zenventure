"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Clock, Flame, Heart, Trophy } from "lucide-react";

export default function BodyPage() {
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

  // Workout routines
  const workoutRoutines = [
    {
      name: "Morning Stretch",
      duration: 10,
      intensity: "Easy",
      completed: true,
    },
    { name: "HIIT Workout", duration: 20, intensity: "Hard", completed: false },
    {
      name: "Strength Training",
      duration: 30,
      intensity: "Medium",
      completed: false,
    },
    { name: "Evening Yoga", duration: 15, intensity: "Easy", completed: false },
  ];

  // Health metrics
  const healthMetrics = {
    steps: { current: 6500, goal: 10000 },
    water: { current: 5, goal: 8 },
    sleep: { current: 7, goal: 8 },
    calories: { current: 1800, goal: 2200 },
  };

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
              <h1 className="text-xl text-[#f9c80e]">BODY TRAINING</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workout Section */}
              <Card className="pixel-card bg-[#352f44] border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e] flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-[#f86624]" />
                    WORKOUT ROUTINES
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Progress</span>
                      <span className="text-sm text-[#f86624]">10/75 min</span>
                    </div>
                    <Progress value={13.3} className="h-4 bg-[#5c5470]">
                      <div
                        className="h-full bg-[#f86624]"
                        style={{ width: "13.3%" }}
                      ></div>
                    </Progress>

                    <div className="mt-6 space-y-4">
                      {workoutRoutines.map((workout, index) => (
                        <div
                          key={index}
                          className={`p-4 border-2 ${
                            workout.completed
                              ? "border-[#f86624] bg-[#5c5470]"
                              : "border-[#5c5470] bg-[#352f44]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`p-2 ${
                                  workout.completed
                                    ? "bg-[#f86624] text-black"
                                    : "bg-[#5c5470] text-[#dbd8e3]"
                                } mr-4`}
                              >
                                <Flame className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium text-sm">
                                  {workout.name}
                                </h3>
                                <p className="text-xs text-[#dbd8e3]">
                                  {workout.duration} min • {workout.intensity}
                                </p>
                              </div>
                            </div>
                            <Button
                              className={`pixel-button ${
                                workout.completed
                                  ? "bg-[#5c5470] text-[#dbd8e3]"
                                  : "bg-[#f86624] text-black hover:bg-[#e55513]"
                              }`}
                              disabled={workout.completed}
                            >
                              {workout.completed ? "COMPLETED" : "START"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Metrics */}
              <Card className="pixel-card bg-[#352f44] border-4 border-black">
                <CardHeader className="border-b-4 border-[#5c5470] pb-4">
                  <CardTitle className="text-[#f9c80e] flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-[#f86624]" />
                    HEALTH METRICS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Steps */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-[#f9c80e]" />{" "}
                          Steps
                        </span>
                        <span className="text-sm text-[#f9c80e]">
                          {healthMetrics.steps.current}/
                          {healthMetrics.steps.goal}
                        </span>
                      </div>
                      <Progress
                        value={
                          (healthMetrics.steps.current /
                            healthMetrics.steps.goal) *
                          100
                        }
                        className="h-4 bg-[#5c5470]"
                      >
                        <div
                          className="h-full bg-[#f9c80e]"
                          style={{
                            width: `${
                              (healthMetrics.steps.current /
                                healthMetrics.steps.goal) *
                              100
                            }%`,
                          }}
                        ></div>
                      </Progress>
                    </div>

                    {/* Water */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-[#43aa8b]" />{" "}
                          Water (glasses)
                        </span>
                        <span className="text-sm text-[#43aa8b]">
                          {healthMetrics.water.current}/
                          {healthMetrics.water.goal}
                        </span>
                      </div>
                      <Progress
                        value={
                          (healthMetrics.water.current /
                            healthMetrics.water.goal) *
                          100
                        }
                        className="h-4 bg-[#5c5470]"
                      >
                        <div
                          className="h-full bg-[#43aa8b]"
                          style={{
                            width: `${
                              (healthMetrics.water.current /
                                healthMetrics.water.goal) *
                              100
                            }%`,
                          }}
                        ></div>
                      </Progress>
                    </div>

                    {/* Sleep */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-[#f86624]" />{" "}
                          Sleep (hours)
                        </span>
                        <span className="text-sm text-[#f86624]">
                          {healthMetrics.sleep.current}/
                          {healthMetrics.sleep.goal}
                        </span>
                      </div>
                      <Progress
                        value={
                          (healthMetrics.sleep.current /
                            healthMetrics.sleep.goal) *
                          100
                        }
                        className="h-4 bg-[#5c5470]"
                      >
                        <div
                          className="h-full bg-[#f86624]"
                          style={{
                            width: `${
                              (healthMetrics.sleep.current /
                                healthMetrics.sleep.goal) *
                              100
                            }%`,
                          }}
                        ></div>
                      </Progress>
                    </div>

                    {/* Calories */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-[#f9c80e]" />{" "}
                          Calories
                        </span>
                        <span className="text-sm text-[#f9c80e]">
                          {healthMetrics.calories.current}/
                          {healthMetrics.calories.goal}
                        </span>
                      </div>
                      <Progress
                        value={
                          (healthMetrics.calories.current /
                            healthMetrics.calories.goal) *
                          100
                        }
                        className="h-4 bg-[#5c5470]"
                      >
                        <div
                          className="h-full bg-[#f9c80e]"
                          style={{
                            width: `${
                              (healthMetrics.calories.current /
                                healthMetrics.calories.goal) *
                              100
                            }%`,
                          }}
                        ></div>
                      </Progress>
                    </div>

                    <Button className="w-full pixel-button bg-[#f86624] text-black hover:bg-[#e55513] mt-4">
                      UPDATE METRICS
                    </Button>
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
