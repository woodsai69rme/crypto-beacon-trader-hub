
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsComponentProps } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ticker Settings</h3>
        
        <FormField
          control={form.control}
          name="ticker.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Enable Tickers</FormLabel>
                <FormDescription>Show live price and news tickers</FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ticker position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="top">Top Only</SelectItem>
                  <SelectItem value="bottom">Bottom Only</SelectItem>
                  <SelectItem value="both">Top and Bottom</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose where to display price tickers
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
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <div className="w-12 text-center">
                  <span className="text-sm">{field.value}</span>
                </div>
              </div>
              <FormDescription>
                Set how fast the tickers move (lower is faster)
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.direction"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Ticker Direction</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="left" />
                    <Label htmlFor="left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="right" />
                    <Label htmlFor="right">Right</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Direction of ticker scrolling
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ticker.autoPause"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Auto-pause on Hover</FormLabel>
                <FormDescription>Pause ticker when mouse hovers over it</FormDescription>
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
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sidebar Settings</h3>
        
        <FormField
          control={form.control}
          name="sidebar.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Enable Sidebar</FormLabel>
                <FormDescription>Show information sidebar</FormDescription>
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
          name="sidebar.position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sidebar Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sidebar position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left Side</SelectItem>
                  <SelectItem value="right">Right Side</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose which side to display the sidebar
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sidebar.defaultCollapsed"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Default Collapsed State</FormLabel>
                <FormDescription>Start with sidebar collapsed</FormDescription>
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
          name="sidebar.showLabels"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Show Labels when Collapsed</FormLabel>
                <FormDescription>Display tooltips when hovering icons in collapsed sidebar</FormDescription>
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card className="overflow-hidden">
          <div className="p-4 bg-primary/10">
            <h4 className="text-sm font-medium">Ticker Preview</h4>
          </div>
          <CardContent className="p-3">
            <div className="h-8 bg-primary/5 animate-pulse-slow rounded flex items-center px-3">
              <div className="w-4 h-4 rounded-full bg-primary/20 mr-2"></div>
              <div className="h-3 w-16 bg-primary/20 rounded"></div>
              <div className="h-3 w-3 bg-transparent mx-2"></div>
              <div className="h-3 w-24 bg-primary/10 rounded"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="p-4 bg-primary/10">
            <h4 className="text-sm font-medium">Sidebar Preview</h4>
          </div>
          <CardContent className="p-3">
            <div className="flex gap-2">
              <div className="w-10 h-32 bg-primary/5 rounded border border-primary/10"></div>
              <div className="flex-1 h-32 flex flex-col gap-2 py-1">
                <div className="h-6 w-3/4 bg-primary/10 rounded"></div>
                <div className="h-3 w-full bg-primary/5 rounded"></div>
                <div className="h-3 w-5/6 bg-primary/5 rounded"></div>
                <div className="h-3 w-4/6 bg-primary/5 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TickerSettings;
