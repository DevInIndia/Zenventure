"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { QuestList } from "@/components/quest-list";
import { QuestListModal } from "@/components/quest-list-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserProfile,
  getAvailableQuests,
  addActiveQuest,
  completeQuest,
  updateQuestTime,
  createCustomQuest,
} from "@/lib/firestore";
import type { Quest } from "@/lib/types";
import { LoadingScreen } from "@/components/loading-screen";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);
  const [xp, setXp] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState("😊");
  const [health, setHealth] = useState(80);
  const [mana, setMana] = useState(60);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const userProfile = await getUserProfile();

          if (userProfile) {
            // User exists, load their data
            setUserName(userProfile.displayName || "Adventurer");
            setActiveQuests(userProfile.activeQuests || []);
            setCompletedQuests(userProfile.completedQuests || []);
            setXp(userProfile.xp || 0);
            setPoints(userProfile.points || 0);
            setStreak(userProfile.streak || 0);
            setMood(userProfile.mood || "😊");
            setHealth(userProfile.health || 80);
            setMana(userProfile.mana || 60);

            // Get available quests
            const available = await getAvailableQuests();
            setAvailableQuests(available);

            setIsLoading(false);
          } else {
            // User doesn't have a profile, redirect to onboarding
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleCompleteQuest = async (questId: string) => {
    const quest = activeQuests.find((q) => q.id === questId);
    if (quest) {
      try {
        // Complete quest in Firestore
        const { newXP, newHealth, newMana } = await completeQuest(quest);

        // Update local state
        setXp(newXP);
        setHealth(newHealth);
        setMana(newMana);
        setActiveQuests(activeQuests.filter((q) => q.id !== questId));
        setCompletedQuests([...completedQuests, quest]);
      } catch (error) {
        console.error("Error completing quest:", error);
      }
    }
  };

  const handleAddQuests = async (quests: Quest[]) => {
    try {
      // Add quests to active quests in Firestore
      for (const quest of quests) {
        await addActiveQuest(quest);
      }

      // Update local state
      setActiveQuests([...activeQuests, ...quests]);
      setAvailableQuests(
        availableQuests.filter((q) => !quests.some((sq) => sq.id === q.id))
      );
    } catch (error) {
      console.error("Error adding quests:", error);
    }
  };

  const handleCreateQuest = async (
    quest: Omit<Quest, "id" | "createdBy" | "createdAt">
  ) => {
    try {
      // Create a new quest in Firestore
      const newQuest = await createCustomQuest(quest);

      // Update local state
      setActiveQuests([...activeQuests, newQuest]);
    } catch (error) {
      console.error("Error creating quest:", error);
    }
  };

  const handleUpdateQuestTime = async (questId: string, newTime: number) => {
    try {
      // Update quest time in Firestore
      await updateQuestTime(questId, newTime);

      // Update local state
      setActiveQuests(
        activeQuests.map((quest) => {
          if (quest.id === questId) {
            return { ...quest, estimatedTime: newTime };
          }
          return quest;
        })
      );
    } catch (error) {
      console.error("Error updating quest time:", error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#222034] text-[#f0ece2]">
      <TopBar
        xp={xp}
        streak={streak}
        points={points}
        mood={mood}
        health={health}
        mana={mana}
      />

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
                <h1 className="text-xl text-[#f9c80e]">
                  WELCOME, {userName.toUpperCase()}
                </h1>
                <div className="ml-auto flex items-center gap-2 px-4">
                  <div className="text-xs text-[#dbd8e3]">ACTIVE QUESTS:</div>
                  <div className="text-[#f9c80e]">{activeQuests.length}</div>
                </div>
                <QuestListModal
                  availableQuests={availableQuests}
                  onAddQuests={handleAddQuests}
                  onCreateQuest={handleCreateQuest}
                />
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
                    onCompleteQuest={handleCompleteQuest}
                    onUpdateTime={handleUpdateQuestTime}
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
