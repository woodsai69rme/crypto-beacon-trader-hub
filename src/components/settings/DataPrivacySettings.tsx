
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Database, Lock } from "lucide-react";
import { SettingsComponentProps } from "./types";

const DataPrivacySettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize privacy object if it doesn't exist
  if (!form.getValues().privacy) {
    form.setValue("privacy", {
      showOnlineStatus: false,
      sharePortfolio: false,
      shareTrades: false,
      dataCollection: false,
      marketingConsent: false,
      thirdPartySharing: false
    });
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data & Privacy
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {form.getValues().privacy && (
            <>
              <FormField
                control={form.control}
                name="privacy.dataCollection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Usage Analytics</FormLabel>
                      <FormDescription>
                        Allow us to collect anonymous usage data to improve the platform
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
                name="privacy.marketingConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Marketing Communications</FormLabel>
                      <FormDescription>
                        Receive marketing communications and offers
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
                name="privacy.thirdPartySharing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Third-Party Data Sharing</FormLabel>
                      <FormDescription>
                        Allow sharing your data with trusted partners
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
            </>
          )}
          
          <div className="pt-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" /> Data Protection
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Your data is encrypted and stored securely. You can request a copy or deletion of your data at any time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacySettings;
