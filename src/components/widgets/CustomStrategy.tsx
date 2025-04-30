
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAiTrading } from "@/contexts/AiTradingContext";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const CustomStrategy: React.FC = () => {
  const { addStrategy, isLoading } = useAiTrading();
  
  const [name, setName] = useState('');
  const [strategy, setStrategy] = useState<string>('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !strategy || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (addStrategy) {
        await addStrategy(strategy as any, name, description);
        setName('');
        setStrategy('');
        setDescription('');
      } else {
        toast({
          title: "Function Not Available",
          description: "The addStrategy function is not available",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating strategy:", error);
      toast({
        title: "Error",
        description: "Failed to create custom strategy",
        variant: "destructive"
      });
    }
  };
  
  const strategyTypes = [
    { value: 'traditional', label: 'Traditional Technical Analysis' },
    { value: 'ai-predictive', label: 'AI Predictive Analytics' },
    { value: 'hybrid', label: 'Hybrid (AI + Technical)' },
    { value: 'trend-following', label: 'Trend Following' },
    { value: 'mean-reversion', label: 'Mean Reversion' },
    { value: 'breakout', label: 'Breakout Trading' },
    { value: 'sentiment', label: 'Sentiment Analysis' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'multi-timeframe', label: 'Multi-Timeframe Analysis' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Strategy</CardTitle>
        <CardDescription>
          Define your own AI-powered trading strategy
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Strategy Name</label>
            <Input
              placeholder="My Custom Strategy"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Strategy Type</label>
            <Select value={strategy} onValueChange={setStrategy} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy type" />
              </SelectTrigger>
              <SelectContent>
                {strategyTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              placeholder="Describe your strategy's objectives and approach..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Strategy"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomStrategy;
