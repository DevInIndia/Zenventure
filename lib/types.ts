export interface Quest {
  id: string;
  title: string;
  description: string;
  category: "productivity" | "fitness" | "mindfulness";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  pointsReward: number;
  estimatedTime: number;
  createdBy: "system" | "user";
  createdAt?: Date;
  completedAt?: Date;
}

export interface ChainActivity {
  id: string;
  name: string;
  points: number;
  completed: boolean;
  timestamp?: Date;
}

export interface ChainReaction {
  id: string;
  name: string;
  description: string;
  activities: ChainActivity[];
  bonusPoints: number;
  isActive: boolean;
  completedAt?: Date;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: "entertainment" | "social" | "food" | "self-care" | "other";
  pointsCost: number;
  icon: string;
  available: boolean;
}

export interface UserStats {
  mindful: number;
  productive: number;
  fit: number;
  discipline: number;
  balanced: number;
}

export interface DailyStreak {
  date: string;
  completed: boolean;
  points: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  goal: "productivity" | "fitness" | "mindfulness" | null;
  level: "beginner" | "intermediate" | "expert" | null;
  xp: number;
  points: number;
  streak: number;
  currentStreak: number;
  longestStreak: number;
  health: number;
  mana: number;
  mood: string;
  premadeQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  userQuests: Quest[];
  chainReactions: ChainReaction[];
  completedChains: ChainReaction[];
  redeemedRewards: Reward[];
  stats: UserStats;
  streakHistory: DailyStreak[];
  createdAt: Date;
  lastActive: Date;
}
