import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from 'lucide-react';
import { CryptoData, CoinOption } from '@/types/trading';

interface CryptoSearchProps {
  coins: CoinOption[];
  onSelect: (coin: CryptoData) => void;
}

const CryptoSearch: React.FC<CryptoSearchProps> = ({ coins, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);

  useEffect(() => {
    // Convert CoinOption[] to CryptoData[]
    setCryptoData(coins.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: coin.price,
      market_cap: coin.marketCap || 0,
      market_cap_rank: coin.rank || 0,
      // Add other required fields with defaults
      fully_diluted_valuation: null,
      total_volume: coin.volume || 0,
      high_24h: null,
      low_24h: null,
      price_change_24h: coin.priceChange || 0,
      price_change_percentage_24h: coin.changePercent || 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      total_supply: null,
      max_supply: null,
      ath: null,
      ath_change_percentage: null,
      ath_date: null,
      atl: null,
      atl_change_percentage: null,
      atl_date: null,
      roi: null,
      last_updated: new Date().toISOString()
    })));
  }, [coins]);

  const filteredCoins = cryptoData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Cryptocurrencies</CardTitle>
        <CardDescription>Find and select a cryptocurrency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <ScrollArea className="h-[300px] mt-4">
          {filteredCoins.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer rounded-md"
              onClick={() => onSelect(coin)}
            >
              <div className="flex items-center space-x-2">
                {coin.image && <img src={coin.image} alt={coin.name} className="h-6 w-6 rounded-full" />}
                <div>
                  <p className="text-sm font-medium">{coin.name}</p>
                  <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                </div>
              </div>
              <p className="text-sm font-medium">${coin.current_price.toFixed(2)}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CryptoSearch;
