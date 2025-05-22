
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsFormValues } from "@/components/settings/types";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  theme: z.enum(["light", "dark", "system"]),
  notifications: z.object({
    email: z.boolean().default(false),
    push: z.boolean().default(false),
    trades: z.boolean().default(false),
    // Remove pricing and news fields
  }),
  tradingPreferences: z.object({
    autoConfirm: z.boolean().default(false),
    showAdvanced: z.boolean().default(false),
    defaultAsset: z.string(),
  }),
});

const UserSettings: React.FC = () => {
  const { toast } = useToast();
  
  // Default form values
  const defaultValues = {
    displayName: "John Doe",
    email: "john.doe@example.com",
    theme: "light",
    notifications: {
      email: true,
      push: false,
      trades: true,
    },
    tradingPreferences: {
      autoConfirm: false,
      showAdvanced: true,
      defaultAsset: "bitcoin",
    },
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: any) {
    toast({
      title: "Settings updated",
      description: "Your settings have been updated successfully.",
    });
    console.log(values);
  }

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
            </TabsList>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="profile" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Display Name</FormLabel>
                    <Input 
                      {...form.register("displayName")}
                      placeholder="John Doe" 
                    />
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <Input 
                      {...form.register("email")}
                      placeholder="john.doe@example.com"
                    />
                    <FormDescription>
                      Your email address.
                    </FormDescription>
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>Theme</FormLabel>
                    <Select 
                      onValueChange={(value) => form.setValue("theme", value)}
                      defaultValue={form.getValues("theme")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select your preferred theme.
                    </FormDescription>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>
                        Receive notifications via email.
                      </FormDescription>
                    </div>
                    <Switch
                      checked={form.watch("notifications.email")}
                      onCheckedChange={(checked) => form.setValue("notifications.email", checked)}
                    />
                  </div>
                  
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Push Notifications</FormLabel>
                      <FormDescription>
                        Receive push notifications on your devices.
                      </FormDescription>
                    </div>
                    <Switch
                      checked={form.watch("notifications.push")}
                      onCheckedChange={(checked) => form.setValue("notifications.push", checked)}
                    />
                  </div>
                  
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Trading Notifications</FormLabel>
                      <FormDescription>
                        Get notified about your trades.
                      </FormDescription>
                    </div>
                    <Switch
                      checked={form.watch("notifications.trades")}
                      onCheckedChange={(checked) => form.setValue("notifications.trades", checked)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trading" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto-Confirm Orders</FormLabel>
                      <FormDescription>
                        Skip confirmation dialog for orders.
                      </FormDescription>
                    </div>
                    <Switch
                      checked={form.watch("tradingPreferences.autoConfirm")}
                      onCheckedChange={(checked) => form.setValue("tradingPreferences.autoConfirm", checked)}
                    />
                  </div>
                  
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Advanced Features</FormLabel>
                      <FormDescription>
                        Display advanced trading features.
                      </FormDescription>
                    </div>
                    <Switch
                      checked={form.watch("tradingPreferences.showAdvanced")}
                      onCheckedChange={(checked) => form.setValue("tradingPreferences.showAdvanced", checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>Default Asset</FormLabel>
                    <Select 
                      onValueChange={(value) => form.setValue("tradingPreferences.defaultAsset", value)}
                      defaultValue={form.getValues("tradingPreferences.defaultAsset")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a default asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                        <SelectItem value="solana">Solana (SOL)</SelectItem>
                        <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Asset to show by default in trading interfaces.
                    </FormDescription>
                  </div>
                </div>
              </TabsContent>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
