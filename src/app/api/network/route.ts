import { NextResponse } from "next/server";
import { API, TOKEN } from "@/lib/constants";

export const revalidate = 60;

export async function GET() {
  try {
    const [statsRes, tokensRes, x402Res, poolRes] = await Promise.allSettled([
      fetch(`${API.path402}/token/stats`, { next: { revalidate: 60 } }),
      fetch(`${API.path402}/tokens`, { next: { revalidate: 300 } }),
      fetch(`${API.path402}/x402/stats`, { next: { revalidate: 60 } }),
      fetch(`${API.pool}/network/stats`, { signal: AbortSignal.timeout(5000) }),
    ]);

    const stats = statsRes.status === "fulfilled" && statsRes.value.ok
      ? await statsRes.value.json()
      : null;

    const tokens = tokensRes.status === "fulfilled" && tokensRes.value.ok
      ? await tokensRes.value.json()
      : [];

    const x402 = x402Res.status === "fulfilled" && x402Res.value.ok
      ? await x402Res.value.json()
      : null;

    const pool = poolRes.status === "fulfilled" && poolRes.value.ok
      ? await poolRes.value.json()
      : null;

    const contentTokenList = Array.isArray(tokens)
      ? tokens.filter((t: { id?: string }) => t.id !== TOKEN.id)
      : [];

    const activeNodes = pool?.agents
      ? Object.values(pool.agents).filter((a: unknown) => {
          const agent = a as { status?: string };
          return agent.status === "active" || agent.status === "online";
        }).length
      : 0;

    return NextResponse.json({
      powSupply: stats?.supply ?? 0,
      powMaxSupply: TOKEN.maxSupply,
      powPercentMined: stats?.percentMined ?? 0,
      powHolders: stats?.holders ?? 0,
      contentTokens: contentTokenList.length,
      totalStaked: 0,
      totalRevenue: x402?.totalFees ?? 0,
      activeNodes,
      totalTransactions: stats?.height ?? 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch network overview" },
      { status: 500 }
    );
  }
}
