
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";
import { SettingsComponentProps } from './types';

const DataPrivacySettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize privacy settings in the form
  React.useEffect(() => {
    const formValues = form.getValues();
    
    // Create default privacy values if they don't exist
    if (!formValues.privacy) {
      const privacyDefaults = {
        showOnlineStatus: true,
        sharePortfolio: false,
        shareTrades: false,
        dataCollection: true,
        marketingConsent: false,
        thirdPartySharing: false
      };

      // Update form with privacy defaults
      form.setValue("privacy", privacyDefaults);
    }
  }, [form]);

  // Get current values safely
  const privacyValues = form.getValues().privacy || {
    showOnlineStatus: true,
    sharePortfolio: false,
    shareTrades: false,
    dataCollection: true,
    marketingConsent: false,
    thirdPartySharing: false
  };

  // Helper function to update privacy settings
  const updatePrivacySetting = (field: string, value: boolean) => {
    form.setValue("privacy", {
      ...privacyValues,
      [field]: value
    });
  };

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
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Show Online Status</FormLabel>
            <FormDescription>
              Show when you're active on the platform to other users
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacyValues.showOnlineStatus}
              onCheckedChange={(checked) => updatePrivacySetting('showOnlineStatus', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Share Portfolio</FormLabel>
            <FormDescription>
              Let others see your portfolio composition (but not values)
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacyValues.sharePortfolio}
              onCheckedChange={(checked) => updatePrivacySetting('sharePortfolio', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Share Trades</FormLabel>
            <FormDescription>
              Let others see your recent trades (anonymized)
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacyValues.shareTrades}
              onCheckedChange={(checked) => updatePrivacySetting('shareTrades', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Usage Data Collection</FormLabel>
            <FormDescription>
              Allow collection of anonymized usage data to improve the platform
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacyValues.dataCollection}
              onCheckedChange={(checked) => updatePrivacySetting('dataCollection', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Marketing Communications</FormLabel>
            <FormDescription>
              Receive newsletters and promotional emails
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacyValues.marketingConsent}
              onCheckedChange={(checked) => updatePrivacySetting('marketingConsent', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Third-Party Data Sharing</FormLabel>
            <FormDescription>
              Allow sharing of data with trusted partners
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={privacyValues.thirdPartySharing}
              onCheckedChange={(checked) => updatePrivacySetting('thirdPartySharing', checked)}
            />
          </FormControl>
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
