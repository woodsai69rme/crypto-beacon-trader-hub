
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface AppearanceSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ form }) => {
  const hasAppearanceField = !!form.getValues().appearance;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how the application looks and feels
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="light" id="light" className="sr-only" />
                      <Label
                        htmlFor="light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="mb-2 h-6 w-6 rounded-full bg-[#eaeaea] border border-[#ddd]" />
                        Light
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="dark" id="dark" className="sr-only" />
                      <Label
                        htmlFor="dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                      >
                        <div className="mb-2 h-6 w-6 rounded-full bg-[#262626] border border-[#333]" />
                        Dark
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {hasAppearanceField && 'colorScheme' in form.getValues().appearance! && (
            <FormItem className="space-y-2">
              <FormLabel>Color Scheme</FormLabel>
              <RadioGroup
                value={form.getValues().appearance?.colorScheme || "default"}
                onValueChange={(value) => form.setValue('appearance.colorScheme', value)}
                className="grid grid-cols-3 gap-2"
              >
                <div>
                  <RadioGroupItem value="default" id="default" className="sr-only" />
                  <Label
                    htmlFor="default"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-1 h-4 w-4 rounded-full bg-[#8b5cf6]" />
                    Default
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="blue" id="blue" className="sr-only" />
                  <Label
                    htmlFor="blue"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-1 h-4 w-4 rounded-full bg-[#3b82f6]" />
                    Blue
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="green" id="green" className="sr-only" />
                  <Label
                    htmlFor="green"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-1 h-4 w-4 rounded-full bg-[#10b981]" />
                    Green
                  </Label>
                </div>
              </RadioGroup>
            </FormItem>
          )}

          {hasAppearanceField && 'compactMode' in form.getValues().appearance! && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Compact Mode</Label>
                <p className="text-xs text-muted-foreground">Use a more compact user interface</p>
              </div>
              <Switch
                checked={!!form.getValues().appearance?.compactMode}
                onCheckedChange={(checked) => form.setValue('appearance.compactMode', checked)}
              />
            </div>
          )}

          {hasAppearanceField && 'animationsEnabled' in form.getValues().appearance! && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Enable Animations</Label>
                <p className="text-xs text-muted-foreground">Show animations throughout the interface</p>
              </div>
              <Switch
                checked={!!form.getValues().appearance?.animationsEnabled}
                onCheckedChange={(checked) => form.setValue('appearance.animationsEnabled', checked)}
              />
            </div>
          )}

          {hasAppearanceField && 'highContrastMode' in form.getValues().appearance! && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">High Contrast Mode</Label>
                <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
              </div>
              <Switch
                checked={!!form.getValues().appearance?.highContrastMode}
                onCheckedChange={(checked) => form.setValue('appearance.highContrastMode', checked)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
