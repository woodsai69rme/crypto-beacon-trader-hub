
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useTradingAccounts } from '@/hooks/use-trading-accounts';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import { ArrowRightLeft, TrendingUp, BadgeDollarSign } from 'lucide-react';

// Define supported currency type
type SupportedCurrency = 'USD' | 'AUD' | 'EUR' | 'GBP';

interface TradingWidgetProps {
  onSuccess?: () => void;
  className?: string;
}

const TradingWidget = ({ onSuccess, className }: TradingWidgetProps) => {
  const { activeAccountId, executeAccountTrade, getActiveAccount } = useTradingAccounts();
  const { formatValue, activeCurrency, setActiveCurrency } = useCurrencyConverter();
  
  const [coinId, setCoinId] = useState('bitcoin');
  const [amount, setAmount] = useState('0.01');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  
  const activeAccount = getActiveAccount();
  
  const coins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 61245.32 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3010.45 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 142.87 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45 },
  ];
  
  const selectedCoin = coins.find(coin => coin.id === coinId);
  
  const handleExecuteTrade = () => {
    if (!activeAccountId || !selectedCoin) return;
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid positive amount',
        variant: 'destructive',
      });
      return;
    }
    
    const currentActiveCurrency = activeCurrency as SupportedCurrency;
    
    const trade = {
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      amount: parsedAmount,
      price: selectedCoin.price,
      type: tradeType,
      totalValue: parsedAmount * selectedCoin.price,
      currency: currentActiveCurrency
    };
    
    const success = executeAccountTrade(activeAccountId, trade);
    
    if (success) {
      toast({
        title: 'Trade Executed',
        description: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${parsedAmount} ${selectedCoin.symbol}`,
      });
      
      setAmount('0.01');
      
      if (onSuccess) onSuccess();
    }
  };
  
  if (!activeAccount) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Quick Trading</CardTitle>
          <CardDescription>No active account selected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Please select or create a trading account to use this widget
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const totalPrice = selectedCoin ? parseFloat(amount) * selectedCoin.price : 0;
  const canAfford = tradeType === 'buy' ? activeAccount.balance >= totalPrice : true;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRightLeft className="h-5 w-5 mr-2" />
          Quick Trading
        </CardTitle>
        <CardDescription>Execute trades from your dashboard</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="space-y-1">
            <Label className="text-xs">Account</Label>
            <p className="text-sm font-medium">{activeAccount.name}</p>
          </div>
          <div className="space-y-1 text-right">
            <Label className="text-xs">Balance</Label>
            <p className="text-sm font-medium">
              {formatValue(activeAccount.balance, activeCurrency as SupportedCurrency)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={tradeType === 'buy' ? 'default' : 'outline'}
            onClick={() => setTradeType('buy')}
            className="w-full"
          >
            Buy
          </Button>
          <Button
            variant={tradeType === 'sell' ? 'default' : 'outline'}
            onClick={() => setTradeType('sell')}
            className="w-full"
          >
            Sell
          </Button>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="coin">Asset</Label>
          <Select value={coinId} onValueChange={setCoinId}>
            <SelectTrigger id="coin">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {coins.map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedCoin && (
          <div className="bg-muted p-3 rounded-md flex justify-between items-center">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>{selectedCoin.symbol}</span>
            </div>
            <div className="font-mono">
              {formatValue(selectedCoin.price, activeCurrency as SupportedCurrency)}
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.0001"
              min="0"
            />
            {selectedCoin && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {selectedCoin.symbol}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="currency">Currency</Label>
          <Select 
            value={activeCurrency} 
            onValueChange={(value) => setActiveCurrency(value as SupportedCurrency)}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="AUD">AUD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {selectedCoin && (
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-medium">
                {formatValue(totalPrice, activeCurrency as SupportedCurrency)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleExecuteTrade}
          className="w-full"
          disabled={!selectedCoin || parseFloat(amount) <= 0 || (tradeType === 'buy' && !canAfford)}
        >
          <BadgeDollarSign className="h-4 w-4 mr-2" />
          {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol || 'Asset'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TradingWidget;
