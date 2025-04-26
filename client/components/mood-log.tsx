"use client";

import { Card } from "@/components/ui/card";

export function MoodLog() {
  // Mock data for the mood log
  const moodData = [
    { date: "Mon", mood: "😊", note: "Feeling productive today!" },
    { date: "Tue", mood: "😀", note: "Great workout session!" },
    { date: "Wed", mood: "😐", note: "Neutral day, nothing special." },
    { date: "Thu", mood: "🙂", note: "Completed all my tasks." },
    { date: "Fri", mood: "😄", note: "Weekend is coming!" },
    { date: "Sat", mood: "😁", note: "Relaxing weekend." },
    { date: "Sun", mood: "😌", note: "Feeling refreshed for the week." },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Last 7 Days</h3>
      </div>

      <div className="grid gap-3">
        {moodData.map((entry, i) => (
          <Card
            key={i}
            className="p-3 flex items-center gap-4 border-slate-200 dark:border-slate-700"
          >
            <div className="text-3xl">{entry.mood}</div>
            <div>
              <p className="font-medium">{entry.date}</p>
              <p className="text-sm text-muted-foreground">{entry.note}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
