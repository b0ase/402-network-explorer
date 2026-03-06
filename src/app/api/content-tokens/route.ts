import { NextResponse } from "next/server";
import { API, TOKEN } from "@/lib/constants";

export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(`${API.path402}/tokens`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const tokens = await res.json();
    const contentTokens = Array.isArray(tokens)
      ? tokens.filter((t: { id?: string }) => t.id !== TOKEN.id)
      : [];

    return NextResponse.json(contentTokens);
  } catch {
    return NextResponse.json([]);
  }
}
