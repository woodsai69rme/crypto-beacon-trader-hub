
import { toast } from '@/components/ui/use-toast';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to get the API key from localStorage
export const getOpenRouterApiKey = (): string | null => {
  return localStorage.getItem('openrouter_api_key');
};

// Function to save the API key to localStorage
export const saveOpenRouterApiKey = (apiKey: string): void => {
  localStorage.setItem('openrouter_api_key', apiKey);
};

// Function to remove the API key from localStorage
export const removeOpenRouterApiKey = (): void => {
  localStorage.removeItem('openrouter_api_key');
};

// Types for OpenRouter requests
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

// Available models
export const OPENROUTER_MODELS = [
  { 
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Latest and most powerful model from OpenAI',
    contextLength: 128000,
    costPer1kTokens: 0.005
  },
  { 
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Latest Claude model with strong reasoning capabilities',
    contextLength: 200000,
    costPer1kTokens: 0.003
  },
  { 
    id: 'meta-llama-3-70b-instruct',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open-source model with strong performance',
    contextLength: 8000,
    costPer1kTokens: 0.0009
  },
  { 
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Google\'s most capable multimodal model',
    contextLength: 1000000,
    costPer1kTokens: 0.0025
  }
];

// The main function to make requests to OpenRouter
export const sendOpenRouterRequest = async (
  request: OpenRouterRequest
): Promise<OpenRouterResponse> => {
  const apiKey = getOpenRouterApiKey();
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not found');
  }
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('OpenRouter API error:', error);
    toast({
      title: 'API Error',
      description: error instanceof Error ? error.message : 'Unknown error occurred',
      variant: 'destructive',
    });
    throw error;
  }
};

// Specialized function for generating trading analysis
export const generateTradingAnalysis = async (
  coinId: string,
  timeframe: string,
  modelId: string = 'gpt-4o',
  priceData?: any
): Promise<{
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  targets?: { entry?: number; stop?: number; target?: number };
}> => {
  const systemPrompt = 
    `You are an expert cryptocurrency trading AI assistant. Analyze market conditions and provide trading advice. 
    Respond with a JSON object containing:
    - recommendation: either "buy", "sell", or "hold"
    - confidence: a number between 0 and 1 representing your confidence
    - reasoning: short explanation for your recommendation
    - targets: optional object with entry, stop, and target prices (if applicable)`;
  
  const userPrompt = 
    `Analyze the market conditions for ${coinId.toUpperCase()} on the ${timeframe} timeframe.` +
    (priceData ? ` Here is the recent price data: ${JSON.stringify(priceData)}` : '') +
    ` Provide a specific trade recommendation with confidence level and reasoning.`;
  
  try {
    const response = await sendOpenRouterRequest({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    });
    
    // Try to parse the response as JSON
    try {
      const content = response.choices[0].message.content;
      // Extract JSON if wrapped in code blocks
      const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                         content.match(/{[\s\S]*?}/);
                         
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Validate the response has the expected format
        if (!parsed.recommendation || !['buy', 'sell', 'hold'].includes(parsed.recommendation)) {
          throw new Error('Invalid recommendation in response');
        }
        
        if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
          parsed.confidence = 0.7; // Default confidence if invalid
        }
        
        if (!parsed.reasoning) {
          parsed.reasoning = 'Analysis complete.'; // Default reasoning if missing
        }
        
        return parsed;
      } else {
        throw new Error('Could not find JSON in response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Provide fallback response
      return {
        recommendation: 'hold',
        confidence: 0.5,
        reasoning: 'Unable to generate clear trading signal at this time. Consider gathering more market data.'
      };
    }
  } catch (error) {
    console.error('Trading analysis error:', error);
    toast({
      title: 'Analysis Error',
      description: 'Failed to generate trading analysis. Please try again.',
      variant: 'destructive',
    });
    
    // Return default response in case of error
    return {
      recommendation: 'hold',
      confidence: 0.5,
      reasoning: 'Error generating analysis. Please check API connection and try again.'
    };
  }
};

