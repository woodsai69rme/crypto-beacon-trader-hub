
/**
 * OpenRouter Service
 * Provides access to AI models via OpenRouter API.
 */

import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = 'openrouter_api_key';
const API_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'openai/gpt-4';

/**
 * Available model options
 */
export const openRouterModels = [
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
  { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', provider: 'Meta' },
  { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B', provider: 'Meta' },
];

/**
 * Model usage - for cost estimation and tracking
 */
export const modelUsage = {
  'openai/gpt-4-turbo': { inputCost: 0.01, outputCost: 0.03 },
  'openai/gpt-4o': { inputCost: 0.01, outputCost: 0.03 },
  'openai/gpt-3.5-turbo': { inputCost: 0.001, outputCost: 0.002 },
  'anthropic/claude-3-opus': { inputCost: 0.015, outputCost: 0.075 },
  'anthropic/claude-3-sonnet': { inputCost: 0.003, outputCost: 0.015 },
  'anthropic/claude-3-haiku': { inputCost: 0.00025, outputCost: 0.00125 },
  'google/gemini-pro': { inputCost: 0.0005, outputCost: 0.0015 },
  'meta-llama/llama-3-70b-instruct': { inputCost: 0.0009, outputCost: 0.0009 },
  'meta-llama/llama-3-8b-instruct': { inputCost: 0.0002, outputCost: 0.0002 },
};

/**
 * Check if an API key exists
 */
export const hasApiKey = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

/**
 * Set the API key
 */
export const setApiKey = (key: string): void => {
  localStorage.setItem(STORAGE_KEY, key);
};

/**
 * Get the API key
 */
export const getApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

/**
 * Clear the API key
 */
export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Generate a trading strategy using OpenRouter AI
 */
export const generateTradingStrategy = async (
  params: {
    asset: string;
    timeframe: string;
    riskLevel: string;
    additionalContext?: string;
  }
): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    toast({
      title: "API Key Missing",
      description: "Please set your OpenRouter API key in the settings",
      variant: "destructive",
    });
    throw new Error("OpenRouter API key not configured");
  }

  try {
    const prompt = `Generate a detailed cryptocurrency trading strategy for ${params.asset} with the following parameters:
- Timeframe: ${params.timeframe}
- Risk level: ${params.riskLevel}
${params.additionalContext ? `- Additional context: ${params.additionalContext}` : ''}

Please structure your response as follows:
1. Strategy name
2. Strategy description
3. Key indicators to use
4. Entry signals
5. Exit signals
6. Risk management rules
7. Expected performance metrics
`;

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Crypto Trading Platform'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: 'You are an expert cryptocurrency trading strategist. Provide detailed, actionable trading strategies based on technical and fundamental analysis.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Error generating trading strategy:", error);
    toast({
      title: "Strategy Generation Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Generate market analysis using OpenRouter AI
 */
export const generateMarketAnalysis = async (
  params: {
    assets: string[];
    timeframe: string;
    focusAreas?: string[];
  }
): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    toast({
      title: "API Key Missing",
      description: "Please set your OpenRouter API key in the settings",
      variant: "destructive",
    });
    throw new Error("OpenRouter API key not configured");
  }

  try {
    const assetList = params.assets.join(', ');
    const focusAreas = params.focusAreas?.join(', ') || 'technical analysis, market sentiment';
    
    const prompt = `Provide a comprehensive market analysis for the following cryptocurrencies: ${assetList}
- Timeframe: ${params.timeframe}
- Focus areas: ${focusAreas}

Structure your analysis with:
1. Overall market sentiment
2. Individual asset analysis
3. Key support and resistance levels
4. Potential catalysts
5. Risk assessment
`;

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Crypto Trading Platform'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: 'You are an expert cryptocurrency market analyst. Provide detailed, accurate market analysis based on the latest trends and data.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Error generating market analysis:", error);
    toast({
      title: "Analysis Generation Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Get available models from OpenRouter
 */
export const getModels = async (): Promise<any[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    toast({
      title: "API Key Missing",
      description: "Please set your OpenRouter API key in the settings",
      variant: "destructive",
    });
    throw new Error("OpenRouter API key not configured");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Crypto Trading Platform'
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    toast({
      title: "Failed to Fetch Models",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Analyze portfolio using OpenRouter AI
 */
export const analyzePortfolioWithAI = async (
  portfolio: {
    assets: Array<{ name: string; symbol: string; allocation: number; performance: number }>;
    totalValue: number;
    timeframe: string;
  }
): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    toast({
      title: "API Key Missing",
      description: "Please set your OpenRouter API key in the settings",
      variant: "destructive",
    });
    throw new Error("OpenRouter API key not configured");
  }

  try {
    const assetDetails = portfolio.assets
      .map(a => `- ${a.name} (${a.symbol}): ${a.allocation.toFixed(2)}% allocation, ${a.performance >= 0 ? '+' : ''}${a.performance.toFixed(2)}% performance`)
      .join('\n');
    
    const prompt = `Analyze the following cryptocurrency portfolio:

Portfolio Value: $${portfolio.totalValue.toLocaleString()}
Timeframe: ${portfolio.timeframe}

Assets:
${assetDetails}

Please provide:
1. Overall portfolio assessment
2. Risk analysis
3. Diversification recommendations
4. Rebalancing suggestions
5. Potential opportunities and concerns
`;

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Crypto Trading Platform'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: 'You are an expert cryptocurrency portfolio manager. Provide detailed, actionable portfolio analysis and recommendations.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Error analyzing portfolio:", error);
    toast({
      title: "Portfolio Analysis Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

export default {
  hasApiKey,
  setApiKey,
  getApiKey,
  clearApiKey,
  generateTradingStrategy,
  generateMarketAnalysis,
  getModels,
  analyzePortfolioWithAI,
  openRouterModels,
  modelUsage
};
