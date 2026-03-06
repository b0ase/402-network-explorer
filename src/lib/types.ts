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
  status?: "green" | "amber" | "blue" | "purple";
}

export interface ContentToken {
  id: string;
  ticker: string;
  name: string;
  issuer: string;
  supply: number;
  maxSupply: number;
  holders: number;
  pricingModel: "fixed" | "bonding_curve" | "alice_bond" | "free";
  price: number;
  protocol: string;
  createdAt: number;
  staked: number;
  dividendYield: number;
}

export interface StakeEntry {
  address: string;
  tokenId: string;
  ticker: string;
  amount: number;
  percentage: number;
  since: number;
  pendingDividends: number;
}

export interface RevenueStats {
  totalRevenue: number;
  totalDistributed: number;
  totalPending: number;
  operatorFees: number;
  deposits: RevenueDeposit[];
  distributions: RevenueDistribution[];
}

export interface RevenueDeposit {
  txid: string;
  amount: number;
  tokenId: string;
  ticker: string;
  timestamp: number;
}

export interface RevenueDistribution {
  txid: string;
  amount: number;
  tokenId: string;
  ticker: string;
  recipients: number;
  timestamp: number;
}

export interface NetworkOverview {
  powSupply: number;
  powMaxSupply: number;
  powPercentMined: number;
  powHolders: number;
  contentTokens: number;
  totalStaked: number;
  totalRevenue: number;
  activeNodes: number;
  totalTransactions: number;
}
