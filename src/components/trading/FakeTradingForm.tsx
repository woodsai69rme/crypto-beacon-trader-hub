
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface FakeTradingFormProps {
  onAddTrade: (trade: any) => void;
}

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({ onAddTrade }) => {
  const [asset, setAsset] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [tradeDate, setTradeDate] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!asset || !price || !quantity || !tradeDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newTrade = {
      id: `trade-${Date.now()}`,
      asset,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      type,
      // Convert string date to Date object (using string here to fix the error in the original component)
      date: tradeDate,
      timestamp: new Date(tradeDate).getTime()
    };
    
    onAddTrade(newTrade);
    
    // Reset form
    setAsset('');
    setPrice('');
    setQuantity('');
    setTradeDate('');
    
    toast({
      title: "Trade Added",
      description: `Successfully added ${type} trade for ${quantity} ${asset}`,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="asset">Asset</Label>
        <Select value={asset} onValueChange={setAsset}>
          <SelectTrigger id="asset">
            <SelectValue placeholder="Select Asset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="SOL">Solana (SOL)</SelectItem>
            <SelectItem value="ADA">Cardano (ADA)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            min="0"
            step="0.0001"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Trade Date</Label>
        <Input
          id="date"
          type="date"
          value={tradeDate}
          onChange={(e) => setTradeDate(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          className={`w-full ${type === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-muted hover:bg-muted/80'}`}
          onClick={() => setType('buy')}
        >
          Buy
        </Button>
        <Button
          type="button"
          className={`w-full ${type === 'sell' ? 'bg-red-500 hover:bg-red-600' : 'bg-muted hover:bg-muted/80'}`}
          onClick={() => setType('sell')}
        >
          Sell
        </Button>
      </div>
      
      <Button type="submit" className="w-full">
        Add Trade
      </Button>
    </form>
  );
};

export default FakeTradingForm;
