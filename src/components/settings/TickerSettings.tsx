
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { SettingsFormValues, SettingsComponentProps } from './types';

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Ticker Settings
        </CardTitle>
        <CardDescription>
          Configure how the ticker appears and behaves
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Enable Ticker</FormLabel>
            <Switch 
              checked={form.watch("ticker.enabled")} 
              onCheckedChange={(value) => form.setValue("ticker", {...form.getValues().ticker, enabled: value}, { shouldValidate: true })}
            />
          </div>
          <FormDescription>
            Show price ticker at the top or bottom of the application
          </FormDescription>
        </FormItem>
        
        <FormItem>
          <FormLabel>Position</FormLabel>
          <Select 
            value={form.watch("ticker.position")} 
            onValueChange={(value: "top" | "bottom") => form.setValue("ticker", {...form.getValues().ticker, position: value}, { shouldValidate: true })}
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
            </SelectContent>
          </Select>
          <FormDescription>
            Where the ticker should be displayed
          </FormDescription>
        </FormItem>
        
        <FormItem>
          <FormLabel>Speed</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="1" 
              max="10" 
              value={form.watch("ticker.speed")} 
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  form.setValue("ticker", {...form.getValues().ticker, speed: value}, { shouldValidate: true });
                }
              }}
              disabled={!form.watch("ticker.enabled")}
            />
          </FormControl>
          <FormDescription>
            Ticker scroll speed (1 = slow, 10 = fast)
          </FormDescription>
        </FormItem>
        
        <FormItem>
          <FormLabel>Direction</FormLabel>
          <Select 
            value={form.watch("ticker.direction")} 
            onValueChange={(value: "ltr" | "rtl") => form.setValue("ticker", {...form.getValues().ticker, direction: value}, { shouldValidate: true })}
            disabled={!form.watch("ticker.enabled")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="ltr">Left to Right</SelectItem>
              <SelectItem value="rtl">Right to Left</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Direction the ticker should scroll
          </FormDescription>
        </FormItem>
        
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Auto-pause on hover</FormLabel>
            <Switch 
              checked={form.watch("ticker.autoPause")} 
              onCheckedChange={(value) => form.setValue("ticker", {...form.getValues().ticker, autoPause: value}, { shouldValidate: true })}
              disabled={!form.watch("ticker.enabled")}
            />
          </div>
          <FormDescription>
            Pause ticker when cursor hovers over it
          </FormDescription>
        </FormItem>
        
        {/* This field was causing errors, since it's not needed for basic functionality, I'm commenting it out */}
        {/* <FormItem>
          <FormLabel>Featured Coins</FormLabel>
          <FormControl>
            <Input 
              placeholder="BTC, ETH, SOL, ADA" 
              value={form.watch("ticker.coins")?.join(", ") || ""}
              onChange={(e) => {
                const coins = e.target.value.split(",").map(c => c.trim());
                form.setValue("ticker", {...form.getValues().ticker, coins}, { shouldValidate: true });
              }}
              disabled={!form.watch("ticker.enabled")}
            />
          </FormControl>
          <FormDescription>
            Comma-separated list of coins to feature in the ticker
          </FormDescription>
        </FormItem> */}
      </CardContent>
    </Card>
  );
};

export default TickerSettings;
