
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { SettingsComponentProps } from "./types";
import { SupportedCurrency } from "@/types/trading";

const GeneralSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          General Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Display Name */}
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="john_doe" {...field} />
              </FormControl>
              <FormDescription>
                Your unique username for login.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Contact Email */}
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription>
                Your email for notifications and communication.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Language */}
        <FormField
          control={form.control}
          name="userLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="en-au">English (Australia)</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your preferred language for the interface.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Currency */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Currency</FormLabel>
              <Select 
                onValueChange={(val) => {
                  const currentCurrency = form.getValues().currency || { 
                    defaultCurrency: 'AUD' as SupportedCurrency, 
                    showConversion: true 
                  };
                  form.setValue("currency", {
                    ...currentCurrency,
                    defaultCurrency: val as SupportedCurrency
                  });
                }} 
                value={
                  typeof field.value === 'object' && field.value !== null
                    ? (field.value as any).defaultCurrency
                    : 'AUD'
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your default currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                All values will be shown in this currency by default.
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
