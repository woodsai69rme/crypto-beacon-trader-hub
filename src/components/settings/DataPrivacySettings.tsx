
import React from "react";
import { SettingsComponentProps } from "./types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Trash } from "lucide-react";

const DataPrivacySettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="privacy.showOnlineStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Public Profile</FormLabel>
                  <FormDescription>
                    Allow others to view your profile.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="privacy.sharePortfolio"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Show Portfolio</FormLabel>
                  <FormDescription>
                    Make your portfolio visible to other users.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="privacy.shareTrades"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Share Activity</FormLabel>
                  <FormDescription>
                    Share your trading activity with the community.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">Data Management</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dataPrivacy.enableTracking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Share Analytics</FormLabel>
                  <FormDescription>
                    Allow us to collect anonymous usage data to improve the app.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Store Trading History</FormLabel>
                  <FormDescription>
                    Save your trading history for future analysis.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">Export & Delete</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="exportFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Export Format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="JSON">JSON</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex items-center gap-1" variant="secondary">
              <Download className="h-4 w-4" />
              Export My Data
            </Button>
            <Button className="flex items-center gap-1" variant="destructive">
              <Trash className="h-4 w-4" />
              Delete My Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataPrivacySettings;
