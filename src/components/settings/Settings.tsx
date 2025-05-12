
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Paintbrush,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { SettingsFormValues } from '@/types/trading';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import AppearanceSettings from './AppearanceSettings';
import ApiKeyManagement from './ApiKeyManagement';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      username: "trader123",
      displayName: "Crypto Trader",
      email: "trader@example.com",
      bio: "Just a crypto enthusiast exploring the market",
      theme: "dark",
      language: "en",
      notifications: {
        email: true,
        push: true,
        trades: true,
        pricing: true,
        news: false
      },
      tradingPreferences: {
        autoConfirm: false,
        showAdvanced: true,
        defaultAsset: "bitcoin"
      },
      privacy: {
        showOnlineStatus: true,
        sharePortfolio: false,
        shareTrades: false,
        dataCollection: true,
        marketingConsent: false,
        thirdPartySharing: false
      },
      appearance: {
        colorScheme: "dark",
        compactMode: false,
        animationsEnabled: true,
        highContrastMode: false
      }
    }
  });
  
  const { register, handleSubmit, formState } = form;
  
  const onSubmit = (data: SettingsFormValues) => {
    console.log("Settings saved:", data);
    toast({
      title: "Settings Updated",
      description: "Your settings have been saved successfully"
    });
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...register('username')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      {...register('displayName')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...register('bio')}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      onValueChange={(value) => form.setValue('language', value)}
                      defaultValue={form.getValues('language')}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultAsset">Default Asset</Label>
                    <Select
                      onValueChange={(value) => form.setValue('tradingPreferences.defaultAsset', value)}
                      defaultValue={form.getValues('tradingPreferences.defaultAsset')}
                    >
                      <SelectTrigger id="defaultAsset">
                        <SelectValue placeholder="Select default asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                        <SelectItem value="solana">Solana (SOL)</SelectItem>
                        <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings form={form} />
          </TabsContent>
          
          <TabsContent value="privacy">
            <PrivacySettings form={form} />
          </TabsContent>
          
          <TabsContent value="api-keys">
            <ApiKeyManagement />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings form={form} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
