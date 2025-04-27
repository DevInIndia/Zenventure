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
import type { Quest, UserProfile } from "./types";
import { mockQuests } from "./mock-data";

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

  // Only create if user doesn't exist
  if (!userDoc.exists()) {
    const newUser: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || "Adventurer",
      email: user.email || "",
      photoURL: user.photoURL || "",
      goal: goal as "productivity" | "fitness" | "mindfulness" | null,
      level: level as "beginner" | "intermediate" | "expert" | null,
      xp: 0,
      streak: 0,
      health: 80,
      mana: 60,
      mood: "😊",
      premadeQuests: [],
      activeQuests: [],
      completedQuests: [],
      userQuests: [],
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

  // If user exists, return existing data
  return userDoc.data() as UserProfile;
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

  await updateDoc(userRef, {
    premadeQuests: arrayUnion(...quests),
    activeQuests: arrayUnion(...quests),
  });

  return quests;
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

  // If it's a user-created quest, add to userQuests as well
  if (quest.createdBy === "user") {
    await updateDoc(userRef, {
      activeQuests: arrayUnion(quest),
      userQuests: arrayUnion(quest),
    });
  } else {
    await updateDoc(userRef, {
      activeQuests: arrayUnion(quest),
    });
  }

  return quest;
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
  const newLevel = Math.floor(newXP / 100) + 1;

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

  // Remove from active quests and add to completed quests
  await updateDoc(userRef, {
    xp: newXP,
    health: newHealth,
    mana: newMana,
    activeQuests: arrayRemove(quest),
    completedQuests: arrayUnion({
      ...quest,
      completedAt: Timestamp.now(),
    }),
  });

  return {
    newXP,
    newLevel,
    newHealth,
    newMana,
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
      return { ...quest, estimatedTime: newTime };
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
  questData: Omit<Quest, "id" | "createdBy" | "createdAt">
) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  // Create a new quest with a unique ID
  const newQuest: Quest = {
    ...questData,
    id: crypto.randomUUID(),
    createdBy: "user",
    createdAt: new Date(),
  };

  // Add to active quests and user quests
  await updateDoc(userRef, {
    activeQuests: arrayUnion(newQuest),
    userQuests: arrayUnion(newQuest),
  });

  return newQuest;
}

// 10. Update user goal and level
export async function updateUserGoalAndLevel(goal: string, level: string) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    goal: goal,
    level: level,
    updatedAt: serverTimestamp(),
  });
}

// 11. Update user streak
export async function updateUserStreak(streak: number) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    streak: streak,
    updatedAt: serverTimestamp(),
  });

  return streak;
}

// 12. Update user mood
export async function updateUserMood(mood: string) {
  const uid = getUserId();
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    mood: mood,
    updatedAt: serverTimestamp(),
  });

  return mood;
}
