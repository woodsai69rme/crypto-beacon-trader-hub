
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WatchlistItem } from '@/types/trading';
import { Star, Settings, Plus, ChevronUp, ChevronDown, Bell } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Watchlist: React.FC = () => {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([
    {
      id: "bitcoin",
      coinId: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 50000,
      priceChange: 1200,
      priceChangePercentage24h: 2.4,
      image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      isWatched: true,
      alertSettings: {
        highPrice: 52000,
        lowPrice: 47000,
        percentageChangeThreshold: 5,
        priceAbove: 52000,
        priceBelow: 47000,
        percentageChange: 5,
        enabled: true
      }
    },
    {
      id: "ethereum",
      coinId: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3200,
      priceChange: -100,
      priceChangePercentage24h: -3.1,
      image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      isWatched: true,
      alertSettings: {
        highPrice: 3500,
        lowPrice: 2800,
        percentageChangeThreshold: 7,
        priceAbove: 3500,
        priceBelow: 2800,
        percentageChange: 7,
        enabled: true
      }
    },
    {
      id: "solana",
      coinId: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 105,
      priceChange: 5,
      priceChangePercentage24h: 4.8,
      image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      isWatched: true,
      alertSettings: {
        highPrice: 120,
        lowPrice: 90,
        percentageChangeThreshold: 10,
        priceAbove: 120,
        priceBelow: 90,
        percentageChange: 10,
        enabled: false
      }
    },
    {
      id: "cardano",
      coinId: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      priceChange: 0.01,
      priceChangePercentage24h: 2.2,
      image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
      isWatched: false,
      alertSettings: {
        highPrice: 0.5,
        lowPrice: 0.4,
        percentageChangeThreshold: 8,
        priceAbove: 0.5,
        priceBelow: 0.4,
        percentageChange: 8,
        enabled: false
      }
    },
    {
      id: "polkadot",
      coinId: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      price: 6.35,
      priceChange: 0.25,
      priceChangePercentage24h: 3.9,
      image: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
      isWatched: false,
      alertSettings: {
        highPrice: 7,
        lowPrice: 5.5,
        percentageChangeThreshold: 10,
        priceAbove: 7,
        priceBelow: 5.5,
        percentageChange: 10,
        enabled: false
      }
    }
  ]);
  
  const [showOnlyWatched, setShowOnlyWatched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);
  
  const toggleWatch = (id: string) => {
    setWatchlistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, isWatched: !item.isWatched } : item
      )
    );
    
    const item = watchlistItems.find(item => item.id === id);
    if (item) {
      toast({
        title: item.isWatched ? "Removed from watchlist" : "Added to watchlist",
        description: `${item.name} has been ${item.isWatched ? "removed from" : "added to"} your watchlist.`,
        duration: 3000,
      });
    }
  };
  
  const toggleAlerts = (id: string) => {
    if (expandedAlerts.includes(id)) {
      setExpandedAlerts(expandedAlerts.filter(item => item !== id));
    } else {
      setExpandedAlerts([...expandedAlerts, id]);
    }
  };
  
  const updateAlertSetting = (id: string, field: keyof WatchlistItem['alertSettings'], value: number | boolean) => {
    setWatchlistItems(items => 
      items.map(item => {
        if (item.id === id && item.alertSettings) {
          return { 
            ...item, 
            alertSettings: { 
              ...item.alertSettings, 
              [field]: value 
            } 
          };
        }
        return item;
      })
    );
  };
  
  const toggleAlertEnabled = (id: string) => {
    setWatchlistItems(items => 
      items.map(item => {
        if (item.id === id && item.alertSettings) {
          const newStatus = !item.alertSettings.enabled;
          toast({
            title: newStatus ? "Alerts enabled" : "Alerts disabled",
            description: `Price alerts for ${item.name} are now ${newStatus ? "enabled" : "disabled"}.`,
            duration: 3000,
          });
          
          return { 
            ...item, 
            alertSettings: { 
              ...item.alertSettings, 
              enabled: newStatus 
            } 
          };
        }
        return item;
      })
    );
  };
  
  const filteredItems = watchlistItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (showOnlyWatched) {
      return item.isWatched && matchesSearch;
    }
    
    return matchesSearch;
  });
  
  const handleAddCoin = () => {
    const newCoin: WatchlistItem = {
      id: "avalanche",
      coinId: "avalanche",
      name: "Avalanche",
      symbol: "AVAX",
      price: 28.50,
      priceChange: 1.25,
      priceChangePercentage24h: 4.3,
      image: "https://assets.coingecko.com/coins/images/12559/small/avalanche-logo.png",
      isWatched: true,
      alertSettings: {
        highPrice: 35,
        lowPrice: 25,
        percentageChangeThreshold: 8,
        priceAbove: 35,
        priceBelow: 25,
        percentageChange: 8,
        enabled: false
      }
    };
    
    setWatchlistItems([...watchlistItems, newCoin]);
    
    toast({
      title: "New coin added",
      description: `${newCoin.name} has been added to your watchlist.`,
      duration: 3000,
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle>Watchlist</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowOnlyWatched(!showOnlyWatched)}
          >
            {showOnlyWatched ? 'Show All' : 'Show Watched'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddCoin}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Coin
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No coins found matching your criteria
            </div>
          ) : (
            filteredItems.map((item) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${item.isWatched ? 'text-yellow-400' : 'text-muted-foreground'}`}
                      onClick={() => toggleWatch(item.id)}
                    >
                      <Star className="h-5 w-5 fill-current" />
                      <span className="sr-only">
                        {item.isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                      </span>
                    </Button>
                    
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    
                    <div>
                      <div className="font-semibold flex items-center">
                        {item.name} 
                        <span className="text-muted-foreground ml-1">
                          {item.symbol.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${item.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: item.price < 1 ? 4 : 2
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`text-${item.priceChangePercentage24h >= 0 ? 'green' : 'red'}-500`}>
                        {item.priceChangePercentage24h >= 0 ? '+' : ''}
                        {item.priceChangePercentage24h.toFixed(2)}%
                      </div>
                      <div className={`text-sm text-${item.priceChangePercentage24h >= 0 ? 'green' : 'red'}-500`}>
                        {item.priceChange && item.priceChange >= 0 ? '+' : ''}
                        ${Math.abs(item.priceChange || 0).toFixed(2)}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${item.alertSettings?.enabled ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => toggleAlertEnabled(item.id)}
                    >
                      <Bell className="h-4 w-4" />
                      <span className="sr-only">
                        {item.alertSettings?.enabled ? 'Disable alerts' : 'Enable alerts'}
                      </span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleAlerts(item.id)}
                    >
                      {expandedAlerts.includes(item.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {expandedAlerts.includes(item.id) && (
                  <div className="p-3 bg-muted/10 rounded-lg mt-1 mb-3">
                    <div className="text-sm font-medium mb-2">Alert Settings</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Price above
                        </label>
                        <div className="flex items-center mt-1">
                          <span className="text-xs mr-1">$</span>
                          <Input
                            type="number"
                            value={item.alertSettings?.highPrice || 0}
                            onChange={(e) => updateAlertSetting(
                              item.id, 
                              'highPrice', 
                              parseFloat(e.target.value) || 0
                            )}
                            className="h-7 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Price below
                        </label>
                        <div className="flex items-center mt-1">
                          <span className="text-xs mr-1">$</span>
                          <Input
                            type="number"
                            value={item.alertSettings?.lowPrice || 0}
                            onChange={(e) => updateAlertSetting(
                              item.id, 
                              'lowPrice', 
                              parseFloat(e.target.value) || 0
                            )}
                            className="h-7 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="text-xs text-muted-foreground">
                          % Change threshold
                        </label>
                        <div className="flex items-center mt-1">
                          <Input
                            type="number"
                            value={item.alertSettings?.percentageChangeThreshold || 0}
                            onChange={(e) => updateAlertSetting(
                              item.id, 
                              'percentageChangeThreshold', 
                              parseFloat(e.target.value) || 0
                            )}
                            className="h-7 text-sm"
                          />
                          <span className="text-xs ml-1">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
