import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { SettingsFormValues } from '@/types/trading';

export interface SidebarSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const SidebarSettings: React.FC<SidebarSettingsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sidebar Settings</h3>
      
      <FormField
        control={form.control}
        name="display.compactMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Compact Mode</FormLabel>
              <FormDescription>Display sidebar in compact mode by default</FormDescription>
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
      
      {/* Add more sidebar settings as needed */}
    </div>
  );
};

export default SidebarSettings;
