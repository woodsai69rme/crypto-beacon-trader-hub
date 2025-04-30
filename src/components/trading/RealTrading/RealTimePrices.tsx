
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from 'lucide-react';
import { CoinOption } from '../types';
import { fetchCryptoData } from "@/services/cryptoService";

interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin: (coinId: string) => void;
  selectedCoinId: string;
}

const RealTimePrices: React.FC<RealTimePricesProps> = ({ 
  initialCoins,
  onSelectCoin,
  selectedCoinId
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<keyof CoinOption>('marketCap');
  
  useEffect(() => {
    // Fetch real-time price data
    const fetchPrices = async () => {
      try {
        const data = await fetchCryptoData();
        // Convert to CoinOption format
        const formattedData: CoinOption[] = data.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          image: coin.image,
          priceChange: coin.price_change_24h,
          changePercent: coin.price_change_percentage_24h,
          volume: coin.total_volume,
          marketCap: coin.market_cap,
          value: coin.id,
          label: `${coin.name} (${coin.symbol.toUpperCase()})`
        }));
        
        setCoins(formattedData);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };
    
    // If no initial coins, fetch data
    if (initialCoins.length === 0) {
      fetchPrices();
    }
    
    // Set up interval for updates
    const interval = setInterval(() => {
      fetchPrices();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [initialCoins]);
  
  const handleSort = (field: keyof CoinOption) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new field, default to desc
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const filteredAndSortedCoins = coins
    .filter(coin => {
      const query = searchQuery.toLowerCase();
      return coin.name.toLowerCase().includes(query) || 
             coin.symbol.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      // Handle potential undefined or null values
      if (fieldA === undefined || fieldA === null) return 1;
      if (fieldB === undefined || fieldB === null) return -1;
      
      // For string comparison
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      // For number comparison
      return sortDirection === 'asc' 
        ? (fieldA as number) - (fieldB as number) 
        : (fieldB as number) - (fieldA as number);
    });
  
  const formatPercent = (value: number) => {
    if (typeof value !== 'number') return '0.00%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  const formatPrice = (value: number) => {
    if (typeof value !== 'number') return '$0.00';
    
    if (value < 1) {
      return `$${value.toFixed(4)}`;
    }
    
    if (value < 10) {
      return `$${value.toFixed(2)}`;
    }
    
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };
  
  const formatLargeNumber = (value: number) => {
    if (typeof value !== 'number') return '0';
    
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    
    return `$${value.toLocaleString()}`;
  };
  
  const renderSortArrow = (field: keyof CoinOption) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cryptocurrency Market</CardTitle>
            <CardDescription>
              Real-time price data for top cryptocurrencies
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead className="w-[200px]">Coin</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('price')}>
                  Price {renderSortArrow('price')}
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('changePercent')}>
                  24h Change {renderSortArrow('changePercent')}
                </TableHead>
                <TableHead className="text-right hidden md:table-cell cursor-pointer" onClick={() => handleSort('marketCap')}>
                  Market Cap {renderSortArrow('marketCap')}
                </TableHead>
                <TableHead className="text-right hidden md:table-cell cursor-pointer" onClick={() => handleSort('volume')}>
                  Volume (24h) {renderSortArrow('volume')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCoins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    {searchQuery ? 'No coins matching search query' : 'Loading coin data...'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCoins.slice(0, 20).map((coin, index) => (
                  <TableRow 
                    key={coin.id} 
                    className={`cursor-pointer ${selectedCoinId === coin.id ? 'bg-muted/50' : ''}`}
                    onClick={() => onSelectCoin(coin.id)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {coin.image && (
                          <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                        )}
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(coin.price)}
                    </TableCell>
                    <TableCell className={`text-right ${(coin.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercent(coin.changePercent || 0)}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {formatLargeNumber(coin.marketCap || 0)}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {formatLargeNumber(coin.volume || 0)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePrices;
