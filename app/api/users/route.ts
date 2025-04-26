// src/app/api/users/route.ts
import { db } from "@/lib/firebase";
import { userSchema } from "@/lib/schemas/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"; 

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
  }

  const userData = parsed.data;

  const userRef = doc(db, "users", userData.uid);

  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(), // server time
    updatedAt: serverTimestamp(),
  });

  return NextResponse.json({ message: "User created" });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: userSnap.data() });
}
