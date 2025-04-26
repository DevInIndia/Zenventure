export interface Quest {
  id: string;
  title: string;
  description: string;
  category: "productivity" | "fitness" | "mindfulness";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  estimatedTime: number;
}
