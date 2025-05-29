import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Key, Zap } from 'lucide-react';
import { openRouterService } from '@/services/openRouterService';
import { SettingsComponentProps } from './types';
import { useToast } from '@/hooks/use-toast';

const OpenRouterSettings: React.FC<SettingsComponentProps> = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already set
    const hasKey = openRouterService.hasApiKey();
    setIsConfigured(hasKey);
    
    // If key exists, mask it
    if (hasKey) {
      setApiKey('••••••••••••••••••••••••••');
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey === '••••••••••••••••••••••••••') {
      return;
    }

    setIsLoading(true);
    try {
      // Test the API key by fetching models
      openRouterService.setApiKey(apiKey);
      const models = await openRouterService.getModels();
      
      if (models) {
        toast({
          title: "API Key Successfully Configured",
          description: "Your OpenRouter API key has been saved.",
          duration: 3000
        });
        
        setIsConfigured(true);
        setShowApiKey(false);
        setApiKey('••••••••••••••••••••••••••');
      }
    } catch (error) {
      console.error("Failed to validate OpenRouter API key:", error);
      toast({
        title: "Invalid API Key",
        description: "Could not validate the OpenRouter API key. Please check and try again.",
        variant: "destructive",
        duration: 5000
      });
      openRouterService.clearApiKey();
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveApiKey = () => {
    openRouterService.clearApiKey();
    setApiKey('');
    setIsConfigured(false);
    toast({
      title: "API Key Removed",
      description: "Your OpenRouter API key has been removed.",
      duration: 3000
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    
    // If user is typing, show the key
    if (value !== '••••••••••••••••••••••••••') {
      setShowApiKey(true);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyIcon className="h-5 w-5" />
          OpenRouter Integration
        </CardTitle>
        <CardDescription>
          Configure your OpenRouter API key to use AI model providers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>What is OpenRouter?</AlertTitle>
          <AlertDescription>
            OpenRouter provides unified access to various AI models from different providers (OpenAI, Anthropic, Google, etc.)
            through a single API. <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline text-primary">Get an API key here</a>.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div>
            <FormItem className="mb-4">
              <FormLabel>API Key</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={handleInputChange}
                    placeholder="Enter your OpenRouter API key"
                    className="flex-grow"
                  />
                </FormControl>
                <Button 
                  variant="outline"
                  onClick={() => setShowApiKey(!showApiKey)}
                  type="button"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </Button>
              </div>
              <FormDescription className="mt-1 text-xs">
                Your API key is stored locally and never sent to our servers.
              </FormDescription>
            </FormItem>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey || apiKey === '••••••••••••••••••••••••••' || isLoading}
            >
              {isLoading ? 'Validating...' : isConfigured ? 'Update API Key' : 'Save API Key'}
            </Button>
            
            {isConfigured && (
              <Button variant="destructive" onClick={handleRemoveApiKey}>
                Remove API Key
              </Button>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <ShieldIcon className="h-4 w-4" />
                <FormLabel className="text-base">Enhanced Security</FormLabel>
              </div>
              <FormDescription>
                Clear API key from memory when closing the application
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={true}
                disabled
              />
            </FormControl>
          </FormItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenRouterSettings;
