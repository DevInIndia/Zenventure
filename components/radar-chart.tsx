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
            data: [
              Math.min(stats.mindful / 10, 100),
              Math.min(stats.productive / 10, 100),
              Math.min(stats.fit / 10, 100),
              Math.min(stats.discipline, 100),
              Math.min(stats.balanced, 100),
            ],
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
    <div className="h-80">
      <canvas ref={chartRef} />
    </div>
  );
}
