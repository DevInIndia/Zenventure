import { GoogleGenerativeAI } from "@google/generative-ai";
import type { UserProfile, Quest } from "@/lib/types";

// Initialize the Gemini model
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey)
  throw new Error("GEMINI_API_KEY is not set in environment variables");
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

/**
 * Generate AI insights based on user profile data
 */
export async function generateInsight(
  userProfile: UserProfile
): Promise<string> {
  try {
    // Extract relevant data from user profile (same as before)
    const {
      xp,
      stats,
      currentStreak,
      longestStreak,
      completedQuests,
      activeQuests,
      streakHistory,
    } = userProfile;

    // Calculate category-specific XP (same as before)
    const mindfulXP = stats.mindful;
    const productiveXP = stats.productive;
    const fitXP = stats.fit;
    const totalCategoryXP = mindfulXP + productiveXP + fitXP;

    // Calculate percentages for each category (same as before)
    const mindfulPercentage =
      totalCategoryXP > 0 ? Math.round((mindfulXP / totalCategoryXP) * 100) : 0;
    const productivePercentage =
      totalCategoryXP > 0
        ? Math.round((productiveXP / totalCategoryXP) * 100)
        : 0;
    const fitPercentage =
      totalCategoryXP > 0 ? Math.round((fitXP / totalCategoryXP) * 100) : 0;

    // Get recently completed quests (last 7) (same as before)
    const recentCompletedQuests = completedQuests
      .sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 7);

    // Calculate quest completion by category (same as before)
    const questsByCategory = completedQuests.reduce((acc, quest) => {
      if (!acc[quest.category]) {
        acc[quest.category] = 0;
      }
      acc[quest.category]++;
      return acc;
    }, {} as Record<string, number>);

    // Calculate streak data (same as before)
    const currentDate = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const streakData = last7Days.map((date) => {
      const streakDay = streakHistory.find((day) => day.date === date);
      return {
        date,
        completed: streakDay?.completed || false,
        points: streakDay?.points || 0,
      };
    });

    // Count completed days in the last week (same as before)
    const completedDaysLastWeek = streakData.filter(
      (day) => day.completed
    ).length;

    // Create a structured data object for the AI (same as before)
    const userData = {
      xp,
      level: Math.floor(xp / 100) + 1,
      currentStreak,
      longestStreak,
      stats: {
        mindful: stats.mindful,
        productive: stats.productive,
        fit: stats.fit,
        discipline: stats.discipline,
        balanced: stats.balanced,
      },
      categoryPercentages: {
        mindful: mindfulPercentage,
        productive: productivePercentage,
        fit: fitPercentage,
      },
      completedQuestsCount: completedQuests.length,
      activeQuestsCount: activeQuests.length,
      questsByCategory,
      completedDaysLastWeek,
      recentCompletedQuests: recentCompletedQuests.map((quest) => ({
        title: quest.title,
        category: quest.category,
        difficulty: quest.difficulty,
        xpReward: quest.xpReward,
      })),
    };

    // Create the prompt for Gemini (same as before)
    const prompt = `
You are an AI assistant for a gamified habit-tracking app called LifeQuest. 
Your task is to analyze user data and provide a personalized, insightful, and motivational message.

The app uses RPG game mechanics where users complete quests to earn XP and improve their stats in three main categories:
- Mindful (meditation, reading, mental wellness)
- Productive (work tasks, studying, organization)
- Fit (exercise, physical health)

Users also have stats for:
- Discipline (based on streak maintenance)
- Balanced (having good distribution across categories)

USER DATA:
${JSON.stringify(userData, null, 2)}

Based on this data, generate ONE short, personalized insight (1-2 sentences) that is:
1. Specific to their data and progress
2. Encouraging and positive in tone
3. Actionable with a subtle suggestion if appropriate
4. Written in a slightly playful RPG-style tone (but not overly gamified)

Focus on ONE of these aspects (choose the most relevant):
- Progress in a specific category
- Streak maintenance
- Balance between categories
- Recent quest completion patterns
- Areas for improvement
- Achievement celebration

DO NOT mention specific numbers from the data directly. Instead, interpret trends and patterns.
DO NOT use generic phrases like "Keep up the good work!" without specific context.
DO NOT exceed 2 sentences.
`;

    // Generate the insight using Gemini (updated to use Google's SDK)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error generating insight with Gemini:", error);
    return "I couldn't analyze your quest data right now. Please try again later.";
  }
}

/**
 * Generate a custom quest recommendation based on user profile
 */
export async function generateQuestRecommendation(
  userProfile: UserProfile
): Promise<Partial<Quest> | null> {
  try {
    // Extract relevant data (same as before)
    const { stats, completedQuests } = userProfile;

    // Find the weakest category (same as before)
    const categories = [
      { name: "mindfulness", value: stats.mindful },
      { name: "productivity", value: stats.productive },
      { name: "fitness", value: stats.fit },
    ];

    categories.sort((a, b) => a.value - b.value);
    const weakestCategory = categories[0].name;

    // Get recently completed quests in this category (same as before)
    const recentCategoryQuests = completedQuests
      .filter((q) => q.category === weakestCategory)
      .slice(0, 5)
      .map((q) => q.title);

    const prompt = `
You are an AI assistant for a gamified habit-tracking app called LifeQuest.
Your task is to generate a personalized quest recommendation for a user.

The user's weakest category is: ${weakestCategory}
Recent quests they've completed in this category: ${JSON.stringify(
      recentCategoryQuests
    )}

Generate a new quest with:
1. A catchy title (max 6 words)
2. A brief description (1 sentence)
3. An appropriate difficulty (easy, medium, or hard)
4. An estimated time to complete (in minutes)

The quest should be:
- Specific and actionable
- Different from their recent quests
- Appropriate for the ${weakestCategory} category
- Realistic and achievable

Return ONLY a JSON object with these fields:
{
  "title": "Quest Title",
  "description": "Quest description",
  "category": "${weakestCategory}",
  "difficulty": "easy|medium|hard",
  "estimatedTime": number
}
`;

    // Generate the quest recommendation (updated to use Google's SDK)
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response (same as before)
    try {
      const questData = JSON.parse(text);
      return {
        ...questData,
        xpReward: calculateXpReward(
          questData.difficulty,
          questData.estimatedTime
        ),
      };
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", e);
      return {
        title: "Mystery Quest",
        description: "A quest shrouded in mystery awaits you.",
        category: weakestCategory as "mindfulness" | "productivity" | "fitness",
        difficulty: "medium",
        estimatedTime: 15,
        xpReward: 25,
      };
    }
  } catch (error) {
    console.error("Error generating quest recommendation:", error);
    return null;
  }
}

// Helper function to calculate XP reward based on difficulty and time (same as before)
function calculateXpReward(difficulty: string, estimatedTime: number): number {
  const basePoints =
    difficulty === "easy"
      ? 10
      : difficulty === "medium"
      ? 20
      : difficulty === "hard"
      ? 30
      : 15;

  const timeMultiplier = Math.min(1 + estimatedTime / 60, 2);
  return Math.round(basePoints * timeMultiplier);
}
