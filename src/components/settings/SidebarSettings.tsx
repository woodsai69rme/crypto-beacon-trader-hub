
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SettingsComponentProps } from './types';

const SidebarSettings: React.FC<SettingsComponentProps & {
  onSave: (values: any) => void;
}> = ({ form, onSave }) => {
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

export default SidebarSettings;
