import { API } from "@/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  try {
    const [historyRes, balanceRes] = await Promise.all([
      fetch(`${API.whatsOnChain}/address/${address}/history`, {
        next: { revalidate: 60 },
      }),
      fetch(`${API.whatsOnChain}/address/${address}/balance`, {
        next: { revalidate: 60 },
      }),
    ]);

    const [history, balance] = await Promise.all([
      historyRes.ok ? historyRes.json() : [],
      balanceRes.ok ? balanceRes.json() : null,
    ]);

    return Response.json({ history, balance });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch address data" },
      { status: 500 }
    );
  }
}
