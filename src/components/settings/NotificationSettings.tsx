
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const NotificationSettings = ({ form }: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="notifications.email"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Email Notifications</FormLabel>
              <FormDescription>
                Receive important updates via email
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
        name="dashboardCustomization.alertVolume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alert Volume</FormLabel>
            <FormControl>
              <Slider
                defaultValue={[field.value || 50]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => field.onChange(value[0])}
              />
            </FormControl>
            <FormDescription className="text-right">
              {field.value || 50}%
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dashboardCustomization.alertFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alert Frequency</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="high">High (All Events)</SelectItem>
                <SelectItem value="medium">Medium (Important Events)</SelectItem>
                <SelectItem value="low">Low (Critical Events Only)</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              How often you want to receive alert notifications
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};

export default NotificationSettings;
