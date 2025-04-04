
import { TrendingUp, TrendingDown, Activity, DollarSign, Bitcoin as BitcoinIcon } from "lucide-react";

const MarketOverview = () => {
  // Mock data - in a real app, this would come from an API
  const marketData = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 28950.32, 
      change24h: 1.2, 
      marketCap: 562.7,
      volume: 18.5,
      icon: <BitcoinIcon className="text-crypto-bitcoin" />
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 1592.18, 
      change24h: -0.8, 
      marketCap: 191.2,
      volume: 9.7,
      icon: <div className="text-crypto-ethereum font-bold">Ξ</div>
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 98.75, 
      change24h: 3.5, 
      marketCap: 42.8,
      volume: 2.1,
      icon: <div className="text-purple-500 font-bold">S</div>
    },
    { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.37, 
      change24h: -1.7, 
      marketCap: 13.1,
      volume: 0.5,
      icon: <div className="text-blue-500 font-bold">A</div>
    },
    { 
      id: "ripple", 
      name: "Ripple", 
      symbol: "XRP", 
      price: 0.54, 
      change24h: 0.3, 
      marketCap: 29.2,
      volume: 1.3,
      icon: <div className="text-blue-400 font-bold">X</div>
    }
  ];

  // Global market stats
  const marketStats = {
    totalMarketCap: 1.28, // in trillion dollars
    totalVolume24h: 42.5, // in billion dollars
    btcDominance: 48.2, // percentage
    ethDominance: 16.8 // percentage
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="crypto-card">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Market Cap</span>
              <span className="text-xl font-bold">${marketStats.totalMarketCap.toFixed(2)}T</span>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="crypto-card">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">24h Volume</span>
              <span className="text-xl font-bold">${marketStats.totalVolume24h.toFixed(1)}B</span>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="crypto-card">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">BTC Dominance</span>
              <span className="text-xl font-bold">{marketStats.btcDominance}%</span>
            </div>
            <BitcoinIcon className="h-8 w-8 text-crypto-bitcoin" />
          </div>
        </div>
        <div className="crypto-card">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ETH Dominance</span>
              <span className="text-xl font-bold">{marketStats.ethDominance}%</span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center text-crypto-ethereum font-bold text-2xl">Ξ</div>
          </div>
        </div>
      </div>

      <div className="crypto-card overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Top Cryptocurrencies</h2>
        <table className="w-full min-w-[600px]">
          <thead className="text-left">
            <tr className="border-b border-border">
              <th className="pb-2 text-sm text-muted-foreground font-medium">#</th>
              <th className="pb-2 text-sm text-muted-foreground font-medium">Name</th>
              <th className="pb-2 text-sm text-muted-foreground font-medium text-right">Price</th>
              <th className="pb-2 text-sm text-muted-foreground font-medium text-right">24h %</th>
              <th className="pb-2 text-sm text-muted-foreground font-medium text-right">Market Cap</th>
              <th className="pb-2 text-sm text-muted-foreground font-medium text-right">Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((crypto, index) => (
              <tr key={crypto.id} className="border-b border-border hover:bg-crypto-dark-hover">
                <td className="py-4 text-sm">{index + 1}</td>
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-full mr-2">
                      {crypto.icon}
                    </div>
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right font-medium">${crypto.price.toLocaleString()}</td>
                <td className={`py-4 text-right font-medium ${crypto.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                  <div className="flex items-center justify-end">
                    {crypto.change24h >= 0 ? 
                      <TrendingUp className="h-4 w-4 mr-1" /> : 
                      <TrendingDown className="h-4 w-4 mr-1" />}
                    {crypto.change24h > 0 ? '+' : ''}{crypto.change24h}%
                  </div>
                </td>
                <td className="py-4 text-right">${crypto.marketCap.toFixed(1)}B</td>
                <td className="py-4 text-right">${crypto.volume.toFixed(1)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketOverview;
