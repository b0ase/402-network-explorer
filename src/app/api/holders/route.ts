import { API, TOKEN } from "@/lib/constants";

export async function GET() {
  try {
    const res = await fetch(
      `${API.gorillaPool}/bsv20/id/${TOKEN.id}/holders`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch holders" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch holders" },
      { status: 500 }
    );
  }
}
