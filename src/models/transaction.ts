export type TransactionType = 'buy' | 'sell';

export interface Transaction {
  id: string;
  assetId: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  transactionDate: string;
}
