const SCAN_PORTS = [8402, 8403, 8404, 8405, 8406, 8407, 8408, 8409, 8410];
const TIMEOUT_MS = 1500;

interface MinerHealth {
  node_id: string;
  status: string;
  version: string;
  uptime_ms: number;
  peers: number;
}

interface MinerStatus {
  node_id: string;
  mining: {
    blocks_mined: number;
    hash_rate: number;
    difficulty: number;
    is_mining: boolean;
    last_block: string;
    mempool_size: number;
    miner_address: string;
  };
  peers: { connected: number; known: number };
  headers: {
    chain_tip: number;
    highest_height: number;
    is_syncing: boolean;
    total_headers: number;
  };
  tokens: { known: number };
  portfolio: {
    total_value: number;
    total_spent: number;
    total_revenue: number;
    total_pnl: number;
  };
  uptime_ms: number;
}

async function probePort(port: number): Promise<{
  port: number;
  health: MinerHealth | null;
  status: MinerStatus | null;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const healthRes = await fetch(`http://127.0.0.1:${port}/health`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!healthRes.ok) return { port, health: null, status: null };
    const health = await healthRes.json();

    // Confirm it's actually a ClawMiner
    if (!health.node_id || !health.version) {
      return { port, health: null, status: null };
    }

    // Get full status
    const statusController = new AbortController();
    const statusTimeout = setTimeout(() => statusController.abort(), TIMEOUT_MS);
    const statusRes = await fetch(`http://127.0.0.1:${port}/status`, {
      signal: statusController.signal,
      cache: "no-store",
    });
    clearTimeout(statusTimeout);

    const status = statusRes.ok ? await statusRes.json() : null;

    return { port, health, status };
  } catch {
    return { port, health: null, status: null };
  }
}

export async function GET() {
  const results = await Promise.all(SCAN_PORTS.map(probePort));

  const miners = results
    .filter((r) => r.health !== null)
    .map((r) => ({
      port: r.port,
      node_id: r.health!.node_id,
      version: r.health!.version,
      uptime_ms: r.status?.uptime_ms ?? r.health!.uptime_ms,
      mining: r.status?.mining ?? null,
      peers: r.status?.peers ?? { connected: r.health!.peers, known: 0 },
      headers: r.status?.headers ?? null,
      tokens: r.status?.tokens ?? null,
      portfolio: r.status?.portfolio ?? null,
    }));

  const aggregate = {
    total_miners: miners.length,
    total_blocks_mined: miners.reduce(
      (sum, m) => sum + (m.mining?.blocks_mined ?? 0),
      0
    ),
    total_hash_rate: miners.reduce(
      (sum, m) => sum + (m.mining?.hash_rate ?? 0),
      0
    ),
    active_miners: miners.filter((m) => m.mining?.is_mining).length,
  };

  return Response.json({ miners, aggregate });
}
