
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";
import { SettingsComponentProps } from './types';

const DataPrivacySettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize privacy object if it doesn't exist
  const formValues = form.getValues();
  
  if (!formValues.privacy) {
    form.setValue("privacy", {
      showOnlineStatus: true,
      sharePortfolio: false,
      shareTrades: false,
      dataCollection: true,
      marketingConsent: false,
      thirdPartySharing: false
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Data & Privacy
        </CardTitle>
        <CardDescription>
          Control how your data is used and shared
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="privacy.showOnlineStatus"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Show Online Status</FormLabel>
                <FormDescription>
                  Show when you're active on the platform to other users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
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
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Share Portfolio</FormLabel>
                <FormDescription>
                  Let others see your portfolio composition (but not values)
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
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
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Share Trades</FormLabel>
                <FormDescription>
                  Let others see your recent trades (anonymized)
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="privacy.dataCollection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Usage Data Collection</FormLabel>
                <FormDescription>
                  Allow collection of anonymized usage data to improve the platform
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="privacy.marketingConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Marketing Communications</FormLabel>
                <FormDescription>
                  Receive newsletters and promotional emails
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="privacy.thirdPartySharing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Third-Party Data Sharing</FormLabel>
                <FormDescription>
                  Allow sharing of data with trusted partners
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
