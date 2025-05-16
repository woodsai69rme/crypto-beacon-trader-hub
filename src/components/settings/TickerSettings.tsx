
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
    if (!form.getValues().ticker) {
      form.setValue('ticker', {
        enabled: true,
        position: 'bottom',
        direction: 'ltr',
        speed: 50,
        autoPause: true,
      });
    }
  }, [form]);
  
  const tickerValues = form.getValues().ticker || {
    enabled: true,
    position: 'bottom',
    direction: 'ltr',
    speed: 50,
    autoPause: true,
  };

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
        <FormField
          control={form.control}
          name="ticker.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Show Price Ticker</FormLabel>
                <FormDescription>
                  Display a real-time price ticker on your dashboard
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={(checked) => {
                    const updatedTicker = { ...tickerValues, enabled: checked };
                    form.setValue('ticker', updatedTicker);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Ticker Position */}
        <FormField
          control={form.control}
          name="ticker.position"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Ticker Position</FormLabel>
              <FormDescription>
                Choose where the ticker appears on screen
              </FormDescription>
              <FormControl>
                <RadioGroup 
                  onValueChange={(value) => {
                    const updatedTicker = { ...tickerValues, position: value as "top" | "bottom" };
                    form.setValue('ticker', updatedTicker);
                  }}
                  defaultValue={field.value} 
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
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Ticker Direction */}
        <FormField
          control={form.control}
          name="ticker.direction"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Scrolling Direction</FormLabel>
              <FormDescription>
                Choose the direction the ticker scrolls
              </FormDescription>
              <FormControl>
                <RadioGroup 
                  onValueChange={(value) => {
                    const updatedTicker = { ...tickerValues, direction: value as "ltr" | "rtl" };
                    form.setValue('ticker', updatedTicker);
                  }}
                  defaultValue={field.value} 
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
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Ticker Speed */}
        <FormField
          control={form.control}
          name="ticker.speed"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Scrolling Speed</FormLabel>
              <FormControl>
                <Slider
                  min={10}
                  max={100}
                  step={5}
                  defaultValue={[field.value || 50]}
                  onValueChange={(values) => {
                    const updatedTicker = { ...tickerValues, speed: values[0] };
                    form.setValue('ticker', updatedTicker);
                  }}
                />
              </FormControl>
              <div className="flex justify-between">
                <FormDescription>Slower</FormDescription>
                <FormDescription>Faster</FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        {/* Auto Pause */}
        <FormField
          control={form.control}
          name="ticker.autoPause"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Auto-pause on hover</FormLabel>
                <FormDescription>
                  Pause the ticker when you hover over it
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={(checked) => {
                    const updatedTicker = { ...tickerValues, autoPause: checked };
                    form.setValue('ticker', updatedTicker);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default TickerSettings;
