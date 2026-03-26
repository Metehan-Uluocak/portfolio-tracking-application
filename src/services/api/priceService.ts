type PriceResponse = {
  symbol: string;
  price: number;
};

// Week 2: placeholder service contract. Week 5 will replace this with real provider integration.
export async function fetchLatestPrice(symbol: string): Promise<PriceResponse> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    symbol,
    price: Number((Math.random() * 1000 + 50).toFixed(2)),
  };
}
