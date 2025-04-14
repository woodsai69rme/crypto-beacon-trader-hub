
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
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface AppearanceSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const AppearanceSettings = ({ form }: AppearanceSettingsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AppearanceSettings;
