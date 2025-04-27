"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, Star, Calendar, RefreshCw } from "lucide-react";
import { Dumbbell } from "lucide-react";
import { Brain } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserProfile,
  completeChainActivity,
  resetChain,
} from "@/lib/firestore";
import type { UserProfile, ChainReaction } from "@/lib/types";
import { LoadingScreen } from "@/components/loading-screen";

export default function StreaksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeChains, setActiveChains] = useState<ChainReaction[]>([]);
  const [completedChains, setCompletedChains] = useState<ChainReaction[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const profile = await getUserProfile();

          if (profile) {
            setUserProfile(profile);
            setActiveChains(
              profile.chainReactions.filter((chain) => chain.isActive)
            );
            setCompletedChains(profile.completedChains || []);
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

  const handleCompleteActivity = async (
    chainId: string,
    activityId: string
  ) => {
    if (!userProfile || isUpdating) return;

    setIsUpdating(true);

    try {
      const result = await completeChainActivity(chainId, activityId);

      // Update local state
      const updatedChains = activeChains.map((chain) => {
        if (chain.id === chainId) {
          return result.chain;
        }
        return chain;
      });

      // If chain is completed, remove from active chains
      const newActiveChains = result.allCompleted
        ? updatedChains.filter((chain) => chain.id !== chainId)
        : updatedChains;

      setActiveChains(newActiveChains);

      // If chain is completed, add to completed chains
      if (result.allCompleted) {
        setCompletedChains([...completedChains, result.chain]);
      }

      // Update user profile points
      setUserProfile({
        ...userProfile,
        points: userProfile.points + result.totalPoints,
      });
    } catch (error) {
      console.error("Error completing activity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetChain = async (chainId: string) => {
    if (!userProfile || isUpdating) return;

    setIsUpdating(true);

    try {
      const resetedChain = await resetChain(chainId);

      // Update local state
      const updatedChains = activeChains.map((chain) => {
        if (chain.id === chainId) {
          return resetedChain;
        }
        return chain;
      });

      setActiveChains(updatedChains);
    } catch (error) {
      console.error("Error resetting chain:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#222034] text-[#f0ece2]">
      {userProfile && (
        <TopBar
          xp={userProfile.xp}
          points={userProfile.points}
          streak={userProfile.currentStreak}
          mood={userProfile.mood}
          health={userProfile.health}
          mana={userProfile.mana}
        />
      )}

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
                    {userProfile && (
                      <div className="p-4 border-2 border-[#5c5470] bg-[#352f44]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-[#5c5470] text-[#dbd8e3] mr-4">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">
                                Daily Login
                              </h3>
                              <div className="flex items-center mt-1">
                                <div className="flex space-x-1">
                                  {[...Array(30)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 ${
                                        i < userProfile.currentStreak
                                          ? "bg-[#f9c80e]"
                                          : "bg-[#5c5470]"
                                      } border border-black`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-[#dbd8e3] ml-2">
                                  {userProfile.currentStreak}/30 days
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-[#f9c80e] text-black">
                            +{userProfile.currentStreak * 5} XP
                          </Badge>
                        </div>
                      </div>
                    )}

                    {userProfile && userProfile.currentStreak >= 7 && (
                      <div className="p-4 border-2 border-[#5c5470] bg-[#352f44]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-[#5c5470] text-[#dbd8e3] mr-4">
                              <Dumbbell className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">
                                Workout Streak
                              </h3>
                              <div className="flex items-center mt-1">
                                <div className="flex space-x-1">
                                  {[...Array(7)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 ${
                                        i <
                                        Math.min(userProfile.currentStreak, 7)
                                          ? "bg-[#f86624]"
                                          : "bg-[#5c5470]"
                                      } border border-black`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-[#dbd8e3] ml-2">
                                  {Math.min(userProfile.currentStreak, 7)}/7
                                  days
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-[#f86624] text-black">
                            Health +10
                          </Badge>
                        </div>
                      </div>
                    )}

                    {userProfile && userProfile.currentStreak >= 5 && (
                      <div className="p-4 border-2 border-[#5c5470] bg-[#352f44]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-[#5c5470] text-[#dbd8e3] mr-4">
                              <Brain className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">
                                Meditation
                              </h3>
                              <div className="flex items-center mt-1">
                                <div className="flex space-x-1">
                                  {[...Array(10)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 ${
                                        i <
                                        Math.min(userProfile.currentStreak, 10)
                                          ? "bg-[#43aa8b]"
                                          : "bg-[#5c5470]"
                                      } border border-black`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-[#dbd8e3] ml-2">
                                  {Math.min(userProfile.currentStreak, 10)}/10
                                  days
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-[#43aa8b] text-black">
                            Mana +15
                          </Badge>
                        </div>
                      </div>
                    )}
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
                    {activeChains.map((chain) => (
                      <div
                        key={chain.id}
                        className="p-4 border-2 border-[#5c5470] bg-[#352f44]"
                      >
                        <h3 className="font-medium text-sm text-[#f9c80e] mb-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-2" />
                            {chain.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#f9c80e] text-black">
                              {chain.activities.reduce(
                                (sum, act) => sum + act.points,
                                0
                              ) + chain.bonusPoints}{" "}
                              POINTS
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => handleResetChain(chain.id)}
                              disabled={isUpdating}
                            >
                              <RefreshCw className="h-3 w-3 text-[#dbd8e3]" />
                            </Button>
                          </div>
                        </h3>

                        <div className="space-y-2 mb-3">
                          {chain.activities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 mr-2 ${
                                    activity.completed
                                      ? "bg-[#43aa8b]"
                                      : "bg-[#5c5470]"
                                  } flex items-center justify-center text-xs border border-black cursor-pointer`}
                                  onClick={() =>
                                    !activity.completed &&
                                    handleCompleteActivity(
                                      chain.id,
                                      activity.id
                                    )
                                  }
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
                            +{chain.bonusPoints} pts
                          </span>
                        </div>

                        <Button
                          className="w-full mt-3 pixel-button bg-[#43aa8b] text-black hover:bg-[#3a9579]"
                          disabled={
                            chain.activities.every((a) => a.completed) ||
                            isUpdating
                          }
                          onClick={() => {
                            const nextIncomplete = chain.activities.find(
                              (a) => !a.completed
                            );
                            if (nextIncomplete) {
                              handleCompleteActivity(
                                chain.id,
                                nextIncomplete.id
                              );
                            }
                          }}
                        >
                          {isUpdating ? "UPDATING..." : "CONTINUE CHAIN"}
                        </Button>
                      </div>
                    ))}

                    {activeChains.length === 0 && (
                      <div className="text-center p-6">
                        <p className="text-[#dbd8e3] mb-4">
                          All chains completed! Check back tomorrow for new
                          chains.
                        </p>
                        <div className="text-4xl">🎉</div>
                      </div>
                    )}

                    {completedChains.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium text-sm text-[#f9c80e] mb-3">
                          Completed Chains
                        </h3>
                        <div className="space-y-2">
                          {completedChains.slice(0, 3).map((chain) => (
                            <div
                              key={chain.id}
                              className="p-3 border border-[#43aa8b] bg-[#352f44]/50"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 mr-2 text-[#43aa8b]" />
                                  <span className="text-xs">{chain.name}</span>
                                </div>
                                <Badge className="bg-[#43aa8b] text-black text-xs">
                                  +
                                  {chain.activities.reduce(
                                    (sum, act) => sum + act.points,
                                    0
                                  ) + chain.bonusPoints}{" "}
                                  pts
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
