import { API } from "@/lib/constants";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = searchParams.get("limit") || "50";
  const offset = searchParams.get("offset") || "0";

  try {
    const res = await fetch(
      `${API.path402}/tokens/history?limit=${limit}&offset=${offset}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch transactions" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
