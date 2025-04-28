"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/firebase";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  xp: number;
  streak: number;
  points?: number;
  mood: string;
  health: number;
  mana: number;
}

export function TopBar({
  xp,
  points,
  streak,
  mood,
  health,
  mana,
}: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(2);
  const router = useRouter();

  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);

  // Calculate level based on XP (simple formula)
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100; // XP needed for next level

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName || "User",
          email: user.email || "user@example.com",
          image: user.photoURL || "",
        });
      } else {
        setUser(null);
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="h-20 bg-[#352f44] border-b-4 border-[#5c5470] flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col space-y-1 w-full">
          <div className="flex items-center">
            <div className="h-8 w-12 bg-[#f9c80e] flex items-center justify-center text-black border-2 border-black">
              <span className="text-xs font-medium">LV{level}</span>
            </div>
            <div className="ml-2 text-xs text-[#dbd8e3]">
              XP: {levelProgress}/100
            </div>
          </div>

          {/* Health Bar */}
          {/* <div className="flex items-center">
            <span className="text-xs text-[#f9c80e] mr-2">HP</span>
            <div className="health-bar w-32">
              <div
                className="health-bar-fill"
                style={{ width: `${health}%` }}
              ></div>
            </div>
            <span className="text-xs ml-2">{health}/100</span>
          </div> */}

          {/* Mana Bar */}
          {/* <div className="flex items-center">
            <span className="text-xs text-[#f9c80e] mr-2">MP</span>
            <div className="mana-bar w-32">
              <div
                className="mana-bar-fill"
                style={{ width: `${mana}%` }}
              ></div>
            </div>
            <span className="text-xs ml-2">{mana}/100</span>
          </div> */}
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

        <Badge
          variant="outline"
          className="flex items-center gap-1 px-2 py-1 border-2 border-[#f9c80e] bg-[#5c5470] text-[#f9c80e]"
        >
          <span className="text-xs">💰</span>
          <span className="text-xs font-medium">{points} POINTS</span>
        </Badge>
      </div>

      <div className="flex items-center space-x-2">
        {/* <Button
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
        </Button> */}

        {/* <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title="Sign Out"
        >
          <LogOut className="h-5 w-5 text-[#f9c80e]" />
        </Button> */}
        {user && (
          <div className="px-4 py-2 border-gray-300">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
