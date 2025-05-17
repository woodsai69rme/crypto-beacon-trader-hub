
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CoinOption, FakeTradingFormProps, Trade } from '@/types/trading';

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({ 
  onTrade, 
  availableCoins = [],
  initialCoinId,
  advancedMode = false 
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState(initialCoinId || (availableCoins[0]?.id || ''));
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  
  // Find the selected coin
  const selectedCoin = availableCoins.find(coin => coin.id === selectedCoinId);
  
  // Set the current price when coin changes
  useEffect(() => {
    if (selectedCoin && selectedCoin.price) {
      setPrice(selectedCoin.price.toString());
    }
  }, [selectedCoinId, selectedCoin]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCoin || !amount || !price) return;
    
    const amountValue = parseFloat(amount);
    const priceValue = parseFloat(price);
    
    if (isNaN(amountValue) || isNaN(priceValue)) return;
    
    const totalValue = amountValue * priceValue;
    
    const trade: Trade = {
      id: `trade-${Date.now()}`,
      coinId: selectedCoinId,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      type: tradeType,
      amount: amountValue,
      price: priceValue,
      totalValue,
      timestamp: new Date().toISOString(),
      total: totalValue,
      status: 'completed'
    };
    
    onTrade(trade);
    
    // Reset form
    setAmount('');
    setTradeType('buy');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="coin-select">Select Coin</Label>
        <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
          <SelectTrigger id="coin-select">
            <SelectValue placeholder="Select coin" />
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
      
      <div>
        <Label htmlFor="trade-type">Trade Type</Label>
        <RadioGroup
          id="trade-type"
          value={tradeType}
          onValueChange={(value) => setTradeType(value as 'buy' | 'sell')}
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
      
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          step="0.000001"
          min="0"
        />
      </div>
      
      {advancedMode && (
        <div>
          <Label htmlFor="price">Price (AUD)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            step="0.01"
            min="0"
          />
        </div>
      )}
      
      <div>
        <p className="text-sm text-muted-foreground mb-1">Current Price: ${selectedCoin?.price?.toLocaleString() || 'N/A'}</p>
        <p className="text-sm text-muted-foreground mb-3">
          Total Value: ${amount && price ? (parseFloat(amount) * parseFloat(price)).toLocaleString() : '0.00'}
        </p>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={!selectedCoinId || !amount || !price}
      >
        {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol?.toUpperCase()}
      </Button>
    </form>
  );
};

export default FakeTradingForm;
