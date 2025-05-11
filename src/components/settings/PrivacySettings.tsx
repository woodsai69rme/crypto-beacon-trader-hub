
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, UserCheck, Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface PrivacySettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ form }) => {
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
  
  // Initialize account object if it doesn't exist
  if (!form.getValues().account) {
    form.setValue("account", {
      twoFactorEnabled: false,
      loginAlerts: false
    });
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Security
        </CardTitle>
        <CardDescription>
          Manage your privacy settings and security preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy Settings</h3>
          
          {form.getValues().privacy && (
            <>
              <FormField
                control={form.control}
                name="privacy.showOnlineStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Show Online Status</FormLabel>
                      <FormDescription>
                        Let others see when you're active on the platform
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
                name="privacy.sharePortfolio"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Share Portfolio</FormLabel>
                      <FormDescription>
                        Allow others to see your portfolio holdings
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
                name="privacy.shareTrades"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Share Trades</FormLabel>
                      <FormDescription>
                        Publish your trades for others to see
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
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security Settings</h3>
          
          {form.getValues().account && (
            <>
              <FormField
                control={form.control}
                name="account.twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Two-Factor Authentication</FormLabel>
                      <FormDescription>
                        Add an extra layer of security to your account
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
                name="account.loginAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Login Alerts</FormLabel>
                      <FormDescription>
                        Get notified when your account is accessed from a new device
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
