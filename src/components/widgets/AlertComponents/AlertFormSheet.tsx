
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFormData } from '@/types/alerts';

interface PriceAlertFormData {
  coin: string;
  threshold: number;
  direction: 'above' | 'below';
  notify: boolean;
}

interface VolumeAlertFormData {
  coin: string;
  threshold: number;
  notify: boolean;
}

interface AlertFormSheetProps {
  formData: AlertFormData;
  onFormChange: (data: Partial<AlertFormData>) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormSheetProps> = ({ 
  formData, 
  onFormChange, 
  onSubmit 
}) => {
  const [priceAlertFormData, setPriceAlertFormData] = useState<PriceAlertFormData>({
    coin: '',
    threshold: 0,
    direction: 'above',
    notify: false,
  });

  const [volumeAlertFormData, setVolumeAlertFormData] = useState<VolumeAlertFormData>({
    coin: '',
    threshold: 0,
    notify: false,
  });

  const handlePriceAlertChange = (data: Partial<PriceAlertFormData>) => {
    setPriceAlertFormData(prevState => ({
      ...prevState,
      ...data
    }));
  };

  const handleVolumeAlertChange = (data: Partial<VolumeAlertFormData>) => {
    setVolumeAlertFormData(prevState => ({
      ...prevState,
      ...data
    }));
  };

  const handleCreatePriceAlert = () => {
    if (!priceAlertFormData.coin || priceAlertFormData.threshold <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Price alert created for ${priceAlertFormData.coin} when price goes ${priceAlertFormData.direction} ${priceAlertFormData.threshold}.`,
    });
  };

  const handleCreateVolumeAlert = () => {
    if (!volumeAlertFormData.coin || volumeAlertFormData.threshold <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Volume alert created for ${volumeAlertFormData.coin} when volume exceeds ${volumeAlertFormData.threshold}.`,
    });
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
            <Label htmlFor="priceThreshold">Price Threshold</Label>
            <Input
              id="priceThreshold"
              type="number" 
              placeholder="Enter price threshold"
              value={formData.priceThreshold?.toString() || ''}
              onChange={(e) => onFormChange({ priceThreshold: parseFloat(e.target.value) })}
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
        <Button onClick={onSubmit}>
          Create Alert
        </Button>
      </div>
    </div>
  );
};

export default AlertFormSheet;
