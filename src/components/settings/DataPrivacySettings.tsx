
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SettingsFormValues } from "./types";

interface DataPrivacySettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your privacy preferences and data sharing
        </p>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="text-sm font-medium mb-4">Profile Visibility</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="privacy.publicProfile"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Public Profile</FormLabel>
                  <FormDescription>
                    Make your profile visible to other users
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
            name="privacy.showPortfolio"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Portfolio Visibility</FormLabel>
                  <FormDescription>
                    Show your portfolio holdings to other users
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
            name="privacy.shareActivity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Activity Sharing</FormLabel>
                  <FormDescription>
                    Share your trading activity with other users
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
        <h4 className="text-sm font-medium mb-4">Data Collection</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dataPrivacy.shareAnalytics"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Usage Analytics</FormLabel>
                  <FormDescription>
                    Share anonymous usage data to help improve the platform
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
            name="dataPrivacy.storeHistory"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Trading History</FormLabel>
                  <FormDescription>
                    Store your trading history for personalized insights
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
        <h4 className="text-sm font-medium mb-4">Data Export</h4>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="exportFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Export Format</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select export format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Default format for exporting your data
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DataPrivacySettings;
