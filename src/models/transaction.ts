export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: string;
  userId: string;
  assetId: string;
  symbol: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  transactionDate: string;
}
