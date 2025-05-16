
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";
import { SettingsComponentProps } from "./types";

const DataPrivacySettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize privacy settings if they don't exist
  useEffect(() => {
    const privacyValues = form.getValues().privacy;
    if (!privacyValues) {
      form.setValue("privacy", {
        showOnlineStatus: true,
        sharePortfolio: false,
        shareTrades: false,
        dataCollection: true,
        marketingConsent: false,
        thirdPartySharing: false
      });
    }
  }, [form]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Data & Privacy
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Show Online Status</FormLabel>
              <FormDescription>
                Allow others to see when you are online
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().privacy?.showOnlineStatus ?? true}
                onCheckedChange={(checked) => {
                  form.setValue("privacy", {
                    ...form.getValues().privacy,
                    showOnlineStatus: checked
                  });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Share Portfolio</FormLabel>
              <FormDescription>
                Allow others to view your portfolio
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().privacy?.sharePortfolio ?? false}
                onCheckedChange={(checked) => {
                  form.setValue("privacy", {
                    ...form.getValues().privacy,
                    sharePortfolio: checked
                  });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Share Trades</FormLabel>
              <FormDescription>
                Allow others to view your trading activity
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().privacy?.shareTrades ?? false}
                onCheckedChange={(checked) => {
                  form.setValue("privacy", {
                    ...form.getValues().privacy,
                    shareTrades: checked
                  });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Data Collection</FormLabel>
              <FormDescription>
                Allow us to collect usage data to improve your experience
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().privacy?.dataCollection ?? true}
                onCheckedChange={(checked) => {
                  form.setValue("privacy", {
                    ...form.getValues().privacy,
                    dataCollection: checked
                  });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Marketing Consent</FormLabel>
              <FormDescription>
                Receive marketing communications from us
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().privacy?.marketingConsent ?? false}
                onCheckedChange={(checked) => {
                  form.setValue("privacy", {
                    ...form.getValues().privacy,
                    marketingConsent: checked
                  });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Third-Party Data Sharing</FormLabel>
              <FormDescription>
                Allow us to share your data with trusted partners
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().privacy?.thirdPartySharing ?? false}
                onCheckedChange={(checked) => {
                  form.setValue("privacy", {
                    ...form.getValues().privacy,
                    thirdPartySharing: checked
                  });
                }}
              />
            </FormControl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
