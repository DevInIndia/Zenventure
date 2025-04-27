"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { Quest } from "@/lib/types";

interface QuestSelectionCardProps {
  quest: Quest;
  isSelected: boolean;
  onToggle: () => void;
}

export function QuestSelectionCard({
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
