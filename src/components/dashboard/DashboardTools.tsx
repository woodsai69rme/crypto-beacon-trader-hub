import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Add useForm hook for TickerSettings
import { useForm } from "react-hook-form";
import { SettingsFormValues } from "@/types/trading";

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
              name="ticker.enabled"
              defaultValue={defaultValues?.ticker?.enabled ?? true}
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
              name="ticker.position"
              defaultValue={defaultValues?.ticker?.position ?? "top"}
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
              name="ticker.speed"
              defaultValue={defaultValues?.ticker?.speed ?? 50}
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
              name="ticker.direction"
              defaultValue={defaultValues?.ticker?.direction ?? "left"}
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
            
            <FormField
              control={form.control}
              name="ticker.autoPause"
              defaultValue={defaultValues?.ticker?.autoPause ?? false}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Auto Pause on Hover</FormLabel>
                    <FormDescription>Pause the ticker when the mouse hovers over it.</FormDescription>
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
              name="sidebar.enabled"
              defaultValue={defaultValues?.sidebar?.enabled ?? true}
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
              name="sidebar.position"
              defaultValue={defaultValues?.sidebar?.position ?? "left"}
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
              name="sidebar.collapsed"
              defaultValue={defaultValues?.sidebar?.collapsed ?? false}
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
            
            <FormField
              control={form.control}
              name="sidebar.autoHide"
              defaultValue={defaultValues?.sidebar?.autoHide ?? false}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Auto Hide on Mobile</FormLabel>
                    <FormDescription>Automatically hide the sidebar on mobile devices.</FormDescription>
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
      notifications: {
        email: true,
        push: true,
        trades: true,
        pricing: true,
        news: false,
      },
      tradingPreferences: {
        autoConfirm: false,
        showAdvanced: true,
        defaultAsset: "BTC"
      }
    }
  });
  
  const sidebarSettingsForm = useForm<SettingsFormValues>({
    defaultValues: {
      sidebar: {
        enabled: true,
        position: "left",
        collapsed: false,
        autoHide: true,
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
          notifications: {
            email: true,
            push: true,
            trades: true,
            pricing: true,
            news: false,
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
          sidebar: {
            enabled: true,
            position: "left",
            collapsed: false,
            autoHide: true,
          }
        }}
      />
    </div>
  );
};

export default DashboardTools;
