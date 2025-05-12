
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOpenRouterApiKey } from '@/services/openRouterService';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, Key, ExternalLink } from 'lucide-react';

const OpenRouterApiKeyForm: React.FC = () => {
  const [inputApiKey, setInputApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { apiKey, isConfigured, saveApiKey, removeApiKey } = useOpenRouterApiKey();
  
  const handleSave = async () => {
    if (!inputApiKey) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real application, we would validate the API key by making a test request
      saveApiKey(inputApiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your OpenRouter API key has been saved successfully.",
        variant: "default",
      });
      
      setInputApiKey('');
    } catch (error) {
      toast({
        title: "Error Saving API Key",
        description: "There was a problem saving your API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemove = () => {
    removeApiKey();
    
    toast({
      title: "API Key Removed",
      description: "Your OpenRouter API key has been removed.",
      variant: "default",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenRouter API Integration
        </CardTitle>
        <CardDescription>
          Configure your OpenRouter API key to access advanced AI models
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert variant="info" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="text-sm">
              OpenRouter provides unified access to AI models from various providers including OpenAI, Anthropic, Google, and more.
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center ml-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Get your API key here <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
            </p>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex space-x-2">
            <Input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="Enter your OpenRouter API key"
              disabled={isSubmitting}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
        
        {isConfigured && (
          <Alert variant="success" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              API key is configured and ready to use.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          disabled={!inputApiKey || isSubmitting}
          onClick={handleSave}
        >
          {isSubmitting ? "Saving..." : isConfigured ? "Update API Key" : "Save API Key"}
        </Button>
        
        {isConfigured && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            disabled={isSubmitting}
          >
            Remove API Key
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OpenRouterApiKeyForm;
