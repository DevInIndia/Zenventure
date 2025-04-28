"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, Lightbulb } from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface AiInsightBoxProps {
  userProfile: UserProfile | null;
  onRefresh?: () => void;
}

export function AiInsightBox({ userProfile, onRefresh }: AiInsightBoxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [characterState, setCharacterState] = useState<
    "idle" | "thinking" | "speaking"
  >("idle");

  const fetchInsight = useCallback(async () => {
    if (!userProfile) return;

    setIsLoading(true);
    setCharacterState("thinking");

    try {
      const response = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) throw new Error("Failed to fetch insight");

      const { insight } = await response.json();
      setInsight(insight);
      setCharacterState("speaking");

      setTimeout(() => setCharacterState("idle"), 5000);
    } catch (error) {
      console.error("Error fetching insight:", error);
      setInsight(
        "I couldn't generate an insight right now. Please try again later."
      );
      setCharacterState("idle");
    } finally {
      setIsLoading(false);
      onRefresh?.();
    }
  }, [userProfile, onRefresh]);

  // Initial fetch and setup interval
  useEffect(() => {
    // Fetch immediately on mount
    fetchInsight();

    // Set up interval for refreshing every 5 minutes
    const intervalId = setInterval(fetchInsight, 5 * 60 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchInsight]);

  return (
    <Card className="pixel-card bg-[#352f44] border-4 border-black mb-6 overflow-hidden">
      <CardHeader className="border-b-4 border-[#5c5470] pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-[#f9c80e] flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-[#f9c80e]" />
          AI INSIGHTS
        </CardTitle>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-[#5c5470] border-2 border-[#dbd8e3] hover:bg-[#6c6480]"
          onClick={fetchInsight}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 text-[#dbd8e3] ${
              isLoading ? "animate-spin" : ""
            }`}
          />
        </Button>
      </CardHeader>
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-4">
          {/* Pixelated AI Character */}
          <div className="w-16 h-16 shrink-0 relative">
            <div className="absolute inset-0">
              <PixelatedAiCharacter state={characterState} />
            </div>
          </div>

          {/* Insight Content */}
          <div className="flex-1 min-h-[60px] flex items-center">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#dbd8e3] flex items-center"
                >
                  <div className="pixel-dots-loading mr-2"></div>
                  Analyzing your quest data...
                </motion.div>
              ) : (
                <motion.div
                  key="insight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[#dbd8e3]"
                >
                  {insight ||
                    "I'll analyze your quest data to provide personalized insights."}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pixelated decorative elements */}
        <div className="absolute bottom-2 right-2">
          <Lightbulb className="h-5 w-5 text-[#f9c80e] opacity-50" />
        </div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#f9c80e]"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#f9c80e]"></div>
      </CardContent>
    </Card>
  );
}

// PixelatedAiCharacter component remains the same as in your original file
interface PixelatedAiCharacterProps {
  state: "idle" | "thinking" | "speaking";
}

function PixelatedAiCharacter({ state }: PixelatedAiCharacterProps) {
  return (
    <div className="w-full h-full relative">
      {/* Base robot head */}
      <div className="w-full h-full bg-[#43aa8b] border-4 border-black relative overflow-hidden">
        {/* Eyes */}
        <div className="absolute top-3 left-2 w-2 h-2 bg-black"></div>
        <div className="absolute top-3 right-2 w-2 h-2 bg-black"></div>

        {/* Mouth - changes based on state */}
        {state === "idle" && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black"></div>
        )}
        {state === "thinking" && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full"></div>
        )}
        {state === "speaking" && (
          <motion.div
            animate={{ height: ["2px", "4px", "2px"] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-black"
          ></motion.div>
        )}

        {/* Antenna */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-black"></div>
        <motion.div
          animate={
            state === "thinking"
              ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }
              : state === "speaking"
              ? { rotate: [-5, 5, -5] }
              : {}
          }
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#f9c80e] border-2 border-black rounded-full"
        ></motion.div>

        {/* Thinking animation */}
        {state === "thinking" && (
          <div className="absolute top-0 right-0">
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                staggerChildren: 0.2,
              }}
              className="flex"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                className="w-1 h-1 bg-[#f9c80e] mr-1"
              ></motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                className="w-1 h-1 bg-[#f9c80e] mr-1"
              ></motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: 0.4 }}
                className="w-1 h-1 bg-[#f9c80e]"
              ></motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
