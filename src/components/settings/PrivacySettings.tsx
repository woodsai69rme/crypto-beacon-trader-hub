
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/types/trading";

interface PrivacySettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ form }) => {
  const { register, setValue, watch } = form;

  const handleSwitchChange = (field: string, checked: boolean) => {
    setValue(field as any, checked, { shouldDirty: true });
  };
  
  const watchPrivacy = watch('privacy') || {
    showOnlineStatus: true,
    sharePortfolio: false,
    shareTrades: false,
    dataCollection: true,
    marketingConsent: false,
    thirdPartySharing: false
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy
        </CardTitle>
        <CardDescription>
          Manage how your data is used and shared
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-online-status">Show Online Status</Label>
            <Switch 
              id="show-online-status" 
              checked={watchPrivacy.showOnlineStatus}
              onCheckedChange={(checked) => handleSwitchChange('privacy.showOnlineStatus', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="share-portfolio">Share Portfolio</Label>
            <Switch 
              id="share-portfolio" 
              checked={watchPrivacy.sharePortfolio}
              onCheckedChange={(checked) => handleSwitchChange('privacy.sharePortfolio', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="share-trades">Share Trades</Label>
            <Switch 
              id="share-trades" 
              checked={watchPrivacy.shareTrades}
              onCheckedChange={(checked) => handleSwitchChange('privacy.shareTrades', checked)}
            />
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium mb-3">Data Usage</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-collection">Usage Analytics</Label>
              <Switch 
                id="data-collection" 
                checked={watchPrivacy.dataCollection}
                onCheckedChange={(checked) => handleSwitchChange('privacy.dataCollection', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-consent">Marketing Communications</Label>
              <Switch 
                id="marketing-consent" 
                checked={watchPrivacy.marketingConsent}
                onCheckedChange={(checked) => handleSwitchChange('privacy.marketingConsent', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="third-party-sharing">Third-Party Data Sharing</Label>
              <Switch 
                id="third-party-sharing" 
                checked={watchPrivacy.thirdPartySharing}
                onCheckedChange={(checked) => handleSwitchChange('privacy.thirdPartySharing', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
