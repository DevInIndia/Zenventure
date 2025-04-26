// src/app/api/quests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { questSchema } from "@/lib/schemas/questSchema";
import { z } from "zod";

// GET: Fetch User's Quests
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized - Missing userId" }, { status: 401 });
  }

  try {
    const userQuestRef = collection(db, "users", userId, "quests");
    const snapshot = await getDocs(userQuestRef);

    const quests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(quests, { status: 200 });
  } catch (error) {
    console.error("Error fetching quests:", error);
    return NextResponse.json({ error: "Failed to fetch quests" }, { status: 500 });
  }
}

// POST: Create a New Quest
export async function POST(req: NextRequest) {
  const body = await req.json();

  const postSchema = questSchema.extend({
    userId: z.string(), // Add userId in POST body
  });

  const validation = postSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid quest data" }, { status: 400 });
  }

  const { userId, ...questData } = validation.data;

  try {
    const userQuestRef = collection(db, "users", userId, "quests");

    const newQuest = await addDoc(userQuestRef, questData);

    return NextResponse.json({ id: newQuest.id, ...questData }, { status: 201 });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json({ error: "Failed to create quest" }, { status: 500 });
  }
}
