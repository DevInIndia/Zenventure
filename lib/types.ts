export interface Quest {
  id: string;
  title: string;
  description: string;
  category: "productivity" | "fitness" | "mindfulness";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  estimatedTime: number;
  createdBy: "system" | "user";
  createdAt?: Date;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  goal: "productivity" | "fitness" | "mindfulness" | null;
  level: "beginner" | "intermediate" | "expert" | null;
  xp: number;
  streak: number;
  health: number;
  mana: number;
  mood: string;
  premadeQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  userQuests: Quest[];
  createdAt: Date;
  lastActive: Date;
}
