
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { SettingsComponentProps } from "./types";
import { ColorScheme, useTheme } from "@/contexts/ThemeContext";

const AppearanceSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  // Initialize appearance object if it doesn't exist
  if (!form.getValues().appearance) {
    form.setValue("appearance", {
      colorScheme: colorScheme,
      compactMode: false,
      animationsEnabled: true,
      highContrastMode: false
    });
  }

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark");
    form.setValue("theme", value);
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as ColorScheme);
    if (form.getValues().appearance) {
      form.setValue("appearance.colorScheme", value);
    }
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
          
          {form.getValues().appearance && (
            <>
              <FormField
                control={form.control}
                name="appearance.colorScheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Scheme</FormLabel>
                    <Select 
                      onValueChange={(value) => handleColorSchemeChange(value)} 
                      value={field.value || colorScheme}
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
                )}
              />
              
              <FormField
                control={form.control}
                name="appearance.compactMode"
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
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appearance.animationsEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Animations</FormLabel>
                      <FormDescription>
                        Enable UI animations and transitions
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
                name="appearance.highContrastMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>High Contrast Mode</FormLabel>
                      <FormDescription>
                        Increase contrast for better visibility
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

export default AppearanceSettings;
