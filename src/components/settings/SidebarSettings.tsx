
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsComponentProps } from "./types";
import { Sidebar } from "lucide-react";

const SidebarSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sidebar className="h-5 w-5" />
          Sidebar Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="sidebar.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Enable Sidebar</FormLabel>
                <FormDescription>Show sidebar navigation panel</FormDescription>
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
        
        <FormField
          control={form.control}
          name="sidebar.position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sidebar Position</FormLabel>
              <Select 
                value={field.value as string} 
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Position the sidebar on either side of the screen
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sidebar.collapsed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Default Collapsed</FormLabel>
                <FormDescription>Start with sidebar collapsed</FormDescription>
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
        
        <FormField
          control={form.control}
          name="sidebar.showLabels"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Show Text Labels</FormLabel>
                <FormDescription>Display text labels with sidebar icons</FormDescription>
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
      </CardContent>
    </Card>
  );
};

export default SidebarSettings;
