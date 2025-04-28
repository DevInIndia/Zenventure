"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { UserStats } from "@/lib/types";

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface RadarChartProps {
  stats: UserStats;
}

export function RadarChart({ stats }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [userLevel, setUserLevel] = useState("Novice");

  // Updated Legend data: only Novice, Adept, Master
  const legendData = [
    { name: "Novice", color: "#FF6B6B", value: "0-40" },
    { name: "Adept", color: "#06D6A0", value: "41-80" },
    { name: "Master", color: "#9381FF", value: "81-100" },
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    let calculatedDiscipline = 0;
    let calculatedBalanced = 0;

    const totalStats = stats.mindful + stats.productive + stats.fit;

    if (totalStats > 0) {
      const mindfulPercent = stats.mindful / totalStats;
      const productivePercent = stats.productive / totalStats;
      const fitPercent = stats.fit / totalStats;

      const diffMindfulProductive = Math.abs(mindfulPercent - productivePercent);
      const diffMindfulFit = Math.abs(mindfulPercent - fitPercent);
      const diffProductiveFit = Math.abs(productivePercent - fitPercent);

      const avgDifference = (diffMindfulProductive + diffMindfulFit + diffProductiveFit) / 3;

      calculatedBalanced = Math.round((1 - avgDifference) * 100);
    }

    const currentStreak = 1; // Replace this with real streak value when available
    if (totalStats > 0) {
      const consistencyScore =
        (Math.min(stats.mindful, stats.productive, stats.fit) /
          Math.max(stats.mindful, stats.productive, stats.fit)) || 0;
      calculatedDiscipline = Math.min(100, Math.round(currentStreak * 5 + consistencyScore * 50));
    }

    const allStats = [
      stats.mindful,
      stats.productive,
      stats.fit,
      calculatedDiscipline,
      calculatedBalanced,
    ];

    // Determine overall user level
    const averageScore = allStats.reduce((acc, val) => acc + val, 0) / allStats.length;

    if (averageScore <= 40) {
      setUserLevel("Novice");
    } else if (averageScore <= 80) {
      setUserLevel("Adept");
    } else {
      setUserLevel("Master");
    }

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Mindful", "Productive", "Fit", "Discipline", "Balanced"],
        datasets: [
          {
            label: "Your Stats",
            data: allStats,
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 2,
            pointBackgroundColor: "#f9c80e",
            pointBorderColor: "#000",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(99, 102, 241, 1)",
            pointRadius: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            pointLabels: {
              color: "#dbd8e3",
              font: {
                size: 12,
              },
            },
            ticks: {
              backdropColor: "transparent",
              color: "#dbd8e3",
              showLabelBackdrop: false,
              stepSize: 20,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(53, 47, 68, 0.8)",
            titleColor: "#f9c80e",
            bodyColor: "#dbd8e3",
            borderColor: "#5c5470",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}/100`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="h-96 flex-1">
        <canvas ref={chartRef} className="w-full h-full" />
      </div>

      {/* Legend container */}
      <div className="flex flex-col justify-between bg-[#3d3a4b] p-6 border-2 border-[#5c5470] rounded-xl w-full max-w-xs h-80">
        <div>
          <h3 className="text-[#f9c80e] text-lg mb-4 font-bold tracking-wide">STAT LEVELS</h3>
          <div className="space-y-4">
            {legendData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 mr-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-[#dbd8e3]">{item.name}</span>
                </div>
                <span className="text-sm text-[#f9c80e]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current level display */}
        <div className="mt-4 text-center">
          <p className="text-[#dbd8e3] text-sm">Your Current Level:</p>
          <p className="text-[#f9c80e] text-xl font-bold">{userLevel}</p>
        </div>
      </div>
    </div>
  );
}

