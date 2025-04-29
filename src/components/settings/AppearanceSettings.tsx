
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AppearanceSettings = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  const colorSchemes = [
    { value: "default", label: "Default" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "amber", label: "Amber" },
    { value: "red", label: "Red" },
    { value: "purple", label: "Purple" },
    { value: "slate", label: "Slate" },
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Customize the appearance of your trading application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>App Theme</Label>
            <Tabs defaultValue={theme} value={theme} onValueChange={setTheme} className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="light">Light</TabsTrigger>
                <TabsTrigger value="dark">Dark</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <RadioGroup 
              value={colorScheme} 
              onValueChange={setColorScheme} 
              className="grid grid-cols-2 gap-2"
            >
              {colorSchemes.map((scheme) => (
                <div key={scheme.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={scheme.value} id={`color-${scheme.value}`} />
                  <Label htmlFor={`color-${scheme.value}`}>{scheme.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Density</Label>
            <Select defaultValue="comfortable">
              <SelectTrigger>
                <SelectValue placeholder="Select density" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="animate-charts" defaultChecked />
              <Label htmlFor="animate-charts">Animate charts</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="show-borders" defaultChecked />
              <Label htmlFor="show-borders">Show borders around cards</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="rounded-corners" defaultChecked />
              <Label htmlFor="rounded-corners">Use rounded corners</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="glassmorphism" />
              <Label htmlFor="glassmorphism">Enable glassmorphism effect</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="reduce-motion" />
              <Label htmlFor="reduce-motion">Reduce motion</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AppearanceSettings;
