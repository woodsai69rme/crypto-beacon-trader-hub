import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Languages } from '@/constants/languages';
import { UseFormReturn } from 'react-hook-form';
import { SettingsFormValues } from '@/types/trading';
import { Globe2, User, Mail } from "lucide-react";
import { SupportedCurrency } from '@/types/trading';

interface GeneralSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ form }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<{ code: string; label: string } | null>(null);

  useEffect(() => {
    // Initialize selected currency from form values
    const defaultCurrency = form.getValues('currency')?.defaultCurrency;
    if (defaultCurrency) {
      const initialCurrency = {
        code: defaultCurrency,
        label: defaultCurrency,
      };
      setSelectedCurrency(initialCurrency);
    }
  }, [form]);

  const handleCurrencyChange = (currencyCode: string) => {
    const newCurrency = {
      code: currencyCode,
      label: currencyCode,
    };
    setSelectedCurrency(newCurrency);

    const updatedOptions = {
      defaultCurrency: newCurrency.code,
      showConversion: true,
      showPriceInBTC: false
    };

    form.setValue('currency', updatedOptions, { shouldValidate: true });
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
              <Input placeholder="Your Contact Email" type="email" {...form.register('contactEmail')} />
            </FormControl>
            <FormDescription>
              This is the email address that we will use to contact you.
            </FormDescription>
          </FormItem>
          
          <FormItem>
            <FormLabel>Language</FormLabel>
            <Select
              onValueChange={(value) => {
                form.setValue('userLanguage', value, { shouldValidate: true });
              }}
              defaultValue={form.getValues('userLanguage') || 'en'}
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
              defaultValue={form.getValues('currency')?.defaultCurrency || 'USD'}
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
