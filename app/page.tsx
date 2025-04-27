"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Award, Zap, Target, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#222034] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] bg-repeat opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[#f9c80e] mb-4">
                ZENVENTURES
              </h1>
              <p className="text-xl md:text-2xl text-[#dbd8e3] mb-8">
                LEVEL UP YOUR LIFE
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <Link href="/auth">
                <Button className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624] text-lg px-8 py-6">
                  GAMIFY YOUR LIFE! <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Game Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-4xl mx-auto bg-[#352f44] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4"
          >
            <div className="aspect-video bg-[#222034] border-2 border-[#5c5470] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-[#f9c80e]">GAME PREVIEW</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#f9c80e] mb-12 text-center">
          GAME FEATURES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Award className="h-10 w-10 text-[#f9c80e]" />}
            title="QUESTS & REWARDS"
            description="Complete daily quests and earn XP to level up your character"
            delay={0.1}
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-[#f86624]" />}
            title="CHAIN REACTIONS"
            description="Link activities together for bonus points and special rewards"
            delay={0.2}
          />
          <FeatureCard
            icon={<Target className="h-10 w-10 text-[#43aa8b]" />}
            title="HABIT TRACKING"
            description="Build streaks and maintain your daily habits with visual progress"
            delay={0.3}
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-[#f9c80e]" />}
            title="CHARACTER GROWTH"
            description="Develop your character's stats based on your real-life achievements"
            delay={0.4}
          />
        </div>

        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="/auth">
              <Button className="pixel-button bg-[#f9c80e] text-black hover:bg-[#f86624] text-lg px-8 py-6">
                START YOUR ADVENTURE <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#352f44] border-t-4 border-[#5c5470] py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#dbd8e3]">
            © 2025 ZENVENTURES - LEVEL UP YOUR LIFE
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[#352f44] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-[#f9c80e] mb-2">{title}</h3>
        <p className="text-[#dbd8e3]">{description}</p>
      </div>
    </motion.div>
  );
}
