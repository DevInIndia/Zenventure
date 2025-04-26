"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Dumbbell, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

type Goal = "productivity" | "fitness" | "mindfulness" | null;
type Level = "beginner" | "intermediate" | "expert" | null;

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<Goal>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>(null);
  const router = useRouter();

  const handleComplete = () => {
    // In a real app, we would save this data to a database
    localStorage.setItem("userGoal", selectedGoal || "");
    localStorage.setItem("userLevel", selectedLevel || "");
    router.push("/dashboard");
  };

  const goalOptions = [
    {
      id: "productivity",
      icon: Briefcase,
      label: "Scholar",
      description: "Masters of productivity and organization",
    },
    {
      id: "fitness",
      icon: Dumbbell,
      label: "Warrior",
      description: "Champions of physical strength and endurance",
    },
    {
      id: "mindfulness",
      icon: Brain,
      label: "Healer",
      description: "Experts of mental clarity and balance",
    },
  ];

  const levelOptions = [
    {
      id: "beginner",
      label: "Novice",
      description: "Just starting my adventure",
    },
    {
      id: "intermediate",
      label: "Adept",
      description: "I have some experience",
    },
    {
      id: "expert",
      label: "Master",
      description: "I seek the ultimate challenge",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="pixel-card bg-[#352f44] text-[#f0ece2] border-[#dbd8e3]">
          <CardHeader className="text-center border-b-4 border-[#5c5470] pb-4">
            <CardTitle className="text-xl text-[#f9c80e] mb-2">
              ZenVentures
            </CardTitle>
            <CardDescription className="text-[#f0ece2] text-sm">
              {step === 1 ? "SELECT YOUR CLASS" : "SELECT YOUR LEVEL"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {step === 1 ? (
              <div className="grid gap-4">
                {goalOptions.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    icon={goal.icon}
                    label={goal.label}
                    description={goal.description}
                    selected={selectedGoal === goal.id}
                    onClick={() => setSelectedGoal(goal.id as Goal)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {levelOptions.map((level) => (
                  <LevelCard
                    key={level.id}
                    label={level.label}
                    description={level.description}
                    selected={selectedLevel === level.id}
                    onClick={() => setSelectedLevel(level.id as Level)}
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t-4 border-[#5c5470] pt-4">
            {step === 1 ? (
              <Button
                className="w-full pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]"
                disabled={!selectedGoal}
                onClick={() => setStep(2)}
              >
                CONTINUE
              </Button>
            ) : (
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1 pixel-button bg-[#5c5470]"
                  onClick={() => setStep(1)}
                >
                  BACK
                </Button>
                <Button
                  className="flex-1 pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624]"
                  disabled={!selectedLevel}
                  onClick={handleComplete}
                >
                  START QUEST
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

function GoalCard({
  icon: Icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: any;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer transition-all ${
          selected
            ? "border-4 border-[#f9c80e] bg-[#5c5470]"
            : "border-4 border-[#5c5470] hover:border-[#dbd8e3]"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <div
            className={`p-2 rounded-none ${
              selected
                ? "bg-[#f9c80e] text-black"
                : "bg-[#5c5470] text-[#dbd8e3]"
            }`}
          >
            <Icon className="h-6 w-6 pixel-icon" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{label}</h3>
            <p className="text-xs text-[#dbd8e3]">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LevelCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`cursor-pointer transition-all ${
          selected
            ? "border-4 border-[#f9c80e] bg-[#5c5470]"
            : "border-4 border-[#5c5470] hover:border-[#dbd8e3]"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <h3 className="font-medium text-sm">{label}</h3>
          <p className="text-xs text-[#dbd8e3]">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
