"use client";

export function StreakCalendar() {
  // Mock data for the streak calendar
  const days = Array.from({ length: 30 }, (_, i) => ({
    date: i + 1,
    completed: Math.random() > 0.3, // 70% chance of completion
  }));

  // Current month
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

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
        {Array.from({ length: 2 }, (_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}

        {days.map((day, i) => (
          <div
            key={i}
            className={`h-10 rounded-md flex items-center justify-center text-sm font-medium ${
              day.completed
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500"
            }`}
          >
            {day.date}
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
