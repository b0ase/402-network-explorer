import { NextRequest } from "next/server";
import { detectSearchType } from "@/lib/format";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const type = detectSearchType(query);

  switch (type) {
    case "tx":
      return Response.json({ type: "tx", redirect: `/tx/${query}` });
    case "address":
      return Response.json({ type: "address", redirect: `/address/${query}` });
    case "token":
      return Response.json({
        type: "token",
        redirect: `/tokens/${query.replace("$", "")}`,
      });
    default:
      return Response.json({
        type: "unknown",
        redirect: `/tx/${query}`,
      });
  }
}
