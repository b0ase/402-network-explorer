import { NextResponse } from "next/server";
import { API } from "@/lib/constants";

export const revalidate = 60;

export async function GET() {
  try {
    const [x402Res, dividendsRes] = await Promise.allSettled([
      fetch(`${API.path402}/x402/stats`, { next: { revalidate: 60 } }),
      fetch(`${API.path402}/dividends/pending`, { next: { revalidate: 60 } }),
    ]);

    const x402 = x402Res.status === "fulfilled" && x402Res.value.ok
      ? await x402Res.value.json()
      : null;

    const dividends = dividendsRes.status === "fulfilled" && dividendsRes.value.ok
      ? await dividendsRes.value.json()
      : null;

    return NextResponse.json({
      totalRevenue: x402?.totalFees ?? 0,
      totalDistributed: dividends?.totalDistributed ?? 0,
      totalPending: dividends?.totalPending ?? 0,
      operatorFees: x402?.operatorFees ?? 0,
      deposits: Array.isArray(x402?.deposits) ? x402.deposits : [],
      distributions: Array.isArray(dividends?.distributions) ? dividends.distributions : [],
    });
  } catch {
    return NextResponse.json({
      totalRevenue: 0,
      totalDistributed: 0,
      totalPending: 0,
      operatorFees: 0,
      deposits: [],
      distributions: [],
    });
  }
}
