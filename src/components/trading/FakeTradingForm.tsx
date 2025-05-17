
import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp } from "lucide-react";
import { FakeTradingFormProps, Trade, CoinOption } from '@/types/trading';

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({ 
  onTrade, 
  availableCoins = [],
  initialCoinId,
  advancedMode = false
}) => {
  const [coinId, setCoinId] = useState(initialCoinId || (availableCoins[0]?.id || ''));
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  
  const selectedCoin = availableCoins.find(coin => coin.id === coinId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCoin || !amount || parseFloat(amount) <= 0) return;
    
    const price = selectedCoin.price || 0;
    const quantity = parseFloat(amount);
    const totalValue = price * quantity;
    
    const trade: Trade = {
      id: `trade-${Date.now()}`,
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      type: tradeType,
      amount: quantity,
      price: price,
      totalValue: totalValue,
      timestamp: new Date().toISOString(),
      currency: 'USD',
      total: totalValue,
      status: 'completed'
    };
    
    onTrade(trade);
    
    // Reset form
    setAmount('');
  };
  
  // Add any advanced mode components or options based on the advancedMode prop
  const renderAdvancedOptions = () => {
    if (!advancedMode) return null;
    
    return (
      <div className="space-y-2 mt-4 border-t pt-4">
        <h4 className="text-sm font-medium">Advanced Options</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs">Stop Loss</label>
            <Input type="number" placeholder="0.00" disabled={tradeType !== 'buy'} />
          </div>
          <div className="space-y-1">
            <label className="text-xs">Take Profit</label>
            <Input type="number" placeholder="0.00" disabled={tradeType !== 'buy'} />
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownUp size={20} />
          {advancedMode ? 'Advanced Trading' : 'Quick Trade'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Coin</label>
            <Select value={coinId} onValueChange={setCoinId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {availableCoins.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Button
                type="button"
                variant={tradeType === 'buy' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setTradeType('buy')}
              >
                Buy
              </Button>
            </div>
            <div>
              <Button
                type="button"
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setTradeType('sell')}
              >
                Sell
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Amount of ${selectedCoin?.symbol || 'coin'}`}
              step="any"
              min="0"
            />
          </div>
          
          {renderAdvancedOptions()}
          
          {selectedCoin && amount && (
            <div className="border rounded-md p-3 bg-muted/50">
              <div className="text-sm flex justify-between">
                <span>Price:</span>
                <span>${selectedCoin.price?.toLocaleString()}</span>
              </div>
              <div className="text-sm flex justify-between mt-1">
                <span>Total:</span>
                <span>
                  ${(selectedCoin.price ? selectedCoin.price * parseFloat(amount || '0') : 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!coinId || !amount || parseFloat(amount) <= 0}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol?.toUpperCase()}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FakeTradingForm;
