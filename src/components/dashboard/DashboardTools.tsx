
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Add useForm hook for TickerSettings
import { useForm } from "react-hook-form";
import { SettingsFormValues } from "@/components/settings/types";

const TickerSettings: React.FC<{
  form: any;
  onSave: (values: Partial<SettingsFormValues>) => void;
  defaultValues: Partial<SettingsFormValues>;
}> = ({ form, onSave, defaultValues }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticker Settings</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="tickerSettings.enabled"
              defaultValue={defaultValues?.tickerSettings?.enabled ?? true}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Ticker</FormLabel>
                    <FormDescription>Show real-time prices in a ticker.</FormDescription>
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
              name="tickerSettings.position"
              defaultValue={defaultValues?.tickerSettings?.position ?? "top"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker Position</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tickerSettings.speed"
              defaultValue={defaultValues?.tickerSettings?.speed ?? 50}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker Speed</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>Adjust the speed of the ticker.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tickerSettings.direction"
              defaultValue={defaultValues?.tickerSettings?.direction ?? "left"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker Direction</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const SidebarSettings: React.FC<{
  form: any;
  onSave: (values: Partial<SettingsFormValues>) => void;
  defaultValues: Partial<SettingsFormValues>;
}> = ({ form, onSave, defaultValues }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sidebar Settings</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="sidebarSettings.enabled"
              defaultValue={defaultValues?.sidebarSettings?.enabled ?? true}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Sidebar</FormLabel>
                    <FormDescription>Show or hide the sidebar.</FormDescription>
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
              name="sidebarSettings.position"
              defaultValue={defaultValues?.sidebarSettings?.position ?? "left"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sidebar Position</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sidebarSettings.defaultCollapsed"
              defaultValue={defaultValues?.sidebarSettings?.defaultCollapsed ?? false}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Start Collapsed</FormLabel>
                    <FormDescription>Start the sidebar in a collapsed state.</FormDescription>
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
            
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const DashboardTools: React.FC = () => {
  // Create a form for ticker settings
  const tickerSettingsForm = useForm<SettingsFormValues>({
    defaultValues: {
      tickerSettings: {
        enabled: true,
        position: 'top',
        speed: 50,
        direction: 'left',
        autoPause: true
      },
      notifications: {
        email: true,
        push: true,
        app: true
      }
    }
  });
  
  const sidebarSettingsForm = useForm<SettingsFormValues>({
    defaultValues: {
      sidebarSettings: {
        enabled: true,
        position: "left",
        defaultCollapsed: false,
        showLabels: true
      }
    }
  });
  
  return (
    <div className="space-y-6">
      <TickerSettings 
        form={tickerSettingsForm}
        onSave={(values) => {
          console.log("Ticker settings updated", values);
          toast({
            title: "Settings Updated",
            description: "Ticker settings have been updated successfully"
          });
        }} 
        defaultValues={{
          tickerSettings: {
            enabled: true,
            position: 'top',
            speed: 50,
            direction: 'left',
            autoPause: true
          },
          notifications: {
            email: true,
            push: true,
            app: true
          }
        }}
      />
      
      <SidebarSettings
        form={sidebarSettingsForm}
        onSave={(values) => {
          console.log("Sidebar settings updated", values);
          toast({
            title: "Settings Updated",
            description: "Sidebar settings have been updated successfully"
          });
        }}
        defaultValues={{
          sidebarSettings: {
            enabled: true,
            position: "left",
            defaultCollapsed: false,
            showLabels: true
          }
        }}
      />
    </div>
  );
};

export default DashboardTools;
