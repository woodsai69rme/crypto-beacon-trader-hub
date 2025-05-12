
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SettingsComponentProps } from "./types";
import { Gauge } from "lucide-react";

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Ticker Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="ticker.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Enable Ticker</FormLabel>
                <FormDescription>Show real-time price ticker on the interface</FormDescription>
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
                value={field.value as string} 
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="both">Top and Bottom</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose where you want the ticker to appear
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.speed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticker Speed</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value as number]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="py-4"
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow</span>
                <span>Medium</span>
                <span>Fast</span>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.direction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticker Direction</FormLabel>
              <FormControl>
                <RadioGroup 
                  value={field.value as string} 
                  onValueChange={field.onChange}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="ltr" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Left to Right</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="rtl" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Right to Left</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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
                <FormDescription>Pause ticker when hovering over prices</FormDescription>
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
      </CardContent>
    </Card>
  );
};

export default TickerSettings;
