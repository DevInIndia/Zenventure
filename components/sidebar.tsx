"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ScrollText, Brain, Dumbbell, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("home");

  const menuItems = [
    { id: "home", icon: Home, label: "HOME", href: "/dashboard" },
    {
      id: "quests",
      icon: ScrollText,
      label: "QUESTS",
      href: "/dashboard/quests",
    },
    { id: "mind", icon: Brain, label: "MIND", href: "/dashboard/mind" },
    { id: "body", icon: Dumbbell, label: "BODY", href: "/dashboard/body" },
    {
      id: "streaks",
      icon: Target,
      label: "STREAKS",
      href: "/dashboard/streaks",
    },
  ];

  return (
    <aside className="w-16 md:w-64 bg-[#352f44] border-r-4 border-[#5c5470]">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b-4 border-[#5c5470] flex items-center justify-center md:justify-start">
          <span className="hidden md:block text-xl font-bold text-[#f9c80e]">
            ZENVENTURES
          </span>
          <span className="block md:hidden text-xl font-bold text-[#f9c80e]">
            LQ
          </span>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start relative ${
                      activeItem === item.id
                        ? "bg-[#5c5470] text-[#f9c80e]"
                        : "text-[#dbd8e3] hover:bg-[#5c5470] hover:text-[#f9c80e]"
                    }`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {activeItem === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#f9c80e]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <item.icon className="h-5 w-5 mr-2 pixel-icon" />
                    <span className="hidden md:inline-block text-xs">
                      {item.label}
                    </span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t-4 border-[#5c5470]">
          <Link href="/profile" passHref>
            <Button
              variant="ghost"
              className="w-full justify-start bg-[#5c5470] hover:bg-[#6c6480] text-[#dbd8e3]"
              onClick={() => setActiveItem("profile")}
            >
              <div className="h-8 w-8 bg-[#f9c80e] flex items-center justify-center text-black mr-2 border-2 border-black">
                <span className="text-xs font-medium">LV1</span>
              </div>
              <span className="hidden md:inline-block text-xs">CHARACTER</span>
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
