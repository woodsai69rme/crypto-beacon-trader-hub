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

const AppearanceSettings = ({ form }: { form: UseFormReturn<SettingsFormValues> }) => {
  return (
    <div className="space-y-4">
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
        name="darkMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Dark Mode</FormLabel>
              <FormDescription>
                Enable dark mode for the application
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
