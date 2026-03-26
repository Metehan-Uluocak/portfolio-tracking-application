import { Asset } from '../models/asset';

export const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    userId: 'user-1',
    name: 'Turk Hava Yollari',
    symbol: 'THYAO',
    type: 'stock',
    quantity: 15,
    averageBuyPrice: 260,
    currentPrice: 277.5,
    buyDate: '2026-03-01',
    updatedAt: '2026-03-22',
  },
  {
    id: 'asset-2',
    userId: 'user-1',
    name: 'Gram Altin',
    symbol: 'XAU-TRY',
    type: 'gold',
    quantity: 3.2,
    averageBuyPrice: 3020,
    currentPrice: 3110,
    buyDate: '2026-02-20',
    updatedAt: '2026-03-22',
  },
];
