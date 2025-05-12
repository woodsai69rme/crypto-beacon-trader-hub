
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, ArrowUp, ArrowDown, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { CoinOption } from '@/types/trading';

interface CryptoWatchlistProps {
  coins: CoinOption[];
}

const CryptoWatchlist: React.FC<CryptoWatchlistProps> = ({ coins }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'price' | 'changePercent'>('changePercent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: 'name' | 'price' | 'changePercent') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === 'price' && a.price && b.price) {
      return sortDirection === 'asc'
        ? a.price - b.price
        : b.price - a.price;
    } else if (sortField === 'changePercent' && a.changePercent && b.changePercent) {
      return sortDirection === 'asc'
        ? a.changePercent - b.changePercent
        : b.changePercent - a.changePercent;
    }
    return 0;
  });
  
  const getSortIcon = (field: 'name' | 'price' | 'changePercent') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Watchlist
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute h-4 w-4 top-3 left-3 text-muted-foreground" />
          <Input
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-sm cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Asset</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th className="text-right py-3 font-medium text-sm cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    {getSortIcon('price')}
                  </div>
                </th>
                <th className="text-right py-3 font-medium text-sm cursor-pointer" onClick={() => handleSort('changePercent')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>24h</span>
                    {getSortIcon('changePercent')}
                  </div>
                </th>
                <th className="text-right py-3 font-medium text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedCoins.map((coin) => {
                const isPositive = coin.changePercent && coin.changePercent >= 0;
                
                return (
                  <tr key={coin.id} className="border-b last:border-b-0 hover:bg-muted/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {coin.symbol}
                        </div>
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3">
                      <div className="font-medium">${coin.price?.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">USD</div>
                    </td>
                    <td className="text-right py-3">
                      <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        <span>{coin.changePercent?.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="text-right py-3">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        Trade
                      </Button>
                    </td>
                  </tr>
                );
              })}
              
              {sortedCoins.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    No coins found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoWatchlist;
