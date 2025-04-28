import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Quest, UserProfile, UserStats, DailyStreak } from "./types";
import { mockQuests } from "./mock-data";
import { mockRewards } from "./mock-rewards";
import { defaultChainReactions } from "./chain-reactions";

// Helper to get current user ID
function getUserId() {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is logged in.");
  return user.uid;
}

// 1. Create a new user profile
export async function createUserProfile(goal: string, level: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is logged in.");

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  // If user already exists, return early
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }

  // Only create profile if user doesn't exist
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const initialStats: UserStats = {
    mindful: 0,
    productive: 0,
    fit: 0,
    discipline: 0,
    balanced: 0,
  };

  const initialStreakHistory: DailyStreak[] = [
    { date: todayStr, completed: false, points: 0 },
  ];

  const newUser: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || "Adventurer",
    email: user.email || "",
    photoURL: user.photoURL || "",
    goal: goal as "productivity" | "fitness" | "mindfulness" | null,
    level: level as "beginner" | "intermediate" | "expert" | null,
    xp: 0,
    points: 0,
    streak: 0,
    currentStreak: 0,
    longestStreak: 0,
    health: 80,
    mana: 60,
    mood: "😊",
    premadeQuests: [],
    activeQuests: [],
    completedQuests: [],
    userQuests: [],
    chainReactions: defaultChainReactions,
    completedChains: [],
    redeemedRewards: [],
    stats: initialStats,
    streakHistory: initialStreakHistory,
    createdAt: new Date(),
    lastActive: new Date(),
  };

  await setDoc(userRef, {
    ...newUser,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  });

  return newUser;
}

// 2. Get user profile
export async function getUserProfile() {
  try {
    const uid = getUserId();
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update last active timestamp
      await updateDoc(userRef, {
        lastActive: serverTimestamp(),
      });

      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// 3. Check if user exists
export async function userExists() {
  try {
    const uid = getUserId();
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    return false;
  }
}

// 4. Add premade quests for user
export async function addPremadeQuests(quests: Quest[]) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  // Add points reward to each quest
  const questsWithPoints = quests.map((quest) => ({
    ...quest,
    pointsReward: calculatePointsReward(quest),
  }));

  await updateDoc(userRef, {
    premadeQuests: arrayUnion(...questsWithPoints),
    activeQuests: arrayUnion(...questsWithPoints),
  });

  return questsWithPoints;
}

// Helper function to calculate points reward based on quest properties
export function calculatePointsReward(quest: Quest): number {
  // Convert minutes to hours (minimum 15 minutes = 0.25 hours)
  const hoursSpent = Math.max(quest.estimatedTime / 60, 0.25);
  // Cap at 4 hours max as per requirements
  const effectiveHours = Math.min(hoursSpent, 4); 

  // Base points based on difficulty
  let basePoints = 0;
  switch (quest.difficulty) {
    case "easy":
      basePoints = 3 * effectiveHours; // Linear scaling for easy
      break;
    case "medium":
      basePoints = 5 * effectiveHours; // Linear scaling for medium
      break;
    case "hard":
      basePoints = 8 * effectiveHours; // Linear scaling for hard
      break;
  }

  // Goal Gradient - Progressive bonuses
  let gradientBonus = 0;
  if (effectiveHours >= 1) gradientBonus += 4;  // Hour 1 bonus
  if (effectiveHours >= 2) gradientBonus += 5;  // Hour 2 bonus
  if (effectiveHours >= 3) gradientBonus += 7;  // Hour 3 bonus
  if (effectiveHours >= 4) gradientBonus += 10; // Hour 4 bonus + daily bonus

  // Category multiplier
  let categoryMultiplier = 1;
  if (quest.category === "fitness") categoryMultiplier = 1.2;
  if (quest.category === "mindfulness") categoryMultiplier = 1.1;

  // Final calculation
  return Math.round((basePoints + gradientBonus) * categoryMultiplier);
}

// 5. Get available quests (quests not in user's premade or active quests)
export async function getAvailableQuests() {
  try {
    const userProfile = await getUserProfile();

    if (!userProfile) return mockQuests;

    // Get IDs of quests the user already has
    const userQuestIds = [
      ...(userProfile.premadeQuests || []).map((q) => q.id),
      ...(userProfile.activeQuests || []).map((q) => q.id),
      ...(userProfile.completedQuests || []).map((q) => q.id),
    ];

    // Filter out quests the user already has
    return mockQuests.filter((quest) => !userQuestIds.includes(quest.id));
  } catch (error) {
    console.error("Error getting available quests:", error);
    return mockQuests;
  }
}

// 6. Add a quest to active quests
export async function addActiveQuest(quest: Quest) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  // Ensure quest has points reward
  const questWithPoints = {
    ...quest,
    pointsReward: quest.pointsReward || calculatePointsReward(quest),
  };

  // If it's a user-created quest, add to userQuests as well
  if (quest.createdBy === "user") {
    await updateDoc(userRef, {
      activeQuests: arrayUnion(questWithPoints),
      userQuests: arrayUnion(questWithPoints),
    });
  } else {
    await updateDoc(userRef, {
      activeQuests: arrayUnion(questWithPoints),
    });
  }

  return questWithPoints;
}

