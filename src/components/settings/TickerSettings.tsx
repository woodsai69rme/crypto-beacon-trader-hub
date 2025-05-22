import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Activity } from "lucide-react";
import { SettingsComponentProps } from './types';
import { Label } from '@/components/ui/label';

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  useEffect(() => {
    // Initialize ticker settings if they don't exist
    const currentValues = form.getValues();
    if (!currentValues.ticker) {
      form.setValue('ticker', {
        enabled: true,
        position: 'bottom',
        direction: 'ltr',
        speed: 50,
        autoPause: true,
        coins: ['bitcoin', 'ethereum', 'solana'],
        showVolume: true,
        showPercentChange: true
      });
    }
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Price Ticker Settings
        </CardTitle>
        <CardDescription>
          Configure the price ticker display options
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ticker Enabled */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Show Price Ticker</Label>
            <p className="text-sm text-muted-foreground">
              Display a real-time price ticker on your dashboard
            </p>
          </div>
          <Switch 
            checked={form.getValues().ticker?.enabled}
            onCheckedChange={(checked) => {
              form.setValue('ticker.enabled', checked, { shouldValidate: false });
            }}
          />
        </div>
        
        {/* Ticker Position */}
        <div className="space-y-3">
          <Label>Ticker Position</Label>
          <p className="text-sm text-muted-foreground">
            Choose where the ticker appears on screen
          </p>
          <RadioGroup 
            value={form.getValues().ticker?.position || 'bottom'}
            onValueChange={(value) => {
              form.setValue('ticker.position', value as 'top' | 'bottom', { shouldValidate: false });
            }}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="top" />
              <Label htmlFor="top">Top of screen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom" id="bottom" />
              <Label htmlFor="bottom">Bottom of screen</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Ticker Direction */}
        <div className="space-y-3">
          <Label>Scrolling Direction</Label>
          <p className="text-sm text-muted-foreground">
            Choose the direction the ticker scrolls
          </p>
          <RadioGroup 
            value={form.getValues().ticker?.direction || 'ltr'}
            onValueChange={(value) => {
              form.setValue('ticker.direction', value as 'ltr' | 'rtl', { shouldValidate: false });
            }}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ltr" id="ltr" />
              <Label htmlFor="ltr">Left to right</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rtl" id="rtl" />
              <Label htmlFor="rtl">Right to left</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Ticker Speed */}
        <div className="space-y-3">
          <Label>Scrolling Speed</Label>
          <Slider
            min={10}
            max={100}
            step={5}
            defaultValue={[form.getValues().ticker?.speed || 50]}
            onValueChange={(values) => {
              form.setValue('ticker.speed', values[0], { shouldValidate: false });
            }}
          />
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Slower</p>
            <p className="text-sm text-muted-foreground">Faster</p>
          </div>
        </div>
        
        {/* Auto Pause */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Auto-pause on hover</Label>
            <p className="text-sm text-muted-foreground">
              Pause the ticker when you hover over it
            </p>
          </div>
          <Switch 
            checked={form.getValues().ticker?.autoPause}
            onCheckedChange={(checked) => {
              form.setValue('ticker.autoPause', checked, { shouldValidate: false });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TickerSettings;
