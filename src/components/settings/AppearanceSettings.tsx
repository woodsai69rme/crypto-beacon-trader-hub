
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const AppearanceSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme</h3>
        
        <RadioGroup defaultValue="system" className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem value="light" id="light" className="peer sr-only" />
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="mb-2">Light</span>
              <div className="w-full h-16 rounded-md bg-[#fff] border"></div>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
            <Label
              htmlFor="dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="mb-2">Dark</span>
              <div className="w-full h-16 rounded-md bg-[#121212]"></div>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="system" id="system" className="peer sr-only" />
            <Label
              htmlFor="system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="mb-2">System</span>
              <div className="w-full h-16 rounded-md bg-gradient-to-r from-white to-[#121212]"></div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Interface Density</h3>
        
        <RadioGroup defaultValue="comfortable" className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem value="compact" id="compact" className="peer sr-only" />
            <Label
              htmlFor="compact"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="mb-1">Compact</span>
              <div className="w-full space-y-1">
                <div className="h-1 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-1 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-1 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-1 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-1 w-full bg-muted-foreground/30 rounded-full"></div>
              </div>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="comfortable" id="comfortable" className="peer sr-only" />
            <Label
              htmlFor="comfortable"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="mb-1">Comfortable</span>
              <div className="w-full space-y-2">
                <div className="h-2 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-2 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-2 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-2 w-full bg-muted-foreground/30 rounded-full"></div>
              </div>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="spacious" id="spacious" className="peer sr-only" />
            <Label
              htmlFor="spacious"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="mb-1">Spacious</span>
              <div className="w-full space-y-3">
                <div className="h-2 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-2 w-full bg-muted-foreground/30 rounded-full"></div>
                <div className="h-2 w-full bg-muted-foreground/30 rounded-full"></div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Display Options</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations">Enable Animations</Label>
            <Switch id="animations" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion">Reduce Motion</Label>
            <Switch id="reduced-motion" />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast</Label>
            <Switch id="high-contrast" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Chart Animation Speed</h3>
          <span className="text-sm text-muted-foreground">Normal</span>
        </div>
        
        <Slider defaultValue={[50]} min={0} max={100} step={10} />
      </div>
    </div>
  );
};

export default AppearanceSettings;