// 7. Complete a quest
export async function completeQuest(quest: Quest) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User data not found");
  }

  const userData = userDoc.data() as UserProfile;
  const newXP = userData.xp + quest.xpReward;
  const newPoints =
    userData.points + (quest.pointsReward || calculatePointsReward(quest));

  // Update health and mana based on quest category
  let healthBonus = 0;
  let manaBonus = 0;

  if (quest.category === "fitness") {
    healthBonus = 10;
  } else if (quest.category === "mindfulness") {
    manaBonus = 15;
  }

  const newHealth = Math.min(userData.health + healthBonus, 100);
  const newMana = Math.min(userData.mana + manaBonus, 100);

  // Update stats based on quest category
  const stats = { ...userData.stats };
  if (quest.category === "mindfulness") {
    stats.mindful += quest.xpReward;
  } else if (quest.category === "productivity") {
    stats.productive += quest.xpReward;
  } else if (quest.category === "fitness") {
    stats.fit += quest.xpReward;
  }

// Check if stats are balanced
const totalStats = stats.mindful + stats.productive + stats.fit;
if (totalStats > 0) {
  const mindfulPercent = stats.mindful / totalStats;
  const productivePercent = stats.productive / totalStats;
  const fitPercent = stats.fit / totalStats;

  // Calculate the differences between each pair
  const diffMindfulProductive = Math.abs(mindfulPercent - productivePercent);
  const diffMindfulFit = Math.abs(mindfulPercent - fitPercent);
  const diffProductiveFit = Math.abs(productivePercent - fitPercent);

  // Average the differences
  const avgDifference = (diffMindfulProductive + diffMindfulFit + diffProductiveFit) / 3;

  // Lower avgDifference means stats are closer -> more balanced points
  const balanceBonus = Math.max(0, Math.round((1 - avgDifference) * 10)); // Scale to 0-10 points

  stats.balanced += balanceBonus;
}


  // Update streak
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Check if we already completed a quest today
  const streakHistory = [...(userData.streakHistory || [])];
  const todayIndex = streakHistory.findIndex((day) => day.date === todayStr);

  if (todayIndex >= 0) {
    // Update today's entry
    streakHistory[todayIndex].completed = true;
    streakHistory[todayIndex].points +=
      quest.pointsReward || calculatePointsReward(quest);
  } else {
    // Add today's entry
    streakHistory.push({
      date: todayStr,
      completed: true,
      points: quest.pointsReward || calculatePointsReward(quest),
    });

    // Check if yesterday has an entry and was completed
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const yesterdayIndex = streakHistory.findIndex(
      (day) => day.date === yesterdayStr
    );
    const yesterdayCompleted =
      yesterdayIndex >= 0 && streakHistory[yesterdayIndex].completed;

    // Update current streak
    let currentStreak = userData.currentStreak;
    if (yesterdayCompleted) {
      currentStreak += 1;
    } else {
      currentStreak = 1; // Reset streak if yesterday was missed
    }

    // Update longest streak if needed
    const longestStreak = Math.max(userData.longestStreak || 0, currentStreak);

    // Update discipline stat based on streak
    stats.discipline = Math.min(
      100,
      Math.max(stats.discipline, currentStreak * 5)
    );

    // Remove from active quests and add to completed quests
    await updateDoc(userRef, {
      xp: newXP,
      points: newPoints,
      health: newHealth,
      mana: newMana,
      stats: stats,
      currentStreak: currentStreak,
      longestStreak: longestStreak,
      streakHistory: streakHistory,
      activeQuests: arrayRemove(quest),
      completedQuests: arrayUnion({
        ...quest,
        completedAt: Timestamp.now(),
      }),
    });

    return {
      newXP,
      newPoints,
      newHealth,
      newMana,
      currentStreak,
      stats,
    };
  }

  // Remove from active quests and add to completed quests
  await updateDoc(userRef, {
    xp: newXP,
    points: newPoints,
    health: newHealth,
    mana: newMana,
    stats: stats,
    streakHistory: streakHistory,
    activeQuests: arrayRemove(quest),
    completedQuests: arrayUnion({
      ...quest,
      completedAt: Timestamp.now(),
    }),
  });

  return {
    newXP,
    newPoints,
    newHealth,
    newMana,
    stats,
  };
}

// 8. Update quest time
export async function updateQuestTime(questId: string, newTime: number) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User data not found");
  }

  const userData = userDoc.data() as UserProfile;

  // Find the quest in active quests
  const activeQuests = userData.activeQuests || [];
  const updatedQuests = activeQuests.map((quest) => {
    if (quest.id === questId) {
      // Recalculate points reward based on new time
      const updatedQuest = {
        ...quest,
        estimatedTime: newTime,
        pointsReward: calculatePointsReward({
          ...quest,
          estimatedTime: newTime,
        }),
      };
      return updatedQuest;
    }
    return quest;
  });

  // Update active quests
  await updateDoc(userRef, {
    activeQuests: updatedQuests,
  });

  return updatedQuests;
}

