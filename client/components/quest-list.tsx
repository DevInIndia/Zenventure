"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QuestCard } from "@/components/quest-card";
import type { Quest } from "@/lib/types";

interface QuestListProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
}

export function QuestList({ quests, onCompleteQuest }: QuestListProps) {
  // Group quests by category
  const groupedQuests = quests.reduce((acc, quest) => {
    if (!acc[quest.category]) {
      acc[quest.category] = [];
    }
    acc[quest.category].push(quest);
    return acc;
  }, {} as Record<string, Quest[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedQuests).map(([category, categoryQuests]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg text-[#f9c80e] uppercase border-b-2 border-[#5c5470] pb-2">
            {category} Quests
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {categoryQuests.map((quest) => (
                <motion.div
                  key={quest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestCard
                    quest={quest}
                    onComplete={() => onCompleteQuest(quest.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
