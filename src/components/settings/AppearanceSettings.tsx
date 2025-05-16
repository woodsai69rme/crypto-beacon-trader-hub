
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { SettingsComponentProps } from "./types";
import { useTheme, ColorScheme } from "@/contexts/ThemeContext";

const AppearanceSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  // Update form with current theme values
  React.useEffect(() => {
    // Set theme value if not already set
    if (!form.getValues().theme) {
      form.setValue("theme", theme);
    }
    
    // Initialize appearance settings
    const formValues = form.getValues();
    if (!formValues.appearance) {
      // Make sure display exists with defaults
      if (!formValues.display) {
        form.setValue("display", {
          showPortfolio: true,
          defaultTab: "overview",
          compactMode: false,
          animationsEnabled: true,
          highContrastMode: false
        });
      }
      
      // Set appearance settings
      form.setValue("appearance", {
        colorScheme: colorScheme,
        compactMode: false,
        animationsEnabled: true,
        highContrastMode: false
      });
    }
  }, [form, theme, colorScheme]);

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
    form.setValue("theme", value);
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as ColorScheme);
    
    // Update the appearance in the form
    const currentAppearance = form.getValues().appearance || {
      colorScheme: "default", 
      compactMode: false,
      animationsEnabled: true,
      highContrastMode: false
    };
    
    form.setValue("appearance", {
      ...currentAppearance,
      colorScheme: value
    });
  };
  
  // Get current values or set defaults for access in the UI
  const appearanceValues = form.getValues().appearance || {
    colorScheme: colorScheme,
    compactMode: false,
    animationsEnabled: true,
    highContrastMode: false
  };
  
  const displayValues = form.getValues().display || {
    showPortfolio: true,
    defaultTab: "overview",
    compactMode: false,
    animationsEnabled: true,
    highContrastMode: false
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
          
          <FormItem>
            <FormLabel>Color Scheme</FormLabel>
            <Select 
              onValueChange={(value) => handleColorSchemeChange(value)} 
              value={appearanceValues.colorScheme || colorScheme}
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
          </FormItem>
          
          <FormField
            control={form.control}
            name="display.compactMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Compact Mode</FormLabel>
                  <FormDescription>
                    Use a more compact interface layout
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Enable Animations</FormLabel>
              <FormDescription>
                Enable UI animations and transitions
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={displayValues.animationsEnabled || true}
                onCheckedChange={(checked) => {
                  form.setValue("display", {
                    ...displayValues,
                    animationsEnabled: checked
                  });
                }}
              />
            </FormControl>
          </FormItem>
          
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>High Contrast Mode</FormLabel>
              <FormDescription>
                Increase contrast for better visibility
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={displayValues.highContrastMode || false}
                onCheckedChange={(checked) => {
                  form.setValue("display", {
                    ...displayValues,
                    highContrastMode: checked
                  });
                }}
              />
            </FormControl>
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
