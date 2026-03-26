import { Asset } from '../models/asset';

export function calculateAssetValue(asset: Asset): number {
  return asset.quantity * asset.currentPrice;
}

export function calculateAssetCost(asset: Asset): number {
  return asset.quantity * asset.averageBuyPrice;
}

export function calculatePortfolioTotals(assets: Asset[]) {
  const totalValue = assets.reduce((sum, asset) => sum + calculateAssetValue(asset), 0);
  const totalCost = assets.reduce((sum, asset) => sum + calculateAssetCost(asset), 0);
  const totalProfit = totalValue - totalCost;
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalProfit,
    totalProfitPercent,
  };
}
