
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Trade } from '@/types/trading';

interface FakeTradingFormProps {
  onAddTrade: (trade: Trade) => void;
  advancedMode?: boolean;
}

const FakeTradingForm: React.FC<FakeTradingFormProps> = ({ onAddTrade, advancedMode = false }) => {
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
    
    const priceValue = parseFloat(price);
    const quantityValue = parseFloat(quantity);
    const totalValue = priceValue * quantityValue;
    
    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      coinId: asset,
      coinName: asset === 'BTC' ? 'Bitcoin' : 
               asset === 'ETH' ? 'Ethereum' :
               asset === 'SOL' ? 'Solana' : 'Cardano',
      coinSymbol: asset,
      type,
      amount: quantityValue,
      price: priceValue,
      totalValue: totalValue,
      total: totalValue, // For backward compatibility
      timestamp: tradeDate,
      currency: "USD",
      fees: totalValue * 0.001 
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
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg glass-card animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="asset" className="text-muted-foreground">Asset</Label>
        <Select value={asset} onValueChange={setAsset}>
          <SelectTrigger id="asset" className="bg-background/60 backdrop-blur border-border/50">
            <SelectValue placeholder="Select Asset" />
          </SelectTrigger>
          <SelectContent className="bg-popover/95 backdrop-blur-lg border-border/50">
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="SOL">Solana (SOL)</SelectItem>
            <SelectItem value="ADA">Cardano (ADA)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-muted-foreground">Price</Label>
          <Input
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="bg-background/60 backdrop-blur border-border/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-muted-foreground">Quantity</Label>
          <Input
            id="quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            min="0"
            step="0.0001"
            className="bg-background/60 backdrop-blur border-border/50"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date" className="text-muted-foreground">Trade Date</Label>
        <Input
          id="date"
          type="date"
          value={tradeDate}
          onChange={(e) => setTradeDate(e.target.value)}
          className="bg-background/60 backdrop-blur border-border/50"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          className={`w-full transition-all duration-300 ${type === 'buy' ? 'bg-crypto-green text-white hover:brightness-110' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          onClick={() => setType('buy')}
        >
          Buy
        </Button>
        <Button
          type="button"
          className={`w-full transition-all duration-300 ${type === 'sell' ? 'bg-crypto-red text-white hover:brightness-110' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          onClick={() => setType('sell')}
        >
          Sell
        </Button>
      </div>
      
      {advancedMode && (
        <div className="space-y-2 pt-2 border-t border-border/40">
          <p className="text-sm font-medium text-muted-foreground">Advanced Settings</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="fee" className="text-xs text-muted-foreground">Fee (%)</Label>
              <Input
                id="fee"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0.1"
                disabled
                className="bg-background/40 text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="slippage" className="text-xs text-muted-foreground">Slippage (%)</Label>
              <Input
                id="slippage"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0.5"
                disabled
                className="bg-background/40 text-muted-foreground"
              />
            </div>
          </div>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
      >
        Add Trade
      </Button>
    </form>
  );
};

export default FakeTradingForm;
