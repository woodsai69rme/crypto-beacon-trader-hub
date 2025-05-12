
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { PanelLeft } from "lucide-react";

interface SidebarSettingsProps {
  initialValues?: {
    enabled: boolean;
    position: string;
    defaultCollapsed: boolean;
    showLabels: boolean;
    autoHide: boolean;
  };
}

const SidebarSettings: React.FC<SidebarSettingsProps> = ({
  initialValues = {
    enabled: true,
    position: 'left',
    defaultCollapsed: false,
    showLabels: true,
    autoHide: false,
  },
}) => {
  const form = useForm({
    defaultValues: {
      "sidebar.enabled": initialValues.enabled,
      "sidebar.position": initialValues.position,
      "sidebar.defaultCollapsed": initialValues.defaultCollapsed,
      "sidebar.showLabels": initialValues.showLabels,
      "sidebar.autoHide": initialValues.autoHide,
    }
  });
  
  const onSubmit = (data: any) => {
    console.log('Sidebar settings updated:', data);
    toast({
      title: "Settings Updated",
      description: "Your sidebar settings have been saved.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PanelLeft className="h-5 w-5" />
          Sidebar Settings
        </CardTitle>
        <CardDescription>
          Configure your application sidebar appearance and behavior
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sidebar.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Sidebar</FormLabel>
                    <FormDescription>
                      Show or hide the navigation sidebar.
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
            
            {form.watch("sidebar.enabled") && (
              <>
                <FormField
                  control={form.control}
                  name="sidebar.position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sidebar Position</FormLabel>
                      <FormDescription>
                        Choose which side of the screen to display the sidebar.
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="left" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Left Side (Default)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="right" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Right Side
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sidebar.defaultCollapsed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Collapsed by Default</FormLabel>
                        <FormDescription>
                          Start with a collapsed sidebar to save screen space.
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
                  name="sidebar.showLabels"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Show Labels</FormLabel>
                        <FormDescription>
                          Display text labels next to sidebar icons.
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
                  name="sidebar.autoHide"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Auto-hide Sidebar</FormLabel>
                        <FormDescription>
                          Automatically hide the sidebar when not in use.
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
            
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SidebarSettings;
