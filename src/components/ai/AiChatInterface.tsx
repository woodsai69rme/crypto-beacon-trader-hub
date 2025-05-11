
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { fetchAvailableModels, OpenRouterModel, sendChatCompletion, ChatMessage, setOpenRouterApiKey, getOpenRouterApiKey } from '@/services/openRouterService';
import { toast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Bot, Send, AlertCircle, Loader2 } from "lucide-react";
import ModelSelector from './ModelSelector';

interface ChatMessageDisplay extends ChatMessage {
  id: string;
}

const AiChatInterface: React.FC = () => {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(getOpenRouterApiKey());
  const [messages, setMessages] = useState<ChatMessageDisplay[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiKey) {
      loadModels();
    }
  }, [apiKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadModels = async () => {
    setLoading(true);
    try {
      const fetchedModels = await fetchAvailableModels();
      setModels(fetchedModels);
      // Select first free model or first model if no free ones available
      const freeModel = fetchedModels.find(m => m.isFree);
      if (freeModel) {
        setSelectedModel(freeModel.id);
      } else if (fetchedModels.length > 0) {
        setSelectedModel(fetchedModels[0].id);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      setOpenRouterApiKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your OpenRouter API key has been saved",
      });
      loadModels();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedModel) return;
    
    const userMessage: ChatMessageDisplay = {
      role: 'user',
      content: input.trim(),
      id: Date.now().toString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const formattedMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful assistant with expertise in cryptocurrency trading and market analysis. Provide concise, accurate information.'
        },
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: userMessage.role, content: userMessage.content }
      ];
      
      const response = await sendChatCompletion({
        model: selectedModel,
        messages: formattedMessages,
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        id: Date.now().toString(),
      }]);
    } catch (error) {
      toast({
        title: "Failed to get response",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Trading Assistant
        </CardTitle>
        <CardDescription>
          Get trading insights and market analysis from various AI models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!apiKey ? (
          <div className="space-y-4">
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">API Key Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  You need an OpenRouter API key to access AI models. Get one at{' '}
                  <a 
                    href="https://openrouter.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    openrouter.ai
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenRouter API key"
                className="flex-grow"
              />
              <Button onClick={saveApiKey}>Save Key</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      No messages yet. Ask a question about crypto trading, market analysis, or portfolio strategies.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="pt-4">
              <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
                isLoading={loading}
              />
            </div>

            <div className="flex items-start gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about market trends, trading strategies, or specific coins..."
                className="flex-grow resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={loading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim() || !selectedModel}
                className="mt-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AiChatInterface;
