import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useTradingContext } from '@/contexts/TradingContext';
import { CoinOption } from '@/types/trading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const AlertFormSheet = () => {
  const { coins } = useTradingContext();
  const [open, setOpen] = React.useState(false)
  const [priceAlertFormData, setPriceAlertFormData] = useState<PriceAlertFormData>({
    coin: coins[0]?.id || '',
    threshold: 0,
    direction: 'above',
    notify: false,
  });

  const [volumeAlertFormData, setVolumeAlertFormData] = useState<VolumeAlertFormData>({
    coin: coins[0]?.id || '',
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
    setOpen(false);
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
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Create Alert</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create a New Alert</SheetTitle>
          <SheetDescription>
            Set up real-time notifications for price and volume movements.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="coin">Cryptocurrency</Label>
          <Select onValueChange={(value) => handlePriceAlertChange({ coin: value })} defaultValue={priceAlertFormData.coin}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {coins.map((coin: CoinOption) => (
                <SelectItem key={coin.id} value={coin.id}>{coin.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="threshold">Price Threshold</Label>
          <Input
            id="threshold"
            type="number"
            placeholder="Enter threshold"
            value={priceAlertFormData.threshold.toString()}
            onChange={(e) => handlePriceAlertChange({ threshold: parseFloat(e.target.value) })}
          />

          <Label>Direction</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant={priceAlertFormData.direction === 'above' ? 'default' : 'outline'}
              onClick={() => handlePriceAlertChange({ direction: 'above' })}
            >
              Above
            </Button>
            <Button
              variant={priceAlertFormData.direction === 'below' ? 'default' : 'outline'}
              onClick={() => handlePriceAlertChange({ direction: 'below' })}
            >
              Below
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="notify">Notify Me</Label>
            <Switch
              id="notify"
              checked={priceAlertFormData.notify}
              onCheckedChange={(checked) => handlePriceAlertChange({ notify: checked })}
            />
          </div>
        </div>
        <Button onClick={handleCreatePriceAlert}>Create Price Alert</Button>

        <div className="grid gap-4 py-4">
          <Label htmlFor="volumeCoin">Cryptocurrency</Label>
          <Select onValueChange={(value) => handleVolumeAlertChange({ coin: value })} defaultValue={volumeAlertFormData.coin}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {coins.map((coin: CoinOption) => (
                <SelectItem key={coin.id} value={coin.id}>{coin.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="volumeThreshold">Volume Threshold</Label>
          <Input
            id="volumeThreshold"
            type="number"
            placeholder="Enter volume threshold"
            value={volumeAlertFormData.threshold.toString()}
            onChange={(e) => handleVolumeAlertChange({ threshold: parseFloat(e.target.value) })}
          />

          <div className="flex items-center space-x-2">
            <Label htmlFor="volumeNotify">Notify Me</Label>
            <Switch
              id="volumeNotify"
              checked={volumeAlertFormData.notify}
              onCheckedChange={(checked) => handleVolumeAlertChange({ notify: checked })}
            />
          </div>
        </div>
        <Button onClick={handleCreateVolumeAlert}>Create Volume Alert</Button>
      </SheetContent>
    </Sheet>
  )
}

export default AlertFormSheet;
