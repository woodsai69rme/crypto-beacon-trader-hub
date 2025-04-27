
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown, ArrowDownRight, ArrowRightLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportedCurrency } from "./TradingStats";
import { toast } from "@/components/ui/use-toast";

type CoinOption = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
};

interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onExecuteTrade: (type: 'buy' | 'sell', coinId: string, amount: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  conversionRate: number;
}

const TradingForm: React.FC<TradingFormProps> = ({ 
  balance, 
  availableCoins, 
  onExecuteTrade,
  getOwnedCoinAmount,
  activeCurrency,
  onCurrencyChange,
  conversionRate
}) => {
  const [selectedCoin, setSelectedCoin] = useState(availableCoins[0]?.id || "");
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  
  const handleExecuteTrade = () => {
    const amount = parseFloat(tradeAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    const selectedCoinData = availableCoins.find(c => c.id === selectedCoin);
    if (!selectedCoinData) return;
    
    const coinPrice = activeCurrency === 'AUD' && selectedCoinData.priceAUD 
      ? selectedCoinData.priceAUD 
      : activeCurrency === 'AUD' // Fallback if priceAUD is not available
        ? selectedCoinData.price * conversionRate 
        : selectedCoinData.price;
    
    const totalCost = amount * coinPrice;
    
    if (tradeType === 'buy') {
      if (totalCost > balance) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough funds to execute this trade",
          variant: "destructive"
        });
        return;
      }
    } else {
      const ownedAmount = getOwnedCoinAmount(selectedCoin);
      if (amount > ownedAmount) {
        toast({
          title: "Insufficient Coins",
          description: `You only have ${ownedAmount.toFixed(6)} ${selectedCoinData.symbol}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    onExecuteTrade(tradeType, selectedCoin, amount);
    
    // Reset form
    setTradeAmount("");
    
    toast({
      title: "Trade Executed",
      description: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount} ${selectedCoinData.symbol}`
    });
  };
  
  const calculateTotalCost = () => {
    if (!selectedCoin || !tradeAmount || isNaN(parseFloat(tradeAmount))) return 0;
    
    const coin = availableCoins.find(c => c.id === selectedCoin);
    if (!coin) return 0;
    
    const price = activeCurrency === 'AUD' && coin.priceAUD 
      ? coin.priceAUD 
      : activeCurrency === 'AUD' 
        ? coin.price * conversionRate 
        : coin.price;
    
    return parseFloat(tradeAmount) * price;
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: activeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const selectedCoinData = availableCoins.find(c => c.id === selectedCoin);
  const coinPrice = selectedCoinData 
    ? (activeCurrency === 'AUD' && selectedCoinData.priceAUD
        ? selectedCoinData.priceAUD
        : activeCurrency === 'AUD'
          ? selectedCoinData.price * conversionRate
          : selectedCoinData.price)
    : 0;
  
  const ownedAmount = selectedCoin ? getOwnedCoinAmount(selectedCoin) : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Trade</span>
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs px-2">
                  {activeCurrency}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[120px]" align="end">
                <Tabs defaultValue={activeCurrency} onValueChange={(value) => onCurrencyChange(value as SupportedCurrency)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="USD">USD</TabsTrigger>
                    <TabsTrigger value="AUD">AUD</TabsTrigger>
                    <TabsTrigger value="EUR">EUR</TabsTrigger>
                    <TabsTrigger value="GBP">GBP</TabsTrigger>
                  </TabsList>
                </Tabs>
              </PopoverContent>
            </Popover>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Available Balance</div>
            <div className="font-medium text-xl">{formatCurrency(balance)}</div>
          </div>
          
          <div>
            <Label htmlFor="coin-select">Select Coin</Label>
            <Select
              value={selectedCoin}
              onValueChange={setSelectedCoin}
            >
              <SelectTrigger id="coin-select" className="mt-1">
                <SelectValue placeholder="Select a coin" />
              </SelectTrigger>
              <SelectContent>
                {availableCoins.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCoinData && (
            <div className="flex justify-between text-sm">
              <div>Current Price:</div>
              <div className="font-medium">{formatCurrency(coinPrice)}</div>
            </div>
          )}
          
          {selectedCoin && ownedAmount > 0 && (
            <div className="flex justify-between text-sm">
              <div>You own:</div>
              <div className="font-medium">
                {ownedAmount.toFixed(6)} {selectedCoinData?.symbol}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={tradeType === 'buy' ? "default" : "outline"} 
              className="w-full"
              onClick={() => setTradeType('buy')}
            >
              Buy
            </Button>
            <Button 
              variant={tradeType === 'sell' ? "default" : "outline"} 
              className="w-full"
              onClick={() => setTradeType('sell')}
            >
              Sell
            </Button>
          </div>
          
          <div>
            <Label htmlFor="amount">
              Amount ({selectedCoinData?.symbol})
            </Label>
            <div className="mt-1 relative">
              <Input 
                id="amount"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                placeholder={`Amount in ${selectedCoinData?.symbol}`}
                type="number"
                step="any"
                min="0"
              />
              {tradeType === 'sell' && ownedAmount > 0 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="absolute top-0 right-0 h-full px-3 text-xs"
                  onClick={() => setTradeAmount(ownedAmount.toString())}
                >
                  Max
                </Button>
              )}
            </div>
          </div>
          
          {tradeAmount && !isNaN(parseFloat(tradeAmount)) && (
            <div className="flex justify-between text-sm">
              <div>Total {tradeType === 'buy' ? 'Cost' : 'Value'}:</div>
              <div className="font-medium">{formatCurrency(calculateTotalCost())}</div>
            </div>
          )}
          
          <Button 
            onClick={handleExecuteTrade} 
            className="w-full"
            disabled={!selectedCoin || !tradeAmount || isNaN(parseFloat(tradeAmount)) || parseFloat(tradeAmount) <= 0}
          >
            {tradeType === 'buy' ? (
              <>
                <ArrowDownRight className="h-4 w-4 mr-2" />
                Buy {selectedCoinData?.symbol}
              </>
            ) : (
              <>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Sell {selectedCoinData?.symbol}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
