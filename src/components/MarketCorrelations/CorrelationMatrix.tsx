import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { getCorrelationColor } from './utils';

interface CorrelationMatrixProps {
  correlationMatrix?: Record<string, Record<string, number>>;
  coins?: any[];
  onCoinSelect?: (coin: any) => void;
  baseCoin?: string;
  timeframe?: string;
}

interface CoinCorrelation {
  id: string;
  name: string;
  symbol: string;
  correlation: number;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ 
  correlationMatrix,
  coins,
  onCoinSelect,
  baseCoin = 'bitcoin',
  timeframe = '30d'
}) => {
  const [selectedCoin, setSelectedCoin] = useState<string>(baseCoin);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
  const [correlationData, setCorrelationData] = useState<CoinCorrelation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Mock correlation data - in a real app, this would come from an API
  const mockCorrelations = {
    bitcoin: [
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', correlation: 0.85 },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', correlation: 0.72 },
      { id: 'ripple', name: 'XRP', symbol: 'XRP', correlation: 0.68 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', correlation: 0.79 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', correlation: 0.81 },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', correlation: 0.76 },
      { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', correlation: 0.59 },
      { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', correlation: 0.77 },
      { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', correlation: 0.65 },
      { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', correlation: 0.73 }
    ],
    ethereum: [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', correlation: 0.85 },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', correlation: 0.78 },
      { id: 'ripple', name: 'XRP', symbol: 'XRP', correlation: 0.64 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', correlation: 0.72 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', correlation: 0.79 },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', correlation: 0.80 },
      { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', correlation: 0.52 },
      { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', correlation: 0.83 },
      { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', correlation: 0.87 },
      { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', correlation: 0.81 }
    ],
    solana: [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', correlation: 0.81 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', correlation: 0.79 },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', correlation: 0.75 },
      { id: 'ripple', name: 'XRP', symbol: 'XRP', correlation: 0.61 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', correlation: 0.76 },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', correlation: 0.74 },
      { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', correlation: 0.57 },
      { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', correlation: 0.85 },
      { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', correlation: 0.73 },
      { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', correlation: 0.78 }
    ]
  };
  
  const coinOptions = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' }
  ];
  
  const timeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];
  
  // Load correlation data when selected coin changes
  useEffect(() => {
    if (correlationMatrix && coins) {
      // If we have props data, use it
      const data: CoinCorrelation[] = [];
      
      coins.forEach(coin => {
        if (coin.id !== selectedCoin && correlationMatrix[selectedCoin]?.[coin.id]) {
          data.push({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            correlation: correlationMatrix[selectedCoin][coin.id]
          });
        }
      });
      
      setCorrelationData(data);
    } else {
      // Otherwise use mock data
      loadCorrelationData(selectedCoin);
    }
  }, [selectedCoin, correlationMatrix, coins]);
  
  // Function to load correlation data
  const loadCorrelationData = (coinId: string) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setCorrelationData(mockCorrelations[coinId as keyof typeof mockCorrelations] || []);
      setIsLoading(false);
    }, 500);
  };
  
  // Handle coin selection change
  const handleCoinChange = (value: string) => {
    setSelectedCoin(value);
  };
  
  // Handle timeframe selection change
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
    loadCorrelationData(selectedCoin);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    loadCorrelationData(selectedCoin);
    toast({
      title: "Refreshed Correlation Data",
      description: `Correlation data for ${selectedCoin} has been updated.`
    });
  };
  
  // Handle coin selection for drill-down
  const handleSelectCoin = (coin: CoinCorrelation) => {
    setSelectedCoin(coin.id);
    
    if (onCoinSelect && coins) {
      const selectedCoin = coins.find(c => c.id === coin.id);
      if (selectedCoin) {
        onCoinSelect(selectedCoin);
      }
    }
  };
  
  // Render a correlation cell with appropriate coloring
  const renderCorrelationCell = (correlation: number) => {
    const color = getCorrelationColor(correlation);
    const textColor = Math.abs(correlation) < 0.3 ? 'text-gray-800' : 'text-white';
    
    return (
      <div 
        className={`w-full h-full p-2 flex items-center justify-center ${textColor}`}
        style={{ backgroundColor: color }}
      >
        {(correlation * 100).toFixed(0)}%
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Base Asset:</span>
          <Select value={selectedCoin} onValueChange={handleCoinChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {(coins || coinOptions).map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span className="text-sm font-medium ml-2">Timeframe:</span>
          <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Correlation with {selectedCoin.toUpperCase()}</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {correlationData.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)).map(coin => (
                <div 
                  key={coin.id}
                  className="border rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={() => handleSelectCoin(coin)}
                >
                  <div className="p-2 bg-muted">
                    <div className="font-medium truncate">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                  </div>
                  {renderCorrelationCell(coin.correlation)}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Correlation ranges from -100% (perfect negative correlation) to 100% (perfect positive correlation).
              0% indicates no correlation between assets.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationMatrix;
