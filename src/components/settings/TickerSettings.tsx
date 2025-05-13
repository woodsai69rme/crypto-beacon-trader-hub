
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Repeat } from "lucide-react";
import { SettingsComponentProps } from './types';

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize ticker object if it doesn't exist
  const formValues = form.getValues();
  
  if (!formValues.ticker) {
    form.setValue("ticker", {
      enabled: true,
      position: 'bottom',
      speed: 5,
      direction: 'left',
      autoPause: true
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          Market Ticker Settings
        </CardTitle>
        <CardDescription>
          Configure the market ticker display and behavior
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="ticker.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Enable Ticker</FormLabel>
                <FormDescription>
                  Show the market ticker on the platform
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticker Position</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value as string}
                disabled={!form.getValues().ticker?.enabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ticker position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose where to display the ticker
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.direction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scroll Direction</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value as string}
                disabled={!form.getValues().ticker?.enabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scroll direction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left to Right</SelectItem>
                  <SelectItem value="right">Right to Left</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Set the direction of price movement
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.speed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticker Speed: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[field.value as number]}
                  onValueChange={(values) => field.onChange(values[0])}
                  disabled={!form.getValues().ticker?.enabled}
                />
              </FormControl>
              <FormDescription>
                Control how fast the ticker moves (1 = slow, 10 = fast)
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.autoPause"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Auto-Pause on Hover</FormLabel>
                <FormDescription>
                  Pause ticker movement when hovering over it
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  disabled={!form.getValues().ticker?.enabled}
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
