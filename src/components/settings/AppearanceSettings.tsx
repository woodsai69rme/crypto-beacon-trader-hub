
import React from "react";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { SettingsComponentProps } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

const AppearanceSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Theme</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setTheme(value as "light" | "dark");
                  }} 
                  defaultValue={theme}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dark">Dark (Default)</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your preferred base theme
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="colorScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Scheme</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setColorScheme(value as any);
                  }} 
                  defaultValue={colorScheme}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color scheme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="midnight-tech">Midnight Tech</SelectItem>
                    <SelectItem value="cyber-pulse">Cyber Pulse</SelectItem>
                    <SelectItem value="matrix-code">Matrix Code</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your preferred color scheme
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="overflow-hidden border-2 hover:border-primary cursor-pointer transition-all" 
                onClick={() => setColorScheme("default")}>
            <div className="h-20 bg-card"></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Default</p>
              {colorScheme === "default" && (
                <div className="mt-1 text-xs text-primary">Current selection</div>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-2 hover:border-primary cursor-pointer transition-all" 
                onClick={() => setColorScheme("midnight-tech")}>
            <div className="h-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B]"></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Midnight Tech</p>
              {colorScheme === "midnight-tech" && (
                <div className="mt-1 text-xs text-primary">Current selection</div>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-2 hover:border-primary cursor-pointer transition-all" 
                onClick={() => setColorScheme("cyber-pulse")}>
            <div className="h-20 bg-gradient-to-br from-[#13111C] to-[#1E1B2E]"></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Cyber Pulse</p>
              {colorScheme === "cyber-pulse" && (
                <div className="mt-1 text-xs text-primary">Current selection</div>
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-2 hover:border-primary cursor-pointer transition-all" 
                onClick={() => setColorScheme("matrix-code")}>
            <div className="h-20 bg-gradient-to-br from-[#0A1F1B] to-[#0F2922]"></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Matrix Code</p>
              {colorScheme === "matrix-code" && (
                <div className="mt-1 text-xs text-primary">Current selection</div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <FormField
          control={form.control}
          name="appearance.compactMode"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4 mt-6">
              <div className="space-y-0.5">
                <FormLabel>Compact Mode</FormLabel>
                <FormDescription>Use a more dense layout to fit more content</FormDescription>
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
          name="appearance.animationsEnabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Enable Animations</FormLabel>
                <FormDescription>Toggle UI animations and transitions</FormDescription>
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
          name="appearance.highContrastMode"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>High Contrast Mode</FormLabel>
                <FormDescription>Increase contrast for better visibility</FormDescription>
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
        <h3 className="text-lg font-medium">Trading Interface</h3>
        
        <FormField
          control={form.control}
          name="layout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dashboard Layout</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="traderview">TradingView Style</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Organize your dashboard modules
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="appearance.showTradingHistory"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Show Trading History</FormLabel>
                <FormDescription>Display your recent trades on the dashboard</FormDescription>
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
          name="appearance.showPortfolioChart"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Show Portfolio Chart</FormLabel>
                <FormDescription>Display portfolio performance chart on the dashboard</FormDescription>
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
          name="trading.confirmTradeExecutions"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Confirm Trade Executions</FormLabel>
                <FormDescription>Show confirmation dialog before executing trades</FormDescription>
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
          name="trading.showPriceAlerts"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Show Price Alerts</FormLabel>
                <FormDescription>Display price alert notifications on the trading interface</FormDescription>
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
    </div>
  );
};

export default AppearanceSettings;
