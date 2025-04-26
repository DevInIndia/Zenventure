"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  xp: number;
  streak: number;
  mood: string;
  health: number;
  mana: number;
}

export function TopBar({ xp, streak, mood, health, mana }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(2);

  // Calculate level based on XP (simple formula)
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100; // XP needed for next level

  return (
    <header className="h-20 bg-[#352f44] border-b-4 border-[#5c5470] flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-[#f9c80e] flex items-center justify-center text-black border-2 border-black">
              <span className="text-xs font-medium">LV{level}</span>
            </div>
            <div className="ml-2 text-xs text-[#dbd8e3]">XP: {xp}/100</div>
          </div>

          {/* Health Bar */}
          <div className="flex items-center">
            <span className="text-xs text-[#f9c80e] mr-2">HP</span>
            <div className="health-bar w-32">
              <div
                className="health-bar-fill"
                style={{ width: `${health}%` }}
              ></div>
            </div>
            <span className="text-xs ml-2">{health}/100</span>
          </div>

          {/* Mana Bar */}
          <div className="flex items-center">
            <span className="text-xs text-[#f9c80e] mr-2">MP</span>
            <div className="mana-bar w-32">
              <div
                className="mana-bar-fill"
                style={{ width: `${mana}%` }}
              ></div>
            </div>
            <span className="text-xs ml-2">{mana}/100</span>
          </div>
        </div>

        <Badge
          variant="outline"
          className="flex items-center gap-1 px-2 py-1 border-2 border-[#f86624] bg-[#5c5470] text-[#f86624]"
        >
          <span className="text-xs">🔥</span>
          <span className="text-xs font-medium">{streak} DAY STREAK</span>
        </Badge>

        <Badge
          variant="outline"
          className="flex items-center gap-1 px-2 py-1 border-2 border-[#43aa8b] bg-[#5c5470] text-[#43aa8b]"
        >
          <span>{mood}</span>
        </Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-[#f9c80e]" />
          ) : (
            <Moon className="h-5 w-5 text-[#f9c80e]" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-[#f9c80e]" />
          {notifications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 h-4 w-4 bg-[#f86624] flex items-center justify-center text-white text-[10px] border border-black"
            >
              {notifications}
            </motion.div>
          )}
        </Button>
      </div>
    </header>
  );
}
