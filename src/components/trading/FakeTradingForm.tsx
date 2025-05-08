
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpDown } from "lucide-react";

interface FakeTradingFormProps {
  advancedMode?: boolean;
}

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({ advancedMode = false }) => {
  const { toast } = useToast();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [leverage, setLeverage] = useState<string>('1');
  const [currentPrice] = useState<number>(61245.32);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: `${orderSide.toUpperCase()} order placed`,
      description: `${orderType.toUpperCase()} order for ${amount} BTC at ${orderType === 'market' ? 'market price' : `$${price}`}`,
      variant: orderSide === 'buy' ? 'default' : 'destructive',
    });
    
    // Reset form
    setAmount('');
    setPrice('');
    setStopPrice('');
  };
  
  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    const priceNum = orderType === 'market' ? currentPrice : (parseFloat(price) || 0);
    return (amountNum * priceNum).toFixed(2);
  };
  
  const handlePercentageClick = (percentage: number) => {
    // Simulate having 1 BTC available
    const maxAmount = orderSide === 'buy' ? 100000 / currentPrice : 1;
    setAmount((maxAmount * percentage / 100).toFixed(4));
  };
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <Tabs defaultValue={orderSide}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="buy" onClick={() => setOrderSide('buy')} className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Buy BTC</TabsTrigger>
            <TabsTrigger value="sell" onClick={() => setOrderSide('sell')} className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Sell BTC</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit')}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  {advancedMode && <SelectItem value="stop">Stop</SelectItem>}
                  {advancedMode && <SelectItem value="stop_limit">Stop Limit</SelectItem>}
                  {advancedMode && <SelectItem value="trailing_stop">Trailing Stop</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Amount (BTC)</Label>
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant="outline" className="h-5 w-8 text-xs" onClick={() => handlePercentageClick(25)}>25%</Button>
                  <Button type="button" size="sm" variant="outline" className="h-5 w-8 text-xs" onClick={() => handlePercentageClick(50)}>50%</Button>
                  <Button type="button" size="sm" variant="outline" className="h-5 w-8 text-xs" onClick={() => handlePercentageClick(75)}>75%</Button>
                  <Button type="button" size="sm" variant="outline" className="h-5 w-8 text-xs" onClick={() => handlePercentageClick(100)}>Max</Button>
                </div>
              </div>
              <Input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
            
            {orderType !== 'market' && (
              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <Input 
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder={currentPrice.toString()}
                  required={orderType !== 'market'}
                />
              </div>
            )}
            
            {(advancedMode && (orderType === 'stop' || orderType === 'stop_limit' || orderType === 'trailing_stop')) && (
              <div className="space-y-2">
                <Label>Stop Price (USD)</Label>
                <Input 
                  type="number"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required={orderType === 'stop' || orderType === 'stop_limit'}
                />
              </div>
            )}
            
            {advancedMode && (
              <div className="space-y-2">
                <Label>Leverage</Label>
                <Select value={leverage} onValueChange={setLeverage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Leverage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="5">5x</SelectItem>
                    <SelectItem value="10">10x</SelectItem>
                    <SelectItem value="25">25x</SelectItem>
                    <SelectItem value="50">50x</SelectItem>
                    <SelectItem value="100">100x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <span>Available:</span>
              <span className="font-medium">
                {orderSide === 'buy' ? '$100,000.00' : '1.00000 BTC'}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Total:</span>
              <span className="font-medium">${calculateTotal()}</span>
            </div>
            
            <Button 
              type="submit" 
              className={`w-full ${orderSide === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {orderSide === 'buy' ? 'Buy BTC' : 'Sell BTC'}
            </Button>
            
            {advancedMode && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2 flex items-center justify-center"
                onClick={() => {
                  setOrderSide(orderSide === 'buy' ? 'sell' : 'buy');
                }}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Switch to {orderSide === 'buy' ? 'Sell' : 'Buy'}
              </Button>
            )}
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FakeTradingForm;
