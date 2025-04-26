"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function XPGraph() {
  // Mock data for the XP graph
  const data = [
    { day: "Mon", xp: 50 },
    { day: "Tue", xp: 80 },
    { day: "Wed", xp: 45 },
    { day: "Thu", xp: 100 },
    { day: "Fri", xp: 65 },
    { day: "Sat", xp: 130 },
    { day: "Sun", xp: 90 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis dataKey="day" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="xp"
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 6, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 8, fill: "#4F46E5", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
