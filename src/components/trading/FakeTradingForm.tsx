import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoinOption, FakeTradingFormProps, Trade } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({ 
  onTrade,
  availableCoins = [],
  initialCoinId,
  advancedMode = false
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(initialCoinId || (availableCoins.length > 0 ? availableCoins[0].id : ''));
  const [tradeAmount, setTradeAmount] = useState<string>('100');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  
  const selectedCoin = availableCoins.find(coin => coin.id === selectedCoinId);
  
  const handleTrade = () => {
    if (!selectedCoin) return;
    
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const trade: Trade = {
      id: uuidv4(),
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      type: tradeType,
      price: selectedCoin.price || 0,
      amount: amount,
      totalValue: amount * (selectedCoin.price || 0),
      timestamp: new Date().toISOString(),
      currency: 'AUD',
      total: amount * (selectedCoin.price || 0),
      address: '', // Add required fields
      network: ''
    };
    
    onTrade(trade);
    
    // Reset form after trade
    setTradeAmount('100');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paper Trading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Coin</label>
            <select
              className="w-full border rounded p-2"
              value={selectedCoinId}
              onChange={(e) => setSelectedCoinId(e.target.value)}
            >
              {availableCoins.map(coin => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Trade Type</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={tradeType === 'buy' ? 'default' : 'outline'}
                onClick={() => setTradeType('buy')}
                className="flex-1"
              >
                Buy
              </Button>
              <Button
                type="button"
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                onClick={() => setTradeType('sell')}
                className="flex-1"
              >
                Sell
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (AUD)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
            />
          </div>
          
          {advancedMode && (
            <div className="space-y-2 bg-muted p-3 rounded">
              <h3 className="text-sm font-medium">Advanced Options</h3>
              <p className="text-xs text-muted-foreground">
                Additional trading options are available in advanced mode
              </p>
              
              {/* Render advanced options here */}
            </div>
          )}
          
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleTrade}
              className="w-full"
              disabled={!selectedCoin || !tradeAmount}
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol}
            </Button>
          </div>
          
          {selectedCoin && (
            <div className="text-sm text-muted-foreground pt-2">
              <p>
                Current Price: ${selectedCoin.price?.toFixed(2) || 'N/A'}
              </p>
              <p>
                Total: ${(parseFloat(tradeAmount) * (selectedCoin.price || 0)).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FakeTradingForm;
