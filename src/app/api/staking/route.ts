import { NextResponse } from "next/server";
import { API } from "@/lib/constants";

export const revalidate = 60;

export async function GET() {
  try {
    const [capTableRes, stakeRes] = await Promise.allSettled([
      fetch(`${API.path402}/token/cap-table`, { next: { revalidate: 300 } }),
      fetch(`${API.path402}/stake`, { next: { revalidate: 60 } }),
    ]);

    const capTable = capTableRes.status === "fulfilled" && capTableRes.value.ok
      ? await capTableRes.value.json()
      : [];

    const stake = stakeRes.status === "fulfilled" && stakeRes.value.ok
      ? await stakeRes.value.json()
      : null;

    return NextResponse.json({
      stakers: Array.isArray(capTable) ? capTable : [],
      totalStaked: stake?.totalStaked ?? 0,
      totalDividendsPending: stake?.totalPending ?? 0,
      averageYield: stake?.averageYield ?? 0,
    });
  } catch {
    return NextResponse.json({
      stakers: [],
      totalStaked: 0,
      totalDividendsPending: 0,
      averageYield: 0,
    });
  }
}
