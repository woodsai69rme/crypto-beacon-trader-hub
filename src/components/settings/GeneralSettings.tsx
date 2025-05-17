
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Languages } from '@/constants/languages';
import { UseFormReturn } from 'react-hook-form';
import { SettingsFormValues } from './types';
import { Globe2 } from "lucide-react";
import { SupportedCurrency } from './types';

interface GeneralSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ form }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('USD');

  useEffect(() => {
    // Initialize selected currency from form values
    const currentCurrency = form.getValues('currency');
    if (currentCurrency) {
      setSelectedCurrency(currentCurrency as SupportedCurrency);
    }
  }, [form]);

  const handleCurrencyChange = (currencyCode: string) => {
    const typedCurrencyCode = currencyCode as SupportedCurrency;
    setSelectedCurrency(typedCurrencyCode);

    // Set the currency directly as a string
    form.setValue('currency', typedCurrencyCode, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe2 className="h-5 w-5" />
          General Settings
        </CardTitle>
        <CardDescription>
          Manage your basic account settings and preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Display Name" {...form.register('displayName')} />
            </FormControl>
            <FormDescription>
              This is the name that will be displayed to other users.
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Your Username" {...form.register('username')} />
            </FormControl>
            <FormDescription>
              This is your unique username. It cannot be changed.
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input placeholder="Your Contact Email" type="email" {...form.register('email')} />
            </FormControl>
            <FormDescription>
              This is the email address that we will use to contact you.
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Language</FormLabel>
            <Select
              onValueChange={(value) => {
                form.setValue('language', value, { shouldValidate: true });
              }}
              defaultValue={form.getValues('language') || 'en'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              This is the language that will be used throughout the app.
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Currency</FormLabel>
            <Select
              onValueChange={handleCurrencyChange}
              defaultValue={form.getValues('currency') || 'USD'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              This is the currency that will be used throughout the app.
            </FormDescription>
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
