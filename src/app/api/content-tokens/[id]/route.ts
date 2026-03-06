import { NextRequest, NextResponse } from "next/server";
import { API } from "@/lib/constants";

export const revalidate = 60;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [tokenRes, capTableRes] = await Promise.allSettled([
      fetch(`${API.path402}/tokens/${id}`, { next: { revalidate: 60 } }),
      fetch(`${API.path402}/token/cap-table`, { next: { revalidate: 300 } }),
    ]);

    const token = tokenRes.status === "fulfilled" && tokenRes.value.ok
      ? await tokenRes.value.json()
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 404 }
      );
    }

    const capTable = capTableRes.status === "fulfilled" && capTableRes.value.ok
      ? await capTableRes.value.json()
      : [];

    return NextResponse.json({
      token,
      capTable: Array.isArray(capTable) ? capTable : [],
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch token detail" },
      { status: 500 }
    );
  }
}
