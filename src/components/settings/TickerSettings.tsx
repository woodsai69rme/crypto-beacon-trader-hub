
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SettingsComponentProps } from './types';

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Ticker Settings</CardTitle>
        <CardDescription>
          Configure the appearance and behavior of the market ticker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="ticker.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Ticker</FormLabel>
                <FormDescription>
                  Show the scrolling market ticker
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
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
                defaultValue={field.value}
                disabled={!form.watch("ticker.enabled")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="both">Both Top and Bottom</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Where to display the market ticker
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
                defaultValue={field.value}
                disabled={!form.watch("ticker.enabled")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
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
                  disabled={!form.watch("ticker.enabled")}
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <FormDescription>
                Adjust the scrolling speed (1-10)
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.autoPause"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto-Pause</FormLabel>
                <FormDescription>
                  Pause the ticker when hovering over it
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!form.watch("ticker.enabled")}
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
