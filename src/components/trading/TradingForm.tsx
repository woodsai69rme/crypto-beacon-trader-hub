
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { CoinOption, Trade, TradingFormProps } from "@/types/trading";
import { v4 as uuidv4 } from 'uuid';
import { ArrowDownUp, CalculatorIcon, Clock, DollarSign } from "lucide-react";
import { fetchCoinOptions } from '@/services/cryptoApi';

const TradingForm: React.FC<TradingFormProps> = ({ 
  initialCoin,
  onTradeSubmit 
}) => {
  const [availableCoins, setAvailableCoins] = useState<CoinOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoinId, setSelectedCoinId] = useState<string>(initialCoin?.id || 'bitcoin');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(initialCoin || null);
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const [takeProfit, setTakeProfit] = useState<number | null>(null);
  
  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coins = await fetchCoinOptions();
        setAvailableCoins(coins);
        
        // Set initial selected coin
        if (selectedCoinId) {
          const coin = coins.find(c => c.id === selectedCoinId);
          if (coin) setSelectedCoin(coin);
        } else if (coins.length > 0) {
          setSelectedCoin(coins[0]);
          setSelectedCoinId(coins[0].id);
        }
      } catch (error) {
        console.error("Failed to load coins:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCoins();
  }, []);
  
  useEffect(() => {
    if (selectedCoin) {
      setUsdValue(Number(amount) * selectedCoin.price);
    }
  }, [amount, selectedCoin]);
  
  const handleCoinChange = (coinId: string) => {
    setSelectedCoinId(coinId);
    const coin = availableCoins.find(c => c.id === coinId);
    if (coin) setSelectedCoin(coin);
  };
  
  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    setAmount(isNaN(numValue) ? 0 : numValue);
  };
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    
    if (selectedCoin) {
      // Calculate crypto amount based on slider percentage (0-100) of $10,000
      const maxUsdValue = 10000;
      const usdAmount = (value[0] / 100) * maxUsdValue;
      const cryptoAmount = usdAmount / selectedCoin.price;
      setAmount(parseFloat(cryptoAmount.toFixed(8)));
      setUsdValue(usdAmount);
    }
  };
  
  const handleUsdValueChange = (value: string) => {
    const numValue = parseFloat(value);
    setUsdValue(isNaN(numValue) ? 0 : numValue);
    
    if (selectedCoin && numValue > 0) {
      setAmount(numValue / selectedCoin.price);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCoin) {
      toast({
        title: "Error",
        description: "Please select a cryptocurrency",
        variant: "destructive",
      });
      return;
    }
    
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    const trade: Trade = {
      id: uuidv4(),
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      type: tradeType,
      amount: amount,
      price: selectedCoin.price,
      totalValue: usdValue,
      total: usdValue,
      timestamp: new Date().toISOString(),
      currency: 'USD',
    };
    
    if (onTradeSubmit) {
      onTradeSubmit(trade);
    }
    
    // Reset form
    setTradeType('buy');
    setAmount(0);
    setUsdValue(0);
    setSliderValue(0);
    setAdvancedOptions(false);
    setStopLoss(null);
    setTakeProfit(null);
    
    toast({
      title: "Trade Submitted",
      description: `Successfully placed ${tradeType} order for ${amount} ${selectedCoin.symbol}`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownUp className="h-5 w-5" />
          Trade {selectedCoin?.symbol || 'Crypto'}
        </CardTitle>
        <CardDescription>
          Buy or sell cryptocurrencies with instant execution
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coin-select">Select Coin</Label>
            <Select value={selectedCoinId} onValueChange={handleCoinChange} disabled={loading}>
              <SelectTrigger id="coin-select">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {availableCoins.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    <div className="flex items-center gap-2">
                      {coin.image && (
                        <img 
                          src={coin.image} 
                          alt={coin.name} 
                          className="w-5 h-5"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
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
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="text-xl font-semibold">${selectedCoin.price.toLocaleString()}</div>
                </div>
                <div className={`text-right ${selectedCoin.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <div className="text-sm">24h Change</div>
                  <div className="font-semibold">
                    {selectedCoin.priceChange >= 0 ? '+' : ''}{selectedCoin.priceChange.toFixed(2)} ({selectedCoin.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Trade Type</Label>
            <RadioGroup 
              value={tradeType} 
              onValueChange={(value) => setTradeType(value as 'buy' | 'sell')} 
              className="flex"
            >
              <div className="flex items-center space-x-2 w-full">
                <RadioGroupItem value="buy" id="buy" className="peer sr-only" />
                <Label 
                  htmlFor="buy" 
                  className="flex-1 text-center py-2 border rounded-l-md cursor-pointer peer-aria-checked:bg-green-500 peer-aria-checked:text-white peer-aria-checked:border-green-500"
                >
                  Buy
                </Label>
                
                <RadioGroupItem value="sell" id="sell" className="peer sr-only" />
                <Label 
                  htmlFor="sell" 
                  className="flex-1 text-center py-2 border rounded-r-md cursor-pointer peer-aria-checked:bg-red-500 peer-aria-checked:text-white peer-aria-checked:border-red-500"
                >
                  Sell
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({selectedCoin?.symbol || 'Crypto'})</Label>
            <div className="flex space-x-2">
              <Input
                id="amount"
                type="number"
                step="any"
                min="0"
                value={amount || ''}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-20"
                onClick={() => {
                  if (selectedCoin) {
                    const maxAmount = 10000 / selectedCoin.price;
                    setAmount(parseFloat(maxAmount.toFixed(8)));
                    setUsdValue(10000);
                    setSliderValue(100);
                  }
                }}
              >
                Max
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>Amount Slider</span>
              <span className="text-sm text-muted-foreground">{sliderValue}%</span>
            </Label>
            <Slider 
              value={[sliderValue]} 
              onValueChange={handleSliderChange} 
              max={100} 
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="usd-value">USD Value</Label>
            <div className="relative">
              <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="usd-value"
                type="number"
                min="0"
                value={usdValue || ''}
                onChange={(e) => handleUsdValueChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-options"
              checked={advancedOptions}
              onCheckedChange={setAdvancedOptions}
            />
            <Label htmlFor="advanced-options">Advanced Options</Label>
          </div>
          
          {advancedOptions && (
            <div className="space-y-4 p-3 rounded-md border">
              <div className="space-y-2">
                <Label htmlFor="stop-loss">Stop Loss (USD)</Label>
                <Input
                  id="stop-loss"
                  type="number"
                  min="0"
                  value={stopLoss || ''}
                  onChange={(e) => setStopLoss(parseFloat(e.target.value) || null)}
                  placeholder="Optional"
                />
                {selectedCoin && stopLoss && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {tradeType === 'buy' ? 
                      `Sell at $${stopLoss} (${((stopLoss / selectedCoin.price - 1) * 100).toFixed(2)}%)` : 
                      `Buy at $${stopLoss} (${((1 - stopLoss / selectedCoin.price) * 100).toFixed(2)}%)`}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="take-profit">Take Profit (USD)</Label>
                <Input
                  id="take-profit"
                  type="number"
                  min="0"
                  value={takeProfit || ''}
                  onChange={(e) => setTakeProfit(parseFloat(e.target.value) || null)}
                  placeholder="Optional"
                />
                {selectedCoin && takeProfit && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {tradeType === 'buy' ? 
                      `Sell at $${takeProfit} (${((takeProfit / selectedCoin.price - 1) * 100).toFixed(2)}%)` : 
                      `Buy at $${takeProfit} (${((1 - takeProfit / selectedCoin.price) * 100).toFixed(2)}%)`}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Order expires in
                </div>
                <Select defaultValue="never">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                    <SelectItem value="1m">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md mb-4">
            <div className="text-sm">Estimated Total</div>
            <div className="text-right">
              <div className="font-semibold">${usdValue.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {amount.toFixed(8)} {selectedCoin?.symbol || 'Crypto'}
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className={`w-full ${tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
            disabled={loading || !selectedCoin || amount <= 0}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol || 'Crypto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
