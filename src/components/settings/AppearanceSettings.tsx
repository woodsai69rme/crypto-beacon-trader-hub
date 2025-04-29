
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";
import { useTheme } from "@/contexts/ThemeContext";

const AppearanceSettings = ({ form }: { form: UseFormReturn<SettingsFormValues> }) => {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();

  const colorSchemes = [
    { id: 'default', name: 'Default Dark', color: '#222333', description: 'Classic dark theme' },
    { id: 'blue', name: 'Deep Blue', color: '#112240', description: 'Cool blue theme' },
    { id: 'purple', name: 'Royal Purple', color: '#1E1B2E', description: 'Rich purple theme' },
    { id: 'green', name: 'Emerald', color: '#0F2922', description: 'Calming green theme' },
    { id: 'amber', name: 'Amber', color: '#332211', description: 'Warm amber theme' },
    { id: 'red', name: 'Ruby', color: '#2C151B', description: 'Deep red theme' },
    { id: 'slate', name: 'Slate', color: '#1E293B', description: 'Professional slate theme' },
  ];

  return (
    <div className="space-y-4">
      {/* Theme Mode Selection */}
      <div className="rounded-lg border p-4">
        <FormLabel className="text-lg font-medium mb-2 block">Theme Mode</FormLabel>
        <FormDescription className="mb-4">
          Select the theme mode for the application (Dark mode only in this version)
        </FormDescription>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="theme-dark" checked={true} disabled />
            <Label htmlFor="theme-dark">Dark</Label>
          </div>
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div className="rounded-lg border p-4">
        <FormLabel className="text-lg font-medium mb-2 block">Color Scheme</FormLabel>
        <FormDescription className="mb-4">
          Choose a color scheme for the application
        </FormDescription>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {colorSchemes.map((scheme) => (
            <div 
              key={scheme.id}
              className={`cursor-pointer rounded-md p-2 flex flex-col items-center gap-2 border transition-all hover:scale-105 ${
                colorScheme === scheme.id ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-border'
              }`}
              onClick={() => setColorScheme(scheme.id as any)}
            >
              <div 
                className="w-full h-12 rounded-md" 
                style={{ backgroundColor: scheme.color }} 
              />
              <span className="text-xs text-center font-medium">{scheme.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Options */}
      <FormField
        control={form.control}
        name="appearance.compactMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Compact Mode</FormLabel>
              <FormDescription>
                Use a more compact layout throughout the app
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Animations</FormLabel>
              <FormDescription>
                Enable animations throughout the application
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">High Contrast Mode</FormLabel>
              <FormDescription>
                Use high contrast colors for better visibility
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
                <SelectItem value="expanded">Expanded</SelectItem>
                <SelectItem value="trading">Trading Focus</SelectItem>
                <SelectItem value="portfolio">Portfolio Focus</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dashboardCustomization.defaultTimeframe"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Default Chart Timeframe</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-wrap gap-2"
              >
                {[
                  { value: '1D', label: '1D' },
                  { value: '1W', label: '1W' },
                  { value: '1M', label: '1M' },
                  { value: '3M', label: '3M' },
                  { value: '6M', label: '6M' },
                  { value: '1Y', label: '1Y' },
                  { value: 'MAX', label: 'MAX' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`timeframe-${option.value}`} />
                    <Label htmlFor={`timeframe-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormDescription>
              The default timeframe for charts across the platform
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};

export default AppearanceSettings;
