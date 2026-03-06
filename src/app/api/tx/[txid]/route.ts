import { API } from "@/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ txid: string }> }
) {
  const { txid } = await params;

  try {
    const res = await fetch(`${API.whatsOnChain}/tx/hash/${txid}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch transaction" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
