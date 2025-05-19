
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { SettingsComponentProps } from './types';

interface TickerPreferences {
  enabled: boolean;
  position: 'top' | 'bottom';
  direction: 'ltr' | 'rtl';
  speed: number;
  autoPause: boolean;
  coins?: string[];
}

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize tickerPreferences if it doesn't exist
  const ensureTickerPreferences = (): TickerPreferences => {
    const current = form.getValues();
    if (!current.ticker) {
      form.setValue("ticker", {
        enabled: true,
        position: 'top',
        direction: 'ltr',
        speed: 5,
        autoPause: true,
        coins: ['BTC', 'ETH', 'SOL', 'USDT', 'BNB']
      });
    }
    return current.ticker as TickerPreferences || {
      enabled: true,
      position: 'top',
      direction: 'ltr',
      speed: 5,
      autoPause: true,
      coins: ['BTC', 'ETH', 'SOL', 'USDT', 'BNB']
    };
  };

  ensureTickerPreferences();
  
  const updateTickerPreferences = (updateData: Partial<TickerPreferences>) => {
    const currentPrefs = ensureTickerPreferences();
    form.setValue("ticker", {
      ...currentPrefs,
      ...updateData
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Ticker Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="ticker-enabled">Show Price Ticker</Label>
          <Switch 
            id="ticker-enabled" 
            checked={form.watch("ticker.enabled")} 
            onCheckedChange={(checked) => {
              updateTickerPreferences({ enabled: checked });
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Ticker Position</Label>
          <RadioGroup 
            value={form.watch("ticker.position")} 
            onValueChange={(value) => {
              updateTickerPreferences({ position: value as 'top' | 'bottom' });
            }}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="position-top" />
              <Label htmlFor="position-top">Top</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom" id="position-bottom" />
              <Label htmlFor="position-bottom">Bottom</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Ticker Speed: {form.watch("ticker.speed")}</Label>
            </div>
            <Slider
              value={[form.watch("ticker.speed")]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => {
                updateTickerPreferences({ speed: value[0] });
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Scroll Direction</Label>
          <RadioGroup 
            value={form.watch("ticker.direction")} 
            onValueChange={(value) => {
              updateTickerPreferences({ direction: value as 'ltr' | 'rtl' });
            }}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ltr" id="direction-ltr" />
              <Label htmlFor="direction-ltr">Left to Right</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rtl" id="direction-rtl" />
              <Label htmlFor="direction-rtl">Right to Left</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="ticker-autopause">Auto-pause on Hover</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Automatically pause ticker when mouse hovers over it
            </p>
          </div>
          <Switch 
            id="ticker-autopause" 
            checked={form.watch("ticker.autoPause")} 
            onCheckedChange={(checked) => {
              updateTickerPreferences({ autoPause: checked });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TickerSettings;
