
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { SettingsComponentProps } from "./types";
import { useTheme } from "@/hooks/use-theme";
import { ColorScheme, Theme } from "@/contexts/ThemeContext";

const AppearanceSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  // Update form with current theme values
  React.useEffect(() => {
    // Set theme value if not already set
    if (!form.getValues().theme) {
      form.setValue("theme", theme);
    }
    
    // Initialize display object with proper values
    const formValues = form.getValues();
    if (!formValues.display) {
      form.setValue("display", {
        showPortfolio: true,
        showBalances: true, // Added missing required property
        defaultTab: "overview",
        compactMode: false,
        animationsEnabled: true,
        highContrastMode: false,
        colorScheme: colorScheme
      });
    }
  }, [form, theme, colorScheme]);

  const handleThemeChange = (value: string) => {
    setTheme(value as Theme);
    form.setValue("theme", value);
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as ColorScheme);
    form.setValue("display", {
      ...form.getValues().display,
      colorScheme: value
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select 
                  onValueChange={(value) => handleThemeChange(value)} 
                  value={field.value || theme}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your preferred theme
                </FormDescription>
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Color Scheme</FormLabel>
            <Select 
              onValueChange={(value) => handleColorSchemeChange(value)} 
              value={form.getValues().display?.colorScheme || colorScheme}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color scheme" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="midnight-tech">Midnight Tech</SelectItem>
                <SelectItem value="cyber-pulse">Cyber Pulse</SelectItem>
                <SelectItem value="matrix-code">Matrix Code</SelectItem>
                <SelectItem value="neon-future">Neon Future</SelectItem>
                <SelectItem value="sunset-gradient">Sunset Gradient</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose your preferred theme style
            </FormDescription>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Compact Mode</FormLabel>
              <FormDescription>
                Use a more compact interface layout
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().display?.compactMode || false}
                onCheckedChange={(checked) => {
                  form.setValue("display", {
                    ...form.getValues().display,
                    compactMode: checked
                  });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Enable Animations</FormLabel>
              <FormDescription>
                Enable UI animations and transitions
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().display?.animationsEnabled || true}
                onCheckedChange={(checked) => {
                  form.setValue("display", {
                    ...form.getValues().display,
                    animationsEnabled: checked
                  });
                }}
              />
            </FormControl>
          </div>
          
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>High Contrast Mode</FormLabel>
              <FormDescription>
                Increase contrast for better visibility
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={form.getValues().display?.highContrastMode || false}
                onCheckedChange={(checked) => {
                  form.setValue("display", {
                    ...form.getValues().display,
                    highContrastMode: checked
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

export default AppearanceSettings;
