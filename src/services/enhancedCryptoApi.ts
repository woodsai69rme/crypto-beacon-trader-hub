
import { CoinOption } from '@/types/trading';

// Mock data for our enhanced crypto API
export async function searchCoins(query: string): Promise<CoinOption[]> {
  // In a real implementation, this would call a real API
  // For this demo, we're using mock data
  
  const allCoins: CoinOption[] = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 69420,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      value: "bitcoin",
      label: "Bitcoin (BTC)"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3210,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 142.5,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      value: "solana",
      label: "Solana (SOL)"
    },
    { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.45,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      value: "cardano",
      label: "Cardano (ADA)"
    },
    { 
      id: "ripple", 
      name: "XRP", 
      symbol: "XRP", 
      price: 0.61,
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      value: "ripple",
      label: "XRP (XRP)"
    },
    { 
      id: "dogecoin", 
      name: "Dogecoin", 
      symbol: "DOGE", 
      price: 0.138,
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      value: "dogecoin",
      label: "Dogecoin (DOGE)"
    },
    { 
      id: "polkadot", 
      name: "Polkadot", 
      symbol: "DOT", 
      price: 7.85,
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      value: "polkadot",
      label: "Polkadot (DOT)"
    },
    { 
      id: "chainlink", 
      name: "Chainlink", 
      symbol: "LINK", 
      price: 14.32,
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink.png",
      value: "chainlink",
      label: "Chainlink (LINK)"
    },
    { 
      id: "uniswap", 
      name: "Uniswap", 
      symbol: "UNI", 
      price: 8.75,
      image: "https://assets.coingecko.com/coins/images/12504/large/uniswap.jpg",
      value: "uniswap",
      label: "Uniswap (UNI)"
    },
    { 
      id: "avalanche", 
      name: "Avalanche", 
      symbol: "AVAX", 
      price: 35.20,
      image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      value: "avalanche",
      label: "Avalanche (AVAX)"
    }
  ];
  
  // No query = return some popular coins
  if (!query || query.trim() === '') {
    return allCoins.slice(0, 5);
  }
  
  // Filter by query
  const lowercaseQuery = query.toLowerCase();
  return allCoins.filter(coin => 
    coin.name.toLowerCase().includes(lowercaseQuery) || 
    coin.symbol.toLowerCase().includes(lowercaseQuery)
  );
}

export async function getCoinData(coinId: string): Promise<CoinOption | null> {
  // Mock getting specific coin data
  const allCoins: CoinOption[] = await searchCoins("");
  return allCoins.find(coin => coin.id === coinId) || null;
}

export async function getMarketTrends() {
  // Mock market trend data
  return {
    topGainers: [
      { id: "solana", name: "Solana", symbol: "SOL", price: 142.5, changePercent: 8.5 },
      { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 35.20, changePercent: 7.2 },
      { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, changePercent: 5.4 }
    ],
    topLosers: [
      { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3210, changePercent: -3.2 },
      { id: "ripple", name: "XRP", symbol: "XRP", price: 0.61, changePercent: -2.1 },
      { id: "chainlink", name: "Chainlink", symbol: "LINK", price: 14.32, changePercent: -1.8 }
    ],
    trending: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 69420, changePercent: 2.4 },
      { id: "solana", name: "Solana", symbol: "SOL", price: 142.5, changePercent: 8.5 },
      { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.138, changePercent: 4.3 }
    ]
  };
}

export async function getPriceHistory(coinId: string, days: number = 7) {
  // Generate mock price history data
  const dataPoints = days * 24; // hourly data points
  const data = [];
  
  let basePrice = 0;
  let volatility = 0;
  
  switch (coinId) {
    case 'bitcoin':
      basePrice = 69420;
      volatility = 0.02; // 2%
      break;
    case 'ethereum':
      basePrice = 3210;
      volatility = 0.025;
      break;
    case 'solana':
      basePrice = 142.5;
      volatility = 0.04;
      break;
    default:
      basePrice = 100;
      volatility = 0.03;
  }
  
  let currentPrice = basePrice;
  const now = Date.now();
  const interval = (days * 24 * 60 * 60 * 1000) / dataPoints;
  
  for (let i = 0; i < dataPoints; i++) {
    // Simulate price movement
    const change = (Math.random() - 0.45) * volatility; // Slightly biased upward
    currentPrice = currentPrice * (1 + change);
    
    data.push({
      timestamp: now - (dataPoints - i) * interval,
      price: currentPrice,
      volume: currentPrice * 1000000 * (0.8 + Math.random() * 0.4)
    });
  }
  
  return data;
}

export async function getMarketInsights() {
  // Mock market insights
  return [
    {
      id: "insight1",
      title: "Bitcoin correlation with tech stocks increasing",
      description: "Analysis shows Bitcoin's price movements are increasingly correlated with tech stocks, suggesting stronger institutional influence.",
      type: "correlation",
      confidence: 85,
      timestamp: Date.now() - 2 * 60 * 60 * 1000 // 2 hours ago
    },
    {
      id: "insight2",
      title: "Ethereum approaching resistance level",
      description: "Technical indicators suggest ETH is approaching a key resistance level at $3,200. Watch for potential breakout or rejection.",
      type: "technical",
      confidence: 76,
      timestamp: Date.now() - 5 * 60 * 60 * 1000 // 5 hours ago
    },
    {
      id: "insight3",
      title: "Unusual trading volume detected in Solana",
      description: "SOL trading volume has spiked 235% above the 30-day average, potentially signaling upcoming price movement.",
      type: "volume",
      confidence: 92,
      timestamp: Date.now() - 30 * 60 * 1000 // 30 minutes ago
    }
  ];
}
