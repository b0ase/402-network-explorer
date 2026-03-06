export interface TokenStats {
  supply: number;
  price: number;
  holders: number;
  treasury: number;
  marketCap: number;
  percentMined: number;
  height: number;
}

export interface OnChainData {
  supply: number;
  pendingSupply: number;
  holders: number;
  txCount: number;
}

export interface Holder {
  address: string;
  balance: number;
  percentage: number;
  rank: number;
}

export interface Transaction {
  txid: string;
  type: string;
  amount: number;
  from: string;
  to: string;
  timestamp: number;
  blockHeight: number;
  confirmations: number;
}

export interface TxDetail {
  txid: string;
  blockHash: string;
  blockHeight: number;
  confirmations: number;
  time: number;
  size: number;
  fee: number;
  inputs: TxInput[];
  outputs: TxOutput[];
}

export interface TxInput {
  txid: string;
  vout: number;
  address: string;
  value: number;
  scriptSig: string;
}

export interface TxOutput {
  index: number;
  address: string;
  value: number;
  scriptPubKey: string;
  spent: boolean;
}

export interface TokenEntry {
  id: string;
  name: string;
  ticker: string;
  address: string;
  supply: number;
  price: number;
  holders: number;
  protocol: string;
}

export interface InscriptionStats {
  totalInscriptions: number;
  totalFees: number;
  chains: ChainStats[];
}

export interface ChainStats {
  chain: string;
  inscriptions: number;
  fees: number;
  lastActivity: number;
}

export interface AddressHistory {
  address: string;
  balance: number;
  totalReceived: number;
  totalSent: number;
  txCount: number;
  transactions: Transaction[];
}

export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  status?: "green" | "amber" | "blue";
}
