// src/libs/schemas/userSchema.ts
import { z } from "zod";

export const userSchema = z.object({
  uid: z.string(),          // Firebase user ID
  email: z.string().email(), // Firebase email
  name: z.string(),          // Firebase display name
  photoURL: z.string().url(), // Profile photo
  class: z.enum(["Warrior", "Mage", "Rogue"]), // Picked once at signup
  level: z.enum(["Novice", "Intermediate", "Expert"]), // Auto based on points
  points: z.number().int().nonnegative(),   // XP points earned
  createdAt: z.date(),       // Account creation timestamp
  updatedAt: z.date(),       // Last profile update
});
