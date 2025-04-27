"use client";

import { useEffect, useRef } from "react";
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

  // Legend data with rank levels and their descriptions
  const legendData = [
    { name: "Novice", color: "#FF6B6B", value: "0-20" },
    { name: "Apprentice", color: "#FFD166", value: "21-40" },
    { name: "Adept", color: "#06D6A0", value: "41-60" },
    { name: "Expert", color: "#118AB2", value: "61-80" },
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

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Mindful", "Productive", "Fit", "Discipline", "Balanced"],
        datasets: [
          {
            label: "Your Stats",
            data: [80, 60, 90, 75, 50], // <-- hardcoded dummy values to check visibility
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
    <div className="flex flex-col md:flex-row">
  <div className="h-80 flex-1">
    <canvas ref={chartRef} className="w-full h-full" />
    </div>
  
      {/* Legend container */}
      <div className="ml-auto mt-6 md:mt-0 md:ml-10 bg-[#3d3a4b] p-4 border-2 border-[#5c5470] rounded-lg w-full max-w-xs">
        <h3 className="text-[#f9c80e] text-base mb-4 font-bold tracking-wide">STAT LEVELS</h3>
        <div className="space-y-3">
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

    </div>
  );
  
}