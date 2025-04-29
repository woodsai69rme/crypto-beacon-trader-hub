
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { SettingsComponentProps } from "./types";

const GeneralSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Information</h3>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Your email address is used for notifications and account recovery.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Your unique username for this platform.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is how your name will appear to others.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Tell us a bit about yourself..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormDescription>
                Brief description visible on your profile.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Regional Settings</h3>
        
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your preferred language for the interface.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time zone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Used for displaying times and dates correctly.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GeneralSettings;
