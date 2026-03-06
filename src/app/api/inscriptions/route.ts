import { API } from "@/lib/constants";

export async function GET() {
  try {
    const res = await fetch(`${API.path402}/x402/stats`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch inscription stats" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch inscription stats" },
      { status: 500 }
    );
  }
}
