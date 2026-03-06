import { API } from "@/lib/constants";

interface RawToken {
  address: string;
  name: string;
  parent_address?: string;
  parent_share_bps?: number;
  issuer_handle?: string;
  total_supply?: number;
  treasury_balance?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface TreeNode {
  address: string;
  name: string;
  parent_address: string | null;
  parent_share_bps: number;
  issuer_handle: string;
  total_supply: number;
  treasury_balance: number;
  children: TreeNode[];
}

export async function GET() {
  try {
    const res = await fetch(`${API.path402}/tokens?limit=200`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to fetch tokens" }, { status: res.status });
    }

    const data = await res.json();
    const tokens: RawToken[] = Array.isArray(data) ? data : data.tokens ?? [];

    // Build adjacency map
    const nodeMap = new Map<string, TreeNode>();
    for (const t of tokens) {
      nodeMap.set(t.address, {
        address: t.address,
        name: t.name,
        parent_address: t.parent_address || null,
        parent_share_bps: t.parent_share_bps || 0,
        issuer_handle: t.issuer_handle || "",
        total_supply: t.total_supply || 0,
        treasury_balance: t.treasury_balance || 0,
        children: [],
      });
    }

    // Link children to parents
    const roots: TreeNode[] = [];
    for (const node of nodeMap.values()) {
      if (node.parent_address && nodeMap.has(node.parent_address)) {
        nodeMap.get(node.parent_address)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return Response.json({ tree: roots, total: tokens.length });
  } catch {
    return Response.json({ error: "Failed to build token tree" }, { status: 500 });
  }
}
