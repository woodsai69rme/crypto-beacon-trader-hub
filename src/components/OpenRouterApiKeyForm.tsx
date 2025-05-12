
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getOpenRouterApiKey, saveOpenRouterApiKey, removeOpenRouterApiKey, OPENROUTER_MODELS } from '@/services/openRouterService';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, Key, ExternalLink } from 'lucide-react';

const OpenRouterApiKeyForm: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  useEffect(() => {
    const storedKey = getOpenRouterApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setHasKey(true);
    }
  }, []);
  
  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Save the API key
    try {
      saveOpenRouterApiKey(apiKey);
      setHasKey(true);
      toast({
        title: 'Success',
        description: 'API key saved successfully',
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API key',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveKey = () => {
    removeOpenRouterApiKey();
    setApiKey('');
    setHasKey(false);
    setShowKey(false);
    toast({
      title: 'API Key Removed',
      description: 'Your OpenRouter API key has been removed',
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
          Connect to OpenRouter to use leading AI models for trading analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasKey ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                OpenRouter API key is configured and ready to use.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="api-key">API Key</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowKey(!showKey)}
                  className="text-xs"
                >
                  {showKey ? 'Hide' : 'Show'}
                </Button>
              </div>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type={showKey ? 'text' : 'password'}
                className="font-mono"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="default"
                onClick={handleSaveKey}
                disabled={isSubmitting}
              >
                Update Key
              </Button>
              <Button 
                variant="outline"
                onClick={handleRemoveKey}
                disabled={isSubmitting}
              >
                Remove Key
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                OpenRouter API key is required to use AI trading features.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter your OpenRouter API key"
                className="font-mono"
              />
            </div>
            
            <Button 
              variant="default"
              onClick={handleSaveKey}
              disabled={isSubmitting || !apiKey}
              className="w-full"
            >
              {isSubmitting ? 'Saving...' : 'Save API Key'}
            </Button>
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium">Available Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {OPENROUTER_MODELS.map((model) => (
              <div 
                key={model.id} 
                className="border rounded-md p-2 text-sm"
              >
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-muted-foreground">Provider: {model.provider}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 text-sm text-muted-foreground">
        <a 
          href="https://openrouter.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:underline"
        >
          Visit OpenRouter <ExternalLink className="ml-1 h-3 w-3" />
        </a>
        <span>Token cost varies by model</span>
      </CardFooter>
    </Card>
  );
};

export default OpenRouterApiKeyForm;
