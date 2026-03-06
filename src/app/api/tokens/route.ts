import { API } from "@/lib/constants";

export async function GET() {
  try {
    const res = await fetch(`${API.path402}/tokens`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch tokens" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
