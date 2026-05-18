import { AssetType, CurrencyCode } from './asset';

export interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: AssetType;
  lastPrice?: number;
  lastPriceCurrency?: CurrencyCode;
  updatedAt?: string;
  addedAt: string;
}
