import { AssetType, CurrencyCode } from '../../models/asset';

export type PriceResponse = {
  symbol: string;
  price: number;
  currency: CurrencyCode;
  source: 'yahoo' | 'coingecko';
  fetchedAt: string;
};

type ExchangeRateResponse = {
  rates?: Record<string, number>;
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        previousClose?: number;
      };
    }>;
  };
};

const CRYPTO_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  AVAX: 'avalanche-2',
  TRX: 'tron',
};

async function fetchFromYahoo(ticker: string): Promise<number | null> {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`,
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as YahooChartResponse;
  const meta = payload.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice ?? meta?.previousClose;

  return typeof price === 'number' && Number.isFinite(price) ? price : null;
}

async function fetchFromCoinGecko(symbol: string): Promise<number | null> {
  const id = CRYPTO_ID_MAP[symbol.toUpperCase()];
  if (!id) {
    return null;
  }

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`,
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as Record<string, { usd?: number }>;
  const price = payload[id]?.usd;
  return typeof price === 'number' && Number.isFinite(price) ? price : null;
}

function buildTickerCandidates(symbol: string, type: AssetType): string[] {
  const normalized = symbol.trim().toUpperCase();

  if (type === 'crypto') {
    const clean = normalized.replace(/-USD$/, '');
    return [`${clean}-USD`, clean];
  }

  if (type === 'gold') {
    return ['XAUUSD=X', 'GC=F'];
  }

  return [normalized, `${normalized}.IS`, `${normalized}.US`];
}

function inferCurrencyFromTicker(ticker: string): CurrencyCode {
  if (ticker.endsWith('.IS') || ticker.endsWith('=X') || ticker.includes('TRY')) {
    return 'TRY';
  }

  return 'USD';
}

export async function fetchUsdTryRate(): Promise<number> {
  const response = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!response.ok) {
    throw new Error('USD/TRY kuru alınamadı.');
  }

  const payload = (await response.json()) as ExchangeRateResponse;
  const rate = payload.rates?.TRY;
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
    throw new Error('USD/TRY kuru geçersiz.');
  }

  return rate;
}

export async function fetchLatestPrice(symbol: string, type: AssetType): Promise<PriceResponse> {
  const candidates = buildTickerCandidates(symbol, type);

  for (const ticker of candidates) {
    const price = await fetchFromYahoo(ticker);
    if (price !== null) {
      return {
        symbol,
        price,
        currency: inferCurrencyFromTicker(ticker),
        source: 'yahoo',
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  if (type === 'crypto') {
    const fallbackPrice = await fetchFromCoinGecko(symbol);
    if (fallbackPrice !== null) {
      return {
        symbol,
        price: fallbackPrice,
        currency: 'USD',
        source: 'coingecko',
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  throw new Error('Güncel fiyat alınamadı. Sembolü kontrol edip tekrar deneyin.');
}
