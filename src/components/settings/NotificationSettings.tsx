
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const NotificationSettings = ({ form }: NotificationSettingsProps) => {
  return (
    <FormField
      control={form.control}
      name="notifications"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Push Notifications</FormLabel>
            <FormDescription>
              Receive alerts for price changes and important events
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
  );
};

export default NotificationSettings;
