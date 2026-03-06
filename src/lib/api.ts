import { API, TOKEN } from "./constants";

async function fetchJSON<T>(url: string, revalidate = 60): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

// PATH402.com
export async function getTokenStats() {
  return fetchJSON(`${API.path402}/token/stats`, 60);
}

export async function getOnChainData() {
  return fetchJSON(`${API.path402}/token/onchain`, 60);
}

export async function getTokenHistory(limit = 50, offset = 0) {
  return fetchJSON(
    `${API.path402}/tokens/history?limit=${limit}&offset=${offset}`,
    60
  );
}

export async function getTokenRegistry() {
  return fetchJSON(`${API.path402}/tokens`, 300);
}

export async function getTokenDetail(address: string) {
  return fetchJSON(`${API.path402}/tokens/${address}`, 60);
}

export async function getInscriptionStats() {
  return fetchJSON(`${API.path402}/x402/stats`, 60);
}

// GorillaPool
export async function getGorillaPoolToken() {
  return fetchJSON(
    `${API.gorillaPool}/bsv20/id/${TOKEN.id}`,
    300
  );
}

export async function getHolders() {
  return fetchJSON(
    `${API.gorillaPool}/bsv20/id/${TOKEN.id}/holders`,
    300
  );
}

// WhatsOnChain
export async function getTxDetail(txid: string) {
  return fetchJSON(`${API.whatsOnChain}/tx/hash/${txid}`, 3600);
}

export async function getAddressHistory(address: string) {
  return fetchJSON(
    `${API.whatsOnChain}/address/${address}/history`,
    60
  );
}

export async function getAddressBalance(address: string) {
  return fetchJSON(
    `${API.whatsOnChain}/address/${address}/balance`,
    60
  );
}
