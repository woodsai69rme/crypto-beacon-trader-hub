
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface AppearanceSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the application
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <Select
              value={form.watch("theme.mode")}
              onValueChange={(value) => form.setValue("theme.mode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <Select
              value={form.watch("theme.accent")}
              onValueChange={(value) => form.setValue("theme.accent", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select accent color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Sidebar Position</Label>
            <Select
              value={form.watch("sidebar.position")}
              onValueChange={(value) => form.setValue("sidebar.position", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sidebar position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-labels">Show Sidebar Labels</Label>
            <Switch
              id="show-labels"
              checked={form.watch("sidebar.showLabels")}
              onCheckedChange={(checked) => form.setValue("sidebar.showLabels", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="compact-mode">Compact Mode</Label>
            <Switch
              id="compact-mode"
              checked={form.watch("ui.compactMode")}
              onCheckedChange={(checked) => form.setValue("ui.compactMode", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
            <Switch
              id="reduced-motion"
              checked={form.watch("accessibility.reducedMotion")}
              onCheckedChange={(checked) => form.setValue("accessibility.reducedMotion", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast</Label>
            <Switch
              id="high-contrast"
              checked={form.watch("accessibility.highContrast")}
              onCheckedChange={(checked) => form.setValue("accessibility.highContrast", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
