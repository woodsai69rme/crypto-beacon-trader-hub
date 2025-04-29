
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { SettingsFormValues } from "./types";

interface GeneralSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal account details
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Brief description visible on your public profile
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mt-8">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize your general app preferences
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Zone</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                      <SelectItem value="CST">Central Time (CST)</SelectItem>
                      <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                      <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
