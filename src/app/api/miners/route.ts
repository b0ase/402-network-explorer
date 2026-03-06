// Hit Hetzner directly — pool.clawminer.store DNS currently points to Vercel
const POOL_URL = "http://135.181.103.181:3402/api/v1/network/stats";
const TIMEOUT_MS = 5000;

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(POOL_URL, {
      signal: controller.signal,
      next: { revalidate: 30 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return Response.json({ miners: [], aggregate: defaultAggregate() });
    }

    const data = await res.json();
    const agents = data.agents ?? [];

    const miners = agents.map((a: Record<string, unknown>) => ({
      node_id: a.id,
      name: a.name,
      is_online: a.is_online,
      trading_mode: a.trading_mode,
      last_heartbeat: a.last_heartbeat,
      mining: {
        is_mining: a.is_online === true || a.trading_mode !== "paused",
        hash_rate: 0,
        blocks_mined: 0,
      },
    }));

    const aggregate = {
      total_miners: data.total_agents ?? miners.length,
      active_miners: data.active_agents ?? 0,
      total_events: data.total_events ?? 0,
      total_blocks_mined: 0,
      total_hash_rate: 0,
    };

    return Response.json({ miners, aggregate });
  } catch {
    return Response.json({ miners: [], aggregate: defaultAggregate() });
  }
}

function defaultAggregate() {
  return {
    total_miners: 0,
    active_miners: 0,
    total_events: 0,
    total_blocks_mined: 0,
    total_hash_rate: 0,
  };
}
