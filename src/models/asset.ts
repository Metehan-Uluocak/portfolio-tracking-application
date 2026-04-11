export type AssetType = 'stock' | 'etf' | 'gold' | 'crypto' | 'other';
export type CurrencyCode = 'TRY' | 'USD';

export interface Asset {
  id: string;
  userId: string;
  name: string;
  symbol: string;
  type: AssetType;
  quoteCurrency: CurrencyCode;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  buyDate: string;
  updatedAt: string;
}