// Function to generate trading strategies
export const generateTradingStrategy = async (
  coinId: string,
  riskLevel: string,
  timeframe: string,
  modelId: string = 'gpt-4o'
): Promise<{
  name: string;
  description: string;
  indicators: string[];
  rulesBuy: string[];
  rulesSell: string[];
  riskManagement: string[];
  targetReturn: number;
}> => {
  const systemPrompt = 
    `You are an expert cryptocurrency trading strategy developer. Create detailed, practical trading strategies based on technical analysis.
    Respond with a JSON object containing:
    - name: a catchy name for the strategy
    - description: 1-2 sentences describing the core strategy
    - indicators: array of technical indicators used
    - rulesBuy: array of specific rules for entry signals
    - rulesSell: array of specific rules for exit signals
    - riskManagement: array of risk management rules
    - targetReturn: expected monthly return percentage (realistic)`;
  
  const userPrompt = 
    `Create a ${riskLevel} risk trading strategy for ${coinId.toUpperCase()} on the ${timeframe} timeframe.
    Focus on specific technical indicators with precise entry/exit rules and risk management guidelines.
    Keep the strategy practical and implementable with clear conditions.`;
  
  try {
    const response = await sendOpenRouterRequest({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 1000
    });
    
    try {
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                         content.match(/{[\s\S]*?}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Add defaults for any missing fields
        return {
          name: parsed.name || `${coinId.toUpperCase()} ${timeframe} ${riskLevel} Strategy`,
          description: parsed.description || 'A custom trading strategy based on technical analysis.',
          indicators: parsed.indicators || ['RSI', 'Moving Averages', 'Volume'],
          rulesBuy: parsed.rulesBuy || ['Buy when price shows upward momentum'],
          rulesSell: parsed.rulesSell || ['Sell when price shows downward momentum'],
          riskManagement: parsed.riskManagement || ['Use stop losses', 'Limit position size'],
          targetReturn: parsed.targetReturn || (riskLevel === 'high' ? 15 : riskLevel === 'medium' ? 8 : 4)
        };
      } else {
        throw new Error('Could not find JSON in response');
      }
    } catch (parseError) {
      console.error('Error parsing strategy response:', parseError);
      // Provide fallback strategy
      return {
        name: `${coinId.toUpperCase()} Basic Strategy`,
        description: 'A simple trend-following strategy based on moving averages.',
        indicators: ['Moving Average (50)', 'Moving Average (200)', 'RSI', 'Volume'],
        rulesBuy: ['Buy when 50MA crosses above 200MA', 'Confirm with RSI above 50', 'Require above-average volume'],
        rulesSell: ['Sell when 50MA crosses below 200MA', 'Sell when RSI crosses below 70 from above', 'Use trailing stop loss'],
        riskManagement: ['Set stop loss at 5% below entry', 'Position size limited to 5% of portfolio', 'Take partial profits at 10% gain'],
        targetReturn: riskLevel === 'high' ? 15 : riskLevel === 'medium' ? 8 : 4
      };
    }
  } catch (error) {
    console.error('Strategy generation error:', error);
    toast({
      title: 'Strategy Error',
      description: 'Failed to generate trading strategy. Please try again.',
      variant: 'destructive',
    });
    
    return {
      name: `${coinId.toUpperCase()} Fallback Strategy`,
      description: 'A defensive trading approach using basic technical indicators.',
      indicators: ['RSI', '50-day Moving Average', 'Volume'],
      rulesBuy: ['Buy when price is above 50-day MA', 'RSI should be above 40 but below 70', 'Confirm with increasing volume'],
      rulesSell: ['Sell when price drops below 50-day MA', 'Sell when RSI crosses above 70', 'Use trailing stop loss'],
      riskManagement: ['Maximum 3% risk per trade', 'Always use stop losses', 'Take partial profits at predetermined levels'],
      targetReturn: 5
    };
  }
};

export default {
  getOpenRouterApiKey,
  saveOpenRouterApiKey,
  removeOpenRouterApiKey,
  OPENROUTER_MODELS,
  sendOpenRouterRequest,
  generateTradingAnalysis,
  generateTradingStrategy
};
