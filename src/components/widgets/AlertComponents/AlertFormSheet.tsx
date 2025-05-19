
import React from 'react';
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFormData } from '@/types/alerts';

interface AlertFormSheetProps {
  formData: AlertFormData;
  onFormChange: (data: Partial<AlertFormData>) => void;
  onSubmit: () => void;
}

const AlertFormSheet: React.FC<AlertFormSheetProps> = ({ 
  formData, 
  onFormChange, 
  onSubmit 
}) => {
  const { toast } = useToast();

  const validateForm = () => {
    if (!formData.coinId) {
      toast({
        title: "Error",
        description: "Please select a cryptocurrency",
        variant: "destructive",
      });
      return false;
    }

    if (formData.type === 'price' && !formData.targetPrice) {
      toast({
        title: "Error",
        description: "Please enter a price threshold",
        variant: "destructive",
      });
      return false;
    }

    if (formData.type === 'volume' && !formData.volumeThreshold) {
      toast({
        title: "Error",
        description: "Please enter a volume threshold",
        variant: "destructive",
      });
      return false;
    }

    if (formData.type === 'technical' && (!formData.indicator || !formData.condition || !formData.value)) {
      toast({
        title: "Error",
        description: "Please fill in all technical indicator details",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
      toast({
        title: "Success",
        description: `Alert created for ${formData.coinName}`,
      });
    }
  };

  return (
    <div className="mt-4">
      <SheetHeader>
        <SheetTitle>Create a New Alert</SheetTitle>
        <SheetDescription>
          Set up real-time notifications for price and volume movements.
        </SheetDescription>
      </SheetHeader>
      
      <div className="grid gap-4 py-4">
        <Label htmlFor="alertType">Alert Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => onFormChange({ type: value as 'price' | 'volume' | 'technical' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select alert type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price Alert</SelectItem>
            <SelectItem value="volume">Volume Alert</SelectItem>
            <SelectItem value="technical">Technical Alert</SelectItem>
          </SelectContent>
        </Select>
        
        <Label htmlFor="coin">Cryptocurrency</Label>
        <Select 
          value={formData.coinId} 
          onValueChange={(value) => onFormChange({ 
            coinId: value,
            coinName: value === 'bitcoin' ? 'Bitcoin' : 
                      value === 'ethereum' ? 'Ethereum' : 
                      value === 'solana' ? 'Solana' : value,
            coinSymbol: value === 'bitcoin' ? 'BTC' : 
                        value === 'ethereum' ? 'ETH' : 
                        value === 'solana' ? 'SOL' : value.toUpperCase()
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
            <SelectItem value="solana">Solana (SOL)</SelectItem>
            <SelectItem value="cardano">Cardano (ADA)</SelectItem>
          </SelectContent>
        </Select>
        
        {formData.type === 'price' && (
          <>
            <Label htmlFor="targetPrice">Price Threshold</Label>
            <Input
              id="targetPrice"
              type="number" 
              placeholder="Enter price threshold"
              value={formData.targetPrice?.toString() || ''}
              onChange={(e) => onFormChange({ targetPrice: parseFloat(e.target.value) })}
            />
            
            <div className="flex items-center space-x-2">
              <Label>Condition</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.isAbove ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFormChange({ isAbove: true })}
                >
                  Above
                </Button>
                <Button
                  type="button"
                  variant={!formData.isAbove ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFormChange({ isAbove: false })}
                >
                  Below
                </Button>
              </div>
            </div>
          </>
        )}
        
        {formData.type === 'volume' && (
          <>
            <Label htmlFor="volumeThreshold">Volume Threshold</Label>
            <Input
              id="volumeThreshold"
              type="number" 
              placeholder="Enter volume threshold (in millions)"
              value={formData.volumeThreshold?.toString() || ''}
              onChange={(e) => onFormChange({ volumeThreshold: parseFloat(e.target.value) })}
            />
          </>
        )}
        
        {formData.type === 'technical' && (
          <>
            <Label htmlFor="indicator">Indicator</Label>
            <Select 
              value={formData.indicator || ''} 
              onValueChange={(value) => onFormChange({ indicator: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rsi">RSI</SelectItem>
                <SelectItem value="macd">MACD</SelectItem>
                <SelectItem value="ma">Moving Average</SelectItem>
                <SelectItem value="bb">Bollinger Bands</SelectItem>
              </SelectContent>
            </Select>
            
            <Label htmlFor="condition">Condition</Label>
            <Select 
              value={formData.condition || ''} 
              onValueChange={(value) => onFormChange({ condition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crosses_above">Crosses Above</SelectItem>
                <SelectItem value="crosses_below">Crosses Below</SelectItem>
                <SelectItem value="overbought">Overbought</SelectItem>
                <SelectItem value="oversold">Oversold</SelectItem>
              </SelectContent>
            </Select>
            
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number" 
              placeholder="Enter value"
              value={formData.value?.toString() || ''}
              onChange={(e) => onFormChange({ value: parseFloat(e.target.value) })}
            />
          </>
        )}
        
        <div className="flex items-center space-x-2 mt-2">
          <Label htmlFor="notifyVia">Notify via</Label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="notifyApp"
                checked={formData.notifyVia?.includes('app')}
                onChange={(e) => {
                  const notifyVia = formData.notifyVia || [];
                  if (e.target.checked) {
                    onFormChange({ notifyVia: [...notifyVia, 'app'] });
                  } else {
                    onFormChange({ notifyVia: notifyVia.filter(v => v !== 'app') });
                  }
                }}
              />
              <Label htmlFor="notifyApp">App</Label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id="notifyEmail"
                checked={formData.notifyVia?.includes('email')}
                onChange={(e) => {
                  const notifyVia = formData.notifyVia || [];
                  if (e.target.checked) {
                    onFormChange({ notifyVia: [...notifyVia, 'email'] });
                  } else {
                    onFormChange({ notifyVia: notifyVia.filter(v => v !== 'email') });
                  }
                }}
              />
              <Label htmlFor="notifyEmail">Email</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit}>
          Create Alert
        </Button>
      </div>
    </div>
  );
};

export default AlertFormSheet;
