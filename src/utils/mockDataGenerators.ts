
import { CryptoData, PortfolioBenchmark } from "@/types/trading";

// Generate mock crypto data
export const generateMockCryptoData = (count: number = 10): CryptoData[] => {
  const cryptos = [
    { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
    { id: "ethereum", name: "Ethereum", symbol: "eth" },
    { id: "ripple", name: "Ripple", symbol: "xrp" },
    { id: "cardano", name: "Cardano", symbol: "ada" },
    { id: "solana", name: "Solana", symbol: "sol" },
    { id: "polkadot", name: "Polkadot", symbol: "dot" },
    { id: "dogecoin", name: "Dogecoin", symbol: "doge" },
    { id: "avalanche", name: "Avalanche", symbol: "avax" },
    { id: "litecoin", name: "Litecoin", symbol: "ltc" },
    { id: "chainlink", name: "Chainlink", symbol: "link" }
  ];

  return cryptos.slice(0, count).map((crypto, index) => ({
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    image: `https://cryptoicons.org/api/${crypto.symbol}/200`,
    current_price: 1000 + Math.random() * 50000,
    market_cap: 1000000000 + Math.random() * 1000000000000,
    market_cap_rank: index + 1,
    fully_diluted_valuation: 2000000000 + Math.random() * 2000000000000,
    total_volume: 500000000 + Math.random() * 500000000,
    high_24h: 1100 + Math.random() * 52000,
    low_24h: 900 + Math.random() * 48000,
    price_change_24h: (Math.random() * 2000) - 1000,
    price_change_percentage_24h: (Math.random() * 20) - 10,
    market_cap_change_24h: (Math.random() * 20000000000) - 10000000000,
    market_cap_change_percentage_24h: (Math.random() * 20) - 10,
    circulating_supply: 10000000 + Math.random() * 100000000,
    total_supply: 15000000 + Math.random() * 150000000,
    max_supply: 20000000 + Math.random() * 200000000,
    ath: 2000 + Math.random() * 60000,
    ath_change_percentage: (Math.random() * 500) - 100,
    ath_date: new Date().toISOString(),
    atl: 1 + Math.random() * 1000,
    atl_change_percentage: Math.random() * 10000,
    atl_date: new Date(2018, 0, 1).toISOString(),
    roi: Math.random() > 0.3 ? {
      times: Math.random() * 100,
      currency: "usd",
      percentage: Math.random() * 10000
    } : null,
    last_updated: new Date().toISOString(),
    price: 1000 + Math.random() * 50000,
    marketCap: 1000000000 + Math.random() * 1000000000000,
    rank: index + 1,
    volume: 500000000 + Math.random() * 500000000,
    priceChange: (Math.random() * 2000) - 1000,
    changePercent: (Math.random() * 20) - 10
  }));
};

// Generate mock benchmark data
export const generateMockBenchmarkData = (days: number = 30): { date: string; value: number; performance: number; }[] => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let baseValue = 10000;
  let lastValue = baseValue;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Random daily change between -3% and +3%
    const dailyChange = (Math.random() * 0.06) - 0.03;
    const newValue = lastValue * (1 + dailyChange);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: newValue,
      performance: ((newValue / baseValue) - 1) * 100
    });
    
    lastValue = newValue;
  }
  
  return data;
};

// Generate mock portfolio benchmarks
export const generateMockBenchmarks = (): PortfolioBenchmark[] => {
  return [
    {
      id: "portfolio",
      name: "Your Portfolio",
      symbol: "PORTFOLIO",
      color: "#3B82F6",
      type: "crypto",
      performance: [5, 8, 12, 7, 3, 10],
      lastUpdated: new Date().toISOString(),
      data: generateMockBenchmarkData(90)
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      color: "#F7931A",
      type: "crypto",
      performance: [3, 6, 10, 8, 1, 5],
      lastUpdated: new Date().toISOString(),
      data: generateMockBenchmarkData(90)
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      color: "#627EEA",
      type: "crypto",
      performance: [6, 9, 14, 5, -2, 8],
      lastUpdated: new Date().toISOString(),
      data: generateMockBenchmarkData(90)
    },
    {
      id: "sp500",
      name: "S&P 500",
      symbol: "SPX",
      color: "#4C51BF",
      type: "index",
      performance: [2, 4, 7, 3, 1, 6],
      lastUpdated: new Date().toISOString(),
      data: generateMockBenchmarkData(90)
    }
  ];
};
