export type AssetType = 'stock' | 'etf' | 'gold' | 'crypto' | 'other';

export interface Asset {
  id: string;
  userId: string;
  name: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  buyDate: string;
  updatedAt: string;
}
