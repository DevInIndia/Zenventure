import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/gemini";
import type { UserProfile } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const userProfile = (await request.json()) as UserProfile;
    const insight = await generateInsight(userProfile);
    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Error generating insight:", error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}
