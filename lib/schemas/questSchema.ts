import { z } from "zod";

export const questSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(["mindfulness", "fitness", "productivity"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  xpReward: z.number(),
  estimatedTime: z.number(),
  createdBy: z.enum(["mock", "user"]),
});

// Optional: TypeScript type for Quest
export type Quest = z.infer<typeof questSchema>;
