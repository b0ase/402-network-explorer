import { API, TOKEN } from "@/lib/constants";

export async function GET() {
  try {
    const [statsRes, onchainRes, gpRes] = await Promise.all([
      fetch(`${API.path402}/token/stats`, { next: { revalidate: 60 } }),
      fetch(`${API.path402}/token/onchain`, { next: { revalidate: 60 } }),
      fetch(`${API.gorillaPool}/bsv20/id/${TOKEN.id}`, {
        next: { revalidate: 300 },
      }),
    ]);

    const [stats, onchain, gp] = await Promise.all([
      statsRes.ok ? statsRes.json() : null,
      onchainRes.ok ? onchainRes.json() : null,
      gpRes.ok ? gpRes.json() : null,
    ]);

    return Response.json({ stats, onchain, gorillaPool: gp });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