// 9. Create a custom quest
export async function createCustomQuest(
  questData: Omit<Quest, "id" | "createdBy" | "createdAt" | "pointsReward">
) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  // Create a new quest with a unique ID
  const newQuest: Quest = {
    ...questData,
    id: crypto.randomUUID(),
    createdBy: "user",
    createdAt: new Date(),
    pointsReward: calculatePointsReward(questData as Quest),
  };

  // Add to active quests and user quests
  await updateDoc(userRef, {
    activeQuests: arrayUnion(newQuest),
    userQuests: arrayUnion(newQuest),
  });

  return newQuest;
}

// 10. Complete a chain activity
export async function completeChainActivity(
  chainId: string,
  activityId: string
) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User data not found");
  }

  const userData = userDoc.data() as UserProfile;
  const chainReactions = [...userData.chainReactions];

  // Find the chain
  const chainIndex = chainReactions.findIndex((chain) => chain.id === chainId);
  if (chainIndex === -1) {
    throw new Error("Chain not found");
  }

  const chain = chainReactions[chainIndex];

  // Find the activity
  const activityIndex = chain.activities.findIndex(
    (activity) => activity.id === activityId
  );
  if (activityIndex === -1) {
    throw new Error("Activity not found");
  }

  // Mark activity as completed
  chain.activities[activityIndex].completed = true;
  chain.activities[activityIndex].timestamp = new Date();

  // Check if all activities in the chain are completed
  const allCompleted = chain.activities.every((activity) => activity.completed);

  // Calculate points earned
  const activityPoints = chain.activities[activityIndex].points;
  let totalPoints = activityPoints;
  let bonusPoints = 0;

  if (allCompleted) {
    bonusPoints = chain.bonusPoints;
    totalPoints += bonusPoints;

    // Mark chain as completed
    chain.isActive = false;
    chain.completedAt = new Date();

    // Add to completed chains
    await updateDoc(userRef, {
      chainReactions: chainReactions,
      completedChains: arrayUnion(chain),
      points: userData.points + totalPoints,
    });
  } else {
    // Just update the chain
    await updateDoc(userRef, {
      chainReactions: chainReactions,
      points: userData.points + activityPoints,
    });
  }

  return {
    chain,
    activityPoints,
    bonusPoints,
    totalPoints,
    allCompleted,
  };
}

// 11. Reset a chain
export async function resetChain(chainId: string) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User data not found");
  }

  const userData = userDoc.data() as UserProfile;
  const chainReactions = [...userData.chainReactions];

  // Find the chain
  const chainIndex = chainReactions.findIndex((chain) => chain.id === chainId);
  if (chainIndex === -1) {
    throw new Error("Chain not found");
  }

  // Reset all activities
  chainReactions[chainIndex].activities.forEach((activity) => {
    activity.completed = false;
    activity.timestamp = undefined;
  });

  // Mark chain as active
  chainReactions[chainIndex].isActive = true;
  chainReactions[chainIndex].completedAt = undefined;

  // Update chains
  await updateDoc(userRef, {
    chainReactions: chainReactions,
  });

  return chainReactions[chainIndex];
}

// 12. Get available rewards
export async function getAvailableRewards() {
  try {
    const userProfile = await getUserProfile();

    if (!userProfile) return mockRewards;

    // Get IDs of rewards the user already redeemed
    const redeemedRewardIds = (userProfile.redeemedRewards || []).map(
      (r) => r.id
    );

    // Filter out rewards the user already redeemed and mark as available based on points
    return mockRewards.map((reward) => ({
      ...reward,
      available:
        !redeemedRewardIds.includes(reward.id) &&
        userProfile.points >= reward.pointsCost,
    }));
  } catch (error) {
    console.error("Error getting available rewards:", error);
    return mockRewards;
  }
}

// 13. Redeem a reward
export async function redeemReward(rewardId: string) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User data not found");
  }

  const userData = userDoc.data() as UserProfile;

  // Find the reward
  const reward = mockRewards.find((r) => r.id === rewardId);
  if (!reward) {
    throw new Error("Reward not found");
  }

  // Check if user has enough points
  if (userData.points < reward.pointsCost) {
    throw new Error("Not enough points");
  }

  // Add reward to redeemed rewards and deduct points
  await updateDoc(userRef, {
    redeemedRewards: arrayUnion({
      ...reward,
      redeemedAt: Timestamp.now(),
    }),
    points: userData.points - reward.pointsCost,
  });

  return {
    reward,
    remainingPoints: userData.points - reward.pointsCost,
  };
}

// 14. Update user goal and level
export async function updateUserGoalAndLevel(goal: string, level: string) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    goal: goal,
    level: level,
    updatedAt: serverTimestamp(),
  });
}

// 15. Update user streak
export async function updateUserStreak(streak: number) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    streak: streak,
    updatedAt: serverTimestamp(),
  });

  return streak;
}

// 16. Update user mood
export async function updateUserMood(mood: string) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    mood: mood,
    updatedAt: serverTimestamp(),
  });

  return mood;
}
