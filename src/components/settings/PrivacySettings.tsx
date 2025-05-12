
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface PrivacySettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control your data and privacy preferences
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="data-collection" className="block">Data Collection</Label>
            <p className="text-sm text-muted-foreground">Allow anonymous usage data collection to improve the app</p>
          </div>
          <Switch
            id="data-collection"
            checked={form.watch("privacy.dataCollection")}
            onCheckedChange={(checked) => form.setValue("privacy.dataCollection", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="personalization" className="block">Personalization</Label>
            <p className="text-sm text-muted-foreground">Allow personalized recommendations based on your activity</p>
          </div>
          <Switch
            id="personalization"
            checked={form.watch("privacy.personalization")}
            onCheckedChange={(checked) => form.setValue("privacy.personalization", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="marketing-emails" className="block">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
          </div>
          <Switch
            id="marketing-emails"
            checked={form.watch("privacy.marketingEmails")}
            onCheckedChange={(checked) => form.setValue("privacy.marketingEmails", checked)}
          />
        </div>
        
        <div className="space-y-2 pt-2">
          <Label>Data Visibility</Label>
          <RadioGroup
            value={form.watch("privacy.dataVisibility")}
            onValueChange={(value) => form.setValue("privacy.dataVisibility", value)}
            className="space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">Public - Anyone can view your profile and portfolio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="followers" />
              <Label htmlFor="followers">Followers - Only people you approve can view your data</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">Private - Your data is visible only to you</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-medium">Data Management</h4>
        
        <div className="flex gap-2">
          <Button variant="outline">Export Your Data</Button>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
