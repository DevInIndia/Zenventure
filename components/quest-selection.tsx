"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Brain, Briefcase, Check } from "lucide-react";
import type { Quest } from "@/lib/types";

interface QuestSelectionProps {
  quests: Quest[];
  onComplete: (selectedQuests: Quest[]) => void;
}

export function QuestSelection({ quests, onComplete }: QuestSelectionProps) {
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);

  const toggleQuest = (questId: string) => {
    if (selectedQuests.includes(questId)) {
      setSelectedQuests(selectedQuests.filter((id) => id !== questId));
    } else {
      setSelectedQuests([...selectedQuests, questId]);
    }
  };

  const handleComplete = () => {
    const selected = quests.filter((quest) =>
      selectedQuests.includes(quest.id)
    );
    onComplete(selected);
  };

  // Group quests by category
  const groupedQuests = quests.reduce((acc, quest) => {
    if (!acc[quest.category]) {
      acc[quest.category] = [];
    }
    acc[quest.category].push(quest);
    return acc;
  }, {} as Record<string, Quest[]>);

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fitness":
        return <Dumbbell className="h-6 w-6 text-[#f86624]" />;
      case "mindfulness":
        return <Brain className="h-6 w-6 text-[#43aa8b]" />;
      case "productivity":
        return <Briefcase className="h-6 w-6 text-[#f9c80e]" />;
      default:
        return <Briefcase className="h-6 w-6 text-[#f9c80e]" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#222034] bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <Card className="pixel-card bg-[#352f44] text-[#f0ece2] border-[#dbd8e3]">
          <CardHeader className="text-center border-b-4 border-[#5c5470] pb-4">
            <CardTitle className="text-xl text-[#f9c80e] mb-2">
              CHOOSE YOUR QUESTS
            </CardTitle>
            <CardDescription className="text-[#f0ece2] text-sm">
              Select the quests you want to tackle on your adventure
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {Object.entries(groupedQuests).map(
                ([category, categoryQuests]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <h2 className="text-lg text-[#f9c80e] uppercase">
                        {category} Quests
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryQuests.map((quest) => (
                        <QuestSelectionCard
                          key={quest.id}
                          quest={quest}
                          isSelected={selectedQuests.includes(quest.id)}
                          onToggle={() => toggleQuest(quest.id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t-4 border-[#5c5470] pt-4 flex justify-between items-center">
            <div className="text-[#dbd8e3]">
              <span className="text-[#f9c80e]">{selectedQuests.length}</span>{" "}
              quests selected
            </div>
            <Button
              className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]"
              disabled={selectedQuests.length === 0}
              onClick={handleComplete}
            >
              BEGIN ADVENTURE
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

interface QuestSelectionCardProps {
  quest: Quest;
  isSelected: boolean;
  onToggle: () => void;
}

function QuestSelectionCard({
  quest,
  isSelected,
  onToggle,
}: QuestSelectionCardProps) {
  // Get difficulty badge color
  const getDifficultyColor = () => {
    switch (quest.difficulty) {
      case "easy":
        return "bg-[#43aa8b] text-black border-black";
      case "medium":
        return "bg-[#f9c80e] text-black border-black";
      case "hard":
        return "bg-[#f86624] text-black border-black";
      default:
        return "bg-[#5c5470] text-[#dbd8e3] border-black";
    }
  };

  // Get category background
  const getCategoryBg = () => {
    switch (quest.category) {
      case "fitness":
        return "bg-[#f86624]/20";
      case "mindfulness":
        return "bg-[#43aa8b]/20";
      case "productivity":
        return "bg-[#f9c80e]/20";
      default:
        return "bg-[#5c5470]/20";
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer transition-all ${
          isSelected
            ? "border-4 border-[#f9c80e] bg-[#5c5470]"
            : "border-4 border-[#5c5470] hover:border-[#dbd8e3]"
        }`}
        onClick={onToggle}
      >
        <CardContent className={`p-4 relative ${getCategoryBg()}`}>
          <div className="absolute top-2 right-2">
            {isSelected && <Check className="h-5 w-5 text-[#f9c80e]" />}
          </div>

          <Badge
            variant="outline"
            className={`capitalize pixel-badge ${getDifficultyColor()} mb-2`}
          >
            {quest.difficulty}
          </Badge>

          <h3 className="font-semibold text-sm mb-2 text-[#f9c80e]">
            {quest.title}
          </h3>
          <p className="text-xs text-[#dbd8e3] mb-2">{quest.description}</p>

          <div className="flex justify-between items-center mt-2 text-xs text-[#dbd8e3]">
            <span>{quest.estimatedTime} min</span>
            <Badge
              variant="secondary"
              className="bg-[#f9c80e] text-black border-2 border-black"
            >
              +{quest.xpReward} XP
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
