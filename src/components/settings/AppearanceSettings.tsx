
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { SettingsFormValues } from "./types";

interface AppearanceSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ form }) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the application
        </p>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-4">Theme</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Mode</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setTheme(value);
                  }} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your preferred theme mode
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="layout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Layout</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your preferred layout style
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-4">Display Options</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="appearance.compactMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Compact Mode</FormLabel>
                  <FormDescription>
                    Use less space between elements for denser display
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
            name="appearance.animationsEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Enable Animations</FormLabel>
                  <FormDescription>
                    Turn on/off UI animations throughout the app
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
            name="appearance.highContrastMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>High Contrast Mode</FormLabel>
                  <FormDescription>
                    Increase contrast for better visibility
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
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-4">Chart Display</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="appearance.showPortfolioChart"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Portfolio Chart</FormLabel>
                  <FormDescription>
                    Show portfolio value chart on dashboard
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
            name="appearance.showTradingHistory"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Trading History</FormLabel>
                  <FormDescription>
                    Show recent trading activity on dashboard
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
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
