// src/app/api/users/route.ts
import { db } from "@/src/firebaseConfig"; // your Firestore init
import { userSchema } from "@/lib/schemas/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
  }

  const userData = parsed.data;
  await db.collection("users").doc(userData.uid).set({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ message: "User created" });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  const userDoc = await db.collection("users").doc(uid).get();

  if (!userDoc.exists) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: userDoc.data() });
}
