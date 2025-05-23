
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Star, Search, ArrowUpDown } from 'lucide-react';
import { fetchMultipleCryptoData } from '@/services/cryptoService';
import { CoinOption, RealTimePricesProps } from '@/types/trading';

const RealTimePrices: React.FC<RealTimePricesProps> = ({
  initialCoins = [],
  onSelectCoin,
  selectedCoinId,
  refreshInterval = 30000, // Default to 30 seconds
}) => {
  const [coins, setCoins] = useState<CoinOption[]>(initialCoins);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CoinOption; direction: 'asc' | 'desc' }>({
    key: 'marketCap',
    direction: 'desc',
  });
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showOnlyWatchlist, setShowOnlyWatchlist] = useState(false);
  
  useEffect(() => {
    // Initialize with any passed coins
    if (initialCoins.length > 0) {
      setCoins(initialCoins);
    }
  }, [initialCoins]);
  
  useEffect(() => {
    // Check for saved watchlist in localStorage
    const savedWatchlist = localStorage.getItem('crypto-watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);
  
  useEffect(() => {
    // Set up refresh interval
    const interval = setInterval(() => {
      refreshPriceData();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval, coins]);
  
  const refreshPriceData = async () => {
    try {
      // Only refresh data for displayed coins for efficiency
      const coinIds = coins.map(coin => coin.id);
      if (coinIds.length === 0) return;
      
      const updatedCoins = await fetchMultipleCryptoData(coinIds);
      
      if (updatedCoins.length > 0) {
        // Update price data while preserving other properties
        setCoins(prev => prev.map(coin => {
          const updated = updatedCoins.find(u => u.id === coin.id);
          return updated ? { ...coin, ...updated } : coin;
        }));
      }
    } catch (error) {
      console.error('Error refreshing price data:', error);
    }
  };
  
  const toggleWatchlist = (coinId: string) => {
    let newWatchlist: string[];
    
    if (watchlist.includes(coinId)) {
      newWatchlist = watchlist.filter(id => id !== coinId);
    } else {
      newWatchlist = [...watchlist, coinId];
    }
    
    setWatchlist(newWatchlist);
    localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist));
  };
  
  const handleSort = (key: keyof CoinOption) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const sortedCoins = React.useMemo(() => {
    let sortableCoins = [...coins];
    
    if (sortConfig.key) {
      sortableCoins.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        
        if (sortConfig.direction === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      });
    }
    
    return sortableCoins;
  }, [coins, sortConfig]);
  
  const filteredCoins = React.useMemo(() => {
    return sortedCoins.filter(coin => {
      // First apply watchlist filter if enabled
      if (showOnlyWatchlist && !watchlist.includes(coin.id)) {
        return false;
      }
      
      // Then apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [sortedCoins, searchQuery, watchlist, showOnlyWatchlist]);
  
  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      // For very small prices (like SHIB)
      return `$${price.toLocaleString('en-US', { minimumSignificantDigits: 2, maximumSignificantDigits: 4 })}`;
    }
  };
  
  const formatPriceChange = (change: number, percent: number): JSX.Element => {
    const isPositive = change >= 0;
    const color = isPositive ? 'text-green-500' : 'text-red-500';
    const prefix = isPositive ? '+' : '';
    
    return (
      <div className={`flex flex-col ${color}`}>
        <span>{prefix}{formatPrice(change)}</span>
        <span className="text-xs">{prefix}{percent.toFixed(2)}%</span>
      </div>
    );
  };
  
  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coins..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={showOnlyWatchlist ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyWatchlist(!showOnlyWatchlist)}
            className="flex-1 sm:flex-none"
          >
            <Star className="mr-1 h-4 w-4" />
            {showOnlyWatchlist ? 'Show All' : 'Watchlist'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshPriceData}
            className="flex-1 sm:flex-none"
          >
            Refresh Data
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center">
                  Price
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('changePercent')}>
                <div className="flex items-center">
                  24h Change
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('marketCap')}>
                <div className="flex items-center">
                  Market Cap
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort('volume')}>
                <div className="flex items-center">
                  Volume (24h)
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoins.length > 0 ? (
              filteredCoins.map((coin) => (
                <TableRow 
                  key={coin.id}
                  className={`cursor-pointer ${selectedCoinId === coin.id ? 'bg-muted/50' : ''}`}
                  onClick={() => onSelectCoin && onSelectCoin(coin.id)}
                >
                  <TableCell className="w-[30px]">
                    <Star
                      className={`h-4 w-4 ${watchlist.includes(coin.id) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(coin.id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {coin.image && (
                        <img 
                          src={coin.image} 
                          alt={coin.name} 
                          className="w-6 h-6 mr-2"
                        />
                      )}
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(coin.price)}
                  </TableCell>
                  <TableCell>
                    {formatPriceChange(coin.priceChange, coin.changePercent)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {coin.marketCap ? formatLargeNumber(coin.marketCap) : '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {coin.volume ? formatLargeNumber(coin.volume) : '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  {searchQuery ? 'No coins match your search' : 'No coins available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RealTimePrices;
