import { Asset, CurrencyCode } from '../models/asset';

function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode, usdTryRate: number): number {
  if (from === to) {
    return amount;
  }

  if (from === 'USD' && to === 'TRY') {
    return amount * usdTryRate;
  }

  return amount / usdTryRate;
}

function getAssetCurrency(asset: Asset): CurrencyCode {
  return asset.quoteCurrency ?? 'TRY';
}

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

export function calculatePortfolioTotalsInCurrency(assets: Asset[], targetCurrency: CurrencyCode, usdTryRate: number) {
  const convertedAssets = assets.map((asset) => {
    const sourceCurrency = getAssetCurrency(asset);

    return {
      ...asset,
      currentPrice: convertCurrency(asset.currentPrice, sourceCurrency, targetCurrency, usdTryRate),
      averageBuyPrice: convertCurrency(asset.averageBuyPrice, sourceCurrency, targetCurrency, usdTryRate),
    };
  });

  const totals = calculatePortfolioTotals(convertedAssets);

  return {
    ...totals,
    currency: targetCurrency,
    usdTryRate,
  };
}
