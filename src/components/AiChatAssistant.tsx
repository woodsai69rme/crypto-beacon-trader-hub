
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Bot, Send, X, Minimize, Maximize } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ChatMessage {
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    content: "👋 Hi there! I'm your crypto dashboard assistant. I can help you navigate the dashboard, set up your portfolio, understand market data, or answer questions about cryptocurrencies. What can I help you with today?",
    sender: 'assistant',
    timestamp: new Date(),
  }
];

const AiChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { theme, colorScheme } = useTheme();

  // Predefined responses for demo purposes
  const predefinedResponses = {
    'default': "I'm not sure about that. Let me help you with something else. You can ask about portfolio setup, dashboard features, or crypto market basics.",
    'hello': "Hello! I'm your crypto dashboard assistant. How can I help you today?",
    'help': "Here are some things I can help you with:\n- Setting up your portfolio\n- Understanding dashboard features\n- Explaining market indicators\n- Creating price alerts\n- Basic crypto knowledge\n- Changing themes and currencies",
    'portfolio': "To set up your portfolio, go to the Portfolio tab and click 'Add Asset'. You can manually enter your holdings or connect to exchanges via API keys in the Settings section.",
    'alerts': "You can set price alerts by going to the Alerts section, selecting a cryptocurrency, and defining your price threshold. You'll receive notifications when your conditions are met.",
    'theme': "You can change the theme by clicking the theme toggle button in the top right corner of the dashboard. We offer light mode, dark mode, and several color schemes like Blue, Purple, Green, and Amber.",
    'trading': "The trading features are simulated for educational purposes. To start, go to the Trading tab and explore the interface. You can practice trading strategies without risking real money.",
    'indicators': "Technical indicators help analyze price charts. Common ones include Moving Averages, RSI, MACD, and Bollinger Bands. Each provides different insights about market trends and momentum.",
    'currency': "You can change your preferred currency between USD and AUD in the settings. The system will automatically convert all values to your preferred currency across the dashboard.",
  };

  const matchResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) return predefinedResponses.hello;
    if (lowerInput.includes('help')) return predefinedResponses.help;
    if (lowerInput.includes('portfolio')) return predefinedResponses.portfolio;
    if (lowerInput.includes('alert')) return predefinedResponses.alerts;
    if (lowerInput.includes('theme') || lowerInput.includes('color')) return predefinedResponses.theme;
    if (lowerInput.includes('trade') || lowerInput.includes('trading')) return predefinedResponses.trading;
    if (lowerInput.includes('indicator') || lowerInput.includes('chart')) return predefinedResponses.indicators;
    if (lowerInput.includes('currency') || lowerInput.includes('dollar') || lowerInput.includes('aud') || lowerInput.includes('usd')) return predefinedResponses.currency;
    
    return predefinedResponses.default;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: ChatMessage = {
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        content: matchResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg z-50"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-80 sm:w-96 shadow-lg z-50 border border-border themed-card ${isMinimized ? 'h-12' : 'h-96'}`}>
      <div 
        className="bg-primary text-primary-foreground px-4 py-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">Crypto Assistant</span>
        </div>
        <div className="flex space-x-1">
          {isMinimized ? (
            <Maximize className="h-4 w-4" />
          ) : (
            <Minimize className="h-4 w-4" />
          )}
          <X className="h-4 w-4 cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }} />
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <ScrollArea className="h-[calc(384px-88px)] p-4 themed-text" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap themed-text">{msg.content}</p>
                    <p className="text-xs opacity-70 text-right mt-1 themed-text-secondary">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-2 rounded-lg bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <CardFooter className="p-2 border-t">
            <div className="flex w-full space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 themed-text"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={inputValue.trim() === ''}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default AiChatAssistant;
