
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Paintbrush } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "@/types/trading";

interface AppearanceSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ form }) => {
  const { register, setValue, watch } = form;

  const handleSwitchChange = (field: string, checked: boolean) => {
    setValue(field as any, checked, { shouldDirty: true });
  };
  
  const handleRadioChange = (field: string, value: string) => {
    setValue(field as any, value, { shouldDirty: true });
  };
  
  const watchAppearance = watch('appearance') || { 
    colorScheme: 'system', 
    compactMode: false, 
    animationsEnabled: true,
    highContrastMode: false
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5" />
          Appearance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Theme</Label>
          <RadioGroup 
            value={watchAppearance.colorScheme} 
            onValueChange={(value) => handleRadioChange('appearance.colorScheme', value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system">System</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="compact-mode">Compact Mode</Label>
            <Switch 
              id="compact-mode" 
              checked={watchAppearance.compactMode}
              onCheckedChange={(checked) => handleSwitchChange('appearance.compactMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="animations-enabled">Enable Animations</Label>
            <Switch 
              id="animations-enabled" 
              checked={watchAppearance.animationsEnabled}
              onCheckedChange={(checked) => handleSwitchChange('appearance.animationsEnabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast Mode</Label>
            <Switch 
              id="high-contrast" 
              checked={watchAppearance.highContrastMode}
              onCheckedChange={(checked) => handleSwitchChange('appearance.highContrastMode', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
