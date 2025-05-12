
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpDown } from "lucide-react";
import { CoinOption, SupportedCurrency, TradingFormProps } from '@/types/trading';

const TradingForm: React.FC<TradingFormProps> = ({
  balance,
  availableCoins,
  onTrade,
  getOwnedCoinAmount,
  activeCurrency,
  onCurrencyChange,
  conversionRate
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(availableCoins[0]?.id || '');
  const [tradeAmount, setTradeAmount] = useState<number>(0);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  
  // Update selected coin when ID changes
  useEffect(() => {
    const coin = availableCoins.find(c => c.id === selectedCoinId);
    setSelectedCoin(coin || null);
  }, [selectedCoinId, availableCoins]);
  
  // Calculate total value whenever amount or selected coin changes
  useEffect(() => {
    if (selectedCoin) {
      setTotalValue(tradeAmount * selectedCoin.price);
      
      // Calculate max amount based on balance or holdings
      if (tradeType === 'buy') {
        setMaxAmount(balance / selectedCoin.price);
      } else {
        setMaxAmount(getOwnedCoinAmount(selectedCoin.id));
      }
    }
  }, [tradeAmount, selectedCoin, tradeType, balance]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;
    
    onTrade(selectedCoin.id, tradeType, tradeAmount, selectedCoin.price);
    setTradeAmount(0);
  };
  
  const handleCoinChange = (coinId: string) => {
    setSelectedCoinId(coinId);
    setTradeAmount(0); // Reset amount when coin changes
  };
  
  const handleTradeTypeChange = (value: 'buy' | 'sell') => {
    setTradeType(value);
    setTradeAmount(0); // Reset amount when trade type changes
  };
  
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: activeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Trade</CardTitle>
        <CardDescription>Buy or sell cryptocurrencies</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Trade Type</Label>
            <RadioGroup 
              value={tradeType} 
              onValueChange={(value) => handleTradeTypeChange(value as 'buy' | 'sell')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buy" id="buy" />
                <Label htmlFor="buy" className="cursor-pointer">Buy</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sell" id="sell" />
                <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coin-select">Select Coin</Label>
            <Select value={selectedCoinId} onValueChange={handleCoinChange}>
              <SelectTrigger id="coin-select">
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {availableCoins.map(coin => (
                  <SelectItem 
                    key={coin.id} 
                    value={coin.id}
                  >
                    <div className="flex items-center">
                      {coin.image && (
                        <img 
                          src={coin.image} 
                          alt={coin.name} 
                          className="w-5 h-5 mr-2"
                        />
                      )}
                      {coin.name} ({coin.symbol})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCoin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Price</Label>
                  <div className="text-xl font-bold">
                    {formatCurrency(selectedCoin.price)}
                  </div>
                  <div className={`text-sm ${
                    (selectedCoin.changePercent || 0) >= 0 
                      ? "text-green-500" 
                      : "text-red-500"
                  }`}>
                    {(selectedCoin.changePercent || 0) >= 0 ? "+" : ""}
                    {selectedCoin.changePercent?.toFixed(2)}%
                  </div>
                </div>
                
                {tradeType === 'buy' ? (
                  <div>
                    <Label>Available Balance</Label>
                    <div className="text-xl font-bold">
                      {formatCurrency(balance)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label>Your Holdings</Label>
                    <div className="text-xl font-bold">
                      {getOwnedCoinAmount(selectedCoin.id)} {selectedCoin.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ≈ {formatCurrency(getOwnedCoinAmount(selectedCoin.id) * selectedCoin.price)}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount ({selectedCoin.symbol})</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTradeAmount(maxAmount)}
                    disabled={maxAmount <= 0}
                  >
                    Max
                  </Button>
                </div>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.0001"
                  max={maxAmount}
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  Max: {maxAmount.toFixed(4)} {selectedCoin.symbol}
                </div>
              </div>
              
              <div>
                <Label>Total Value</Label>
                <div className="text-xl font-bold">
                  {formatCurrency(totalValue)}
                </div>
              </div>
            </>
          )}

          <div className="mt-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={
                !selectedCoin || 
                tradeAmount <= 0 || 
                (tradeType === 'buy' && totalValue > balance) ||
                (tradeType === 'sell' && tradeAmount > (getOwnedCoinAmount(selectedCoinId)))
              }
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
