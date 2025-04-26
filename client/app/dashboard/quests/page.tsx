"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { QuestList } from "@/components/quest-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter } from "lucide-react";
import { mockQuests } from "@/lib/mock-data";
import type { Quest } from "@/lib/types";

export default function QuestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
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
      // Initialize quests
      setActiveQuests(mockQuests);
      setCompletedQuests([]);
      setIsLoading(false);
    }
  }, [router]);

  const completeQuest = (questId: string) => {
    const quest = activeQuests.find((q) => q.id === questId);
    if (quest) {
      // Update XP
      setXp((prev) => prev + quest.xpReward);

      // Update health and mana based on quest category
      if (quest.category === "fitness") {
        setHealth((prev) => Math.min(prev + 10, 100));
      } else if (quest.category === "mindfulness") {
        setMana((prev) => Math.min(prev + 15, 100));
      }

      // Move quest from active to completed
      setActiveQuests((prev) => prev.filter((q) => q.id !== questId));
      setCompletedQuests((prev) => [...prev, quest]);
    }
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
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="pixel-card bg-[#352f44] p-4 mb-6 flex items-center justify-between">
                <h1 className="text-xl text-[#f9c80e]">QUEST LOG</h1>
                <div className="flex gap-2">
                  <Button className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]">
                    <Filter className="h-4 w-4 mr-2" />
                    FILTER
                  </Button>
                  <Button className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]">
                    <Plus className="h-4 w-4 mr-2" />
                    NEW QUEST
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-2 bg-[#5c5470] border-4 border-black p-0">
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none border-r-2 border-black"
                  >
                    ACTIVE QUESTS
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-[#f9c80e] data-[state=active]:text-black rounded-none"
                  >
                    COMPLETED
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-6">
                  <QuestList
                    quests={activeQuests}
                    onCompleteQuest={completeQuest}
                  />

                  {activeQuests.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-8 pixel-card bg-[#352f44] mt-8"
                    >
                      <h2 className="text-xl text-[#f9c80e] mb-2">
                        ALL QUESTS COMPLETED!
                      </h2>
                      <p className="text-[#dbd8e3] text-sm">
                        GREAT JOB! YOU'VE COMPLETED ALL YOUR QUESTS FOR TODAY.
                      </p>
                      <div className="mt-4 text-4xl">🏆</div>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  {completedQuests.length > 0 ? (
                    <QuestList
                      quests={completedQuests}
                      onCompleteQuest={() => {}}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-8 pixel-card bg-[#352f44] mt-8"
                    >
                      <h2 className="text-xl text-[#f9c80e] mb-2">
                        NO COMPLETED QUESTS
                      </h2>
                      <p className="text-[#dbd8e3] text-sm">
                        COMPLETE SOME QUESTS TO SEE THEM HERE!
                      </p>
                      <div className="mt-4 text-4xl">📜</div>
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
