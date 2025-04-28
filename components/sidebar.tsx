"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Target, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: "home", icon: Home, label: "HOME", href: "/dashboard" },
    {
      id: "streaks",
      icon: Target,
      label: "STREAKS",
      href: "/dashboard/streaks",
    },
    { id: "/rewards", icon: Gift, label: "REWARDS", href: "/rewards" },
  ];

  const getActiveItemId = () => {
    const sortedMenuItems = [...menuItems].sort(
      (a, b) => b.href.length - a.href.length
    );

    const activeItem = sortedMenuItems.find((item) =>
      pathname.startsWith(item.href)
    );

    if (pathname === "/profile") return "profile"; // Special case for profile

    return activeItem ? activeItem.id : "";
  };

  const activeItemId = getActiveItemId();

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
                    className={`w-full justify-start relative ${activeItemId === item.id
                        ? "bg-[#5c5470] text-[#f9c80e]"
                        : "text-[#dbd8e3] hover:bg-[#5c5470] hover:text-[#f9c80e]"
                      }`}
                  >
                    {activeItemId === item.id && (
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
              className={`w-full justify-start relative ${activeItemId === "profile"
                  ? "bg-[#5c5470] text-[#f9c80e]"
                  : "text-[#dbd8e3] hover:bg-[#5c5470] hover:text-[#f9c80e]"
                }`}
            >
              {activeItemId === "profile" && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#f9c80e]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              {/* <div className="h-8 w-12 bg-[#f9c80e] flex items-center justify-center text-black mr-2 border-2 border-black">
                <span className="text-xs font-medium">LV1</span>
              </div> */}
              <span className="hidden md:inline-block text-xs">CHARACTER</span>
              <img
                src="/favicon.ico" // replace with your favicon path
                alt="Character Icon"
                className="h-10 w-10"
              />
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
