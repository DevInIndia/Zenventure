"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { QuestList } from "@/components/quest-list";
import type { Quest } from "@/lib/types";

interface MainDashboardProps {
  quests: Quest[];
}

export function MainDashboard({ quests }: MainDashboardProps) {
  const [activeQuests, setActiveQuests] = useState<Quest[]>(quests);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState("😊");
  const [health, setHealth] = useState(80);
  const [mana, setMana] = useState(60);

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

      // Remove quest from active list
      setActiveQuests((prev) => prev.filter((q) => q.id !== questId));

      // In a real app, we would update the database
    }
  };

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
              <div className="pixel-card bg-[#352f44] p-4 mb-6 flex items-center">
                <h1 className="text-xl text-[#f9c80e]">TODAY'S QUESTS</h1>
                <div className="ml-auto flex items-center gap-2">
                  <div className="text-xs text-[#dbd8e3]">ACTIVE QUESTS:</div>
                  <div className="text-[#f9c80e]">{activeQuests.length}</div>
                </div>
              </div>

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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
