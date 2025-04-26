"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Dumbbell, Brain, Briefcase } from "lucide-react";
import type { Quest } from "@/lib/types";

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showXpGain, setShowXpGain] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    setShowXpGain(true);

    // Hide XP gain animation after a delay
    setTimeout(() => {
      setShowXpGain(false);
      onComplete();
    }, 1500);
  };

  // Get icon based on category
  const getCategoryIcon = () => {
    switch (quest.category) {
      case "fitness":
        return <Dumbbell className="h-5 w-5 pixel-icon" />;
      case "mindfulness":
        return <Brain className="h-5 w-5 pixel-icon" />;
      case "productivity":
        return <Briefcase className="h-5 w-5 pixel-icon" />;
      default:
        return <Briefcase className="h-5 w-5 pixel-icon" />;
    }
  };

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
    <Card className="quest-scroll pixel-card overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardContent className={`p-4 pt-6 relative ${getCategoryBg()}`}>
        {/* Category Icon */}
        <div className="absolute top-0 left-4 -translate-y-1/2 p-2 bg-[#352f44] border-4 border-black">
          {getCategoryIcon()}
        </div>

        {/* Difficulty Badge */}
        <Badge
          variant="outline"
          className={`absolute top-4 right-4 capitalize pixel-badge ${getDifficultyColor()}`}
        >
          {quest.difficulty}
        </Badge>

        <div className="mt-2">
          <h3 className="font-semibold text-sm mb-2 text-[#f9c80e]">
            {quest.title}
          </h3>
          <p className="text-xs text-[#dbd8e3] mb-4">{quest.description}</p>

          <div className="flex items-center text-xs text-[#dbd8e3]">
            <Clock className="h-4 w-4 mr-1 pixel-icon" />
            <span>{quest.estimatedTime} min</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center bg-[#352f44] border-t-4 border-black">
        <div className="flex items-center">
          <Badge
            variant="secondary"
            className="bg-[#f9c80e] text-black border-2 border-black"
          >
            +{quest.xpReward} XP
          </Badge>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isCompleting}
          className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]"
        >
          {isCompleting ? <CheckCircle className="h-5 w-5 mr-1" /> : null}
          {isCompleting ? "DONE!" : "COMPLETE"}
        </Button>
      </CardFooter>

      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXpGain && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -50 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-[#f9c80e] bg-black/50 px-4 py-2 border-2 border-[#f9c80e]"
          >
            +{quest.xpReward} XP
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
