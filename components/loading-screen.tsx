"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading world...");

  // Simulate loading progress
  useEffect(() => {
    const loadingTexts = [
      "Loading world...",
      "Generating quests...",
      "Calculating rewards...",
      "Preparing adventure...",
      "Almost ready...",
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });

      setLoadingText(
        loadingTexts[Math.floor(Math.random() * loadingTexts.length)]
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#222034] flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-4 text-center">
        {/* Pixelated Logo */}
        <div className="mb-8 pixel-art">
          <h1 className="text-4xl font-bold text-[#f9c80e] mb-2 pixel-text">
            ZENVENTURES
          </h1>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 pixel-chest"></div>
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-full h-8 bg-[#352f44] border-4 border-black mb-4 relative overflow-hidden">
          <motion.div
            className="h-full bg-[#f9c80e]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />

          {/* Pixelated blocks on top of loading bar */}
          <div className="absolute inset-0 pixel-loading-overlay"></div>
        </div>

        {/* Loading Text */}
        <p className="text-[#dbd8e3] pixel-text">{loadingText}</p>
        <p className="text-[#f9c80e] mt-2 pixel-text">
          {Math.floor(progress)}%
        </p>

        {/* Animated Pixel Character */}
        <div className="mt-8">
          <div className="pixel-character"></div>
        </div>
      </div>
    </div>
  );
}
