"use client";

import type { DailyStreak } from "@/lib/types";

interface StreakCalendarProps {
  streakHistory: DailyStreak[];
}

export function StreakCalendar({ streakHistory }: StreakCalendarProps) {
  // Get current month
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Get days in current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create array of days for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const dateStr = date.toISOString().split("T")[0];

    // Find if we have streak data for this day
    const streakDay = streakHistory.find((day) => day.date === dateStr);

    return {
      date: i + 1,
      completed: streakDay ? streakDay.completed : false,
      points: streakDay ? streakDay.points : 0,
    };
  });

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{currentMonth}</h3>
      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for alignment */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}

        {days.map((day, i) => (
          <div
            key={i}
            className={`h-10 rounded-md flex items-center justify-center text-sm font-medium relative ${
              day.completed
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500"
            }`}
          >
            {day.date}
            {day.points > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f9c80e] text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {day.points > 9 ? "9+" : day.points}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-indigo-100 dark:bg-indigo-900/30"></div>
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800/50"></div>
          <span className="text-sm text-muted-foreground">Missed</span>
        </div>
      </div>
    </div>
  );
}
