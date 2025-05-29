import { openRouterService } from '@/services/openRouterService';
import { TradingSignal } from '@/services/openRouterService';
import { n8nAutomationService } from '@/services/automation/n8nAutomationService';

export interface AdvancedAITradingBotConfig {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  model: string;
  strategy: string;
  isActive: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  entryThreshold: number;
  exitThreshold: number;
  maxTradesPerDay: number;
  allocatedCapital: number;
  symbol: string;
}

export class AdvancedAITradingBot {
  public id: string;
  public name: string;
  public description: string;
  public apiKey: string;
  public model: string;
  public strategy: string;
  public isActive: boolean;
  public riskLevel: 'low' | 'medium' | 'high';
  public entryThreshold: number;
  public exitThreshold: number;
  public maxTradesPerDay: number;
  public allocatedCapital: number;
  public symbol: string;
  private tradesExecutedToday: number = 0;

  constructor(config: AdvancedAITradingBotConfig) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.strategy = config.strategy;
    this.isActive = config.isActive;
    this.riskLevel = config.riskLevel;
    this.entryThreshold = config.entryThreshold;
    this.exitThreshold = config.exitThreshold;
    this.maxTradesPerDay = config.maxTradesPerDay;
    this.allocatedCapital = config.allocatedCapital;
    this.symbol = config.symbol;

    openRouterService.setApiKey(this.apiKey);
  }

  public async analyzeMarketData(marketData: any): Promise<TradingSignal> {
    try {
      openRouterService.setApiKey(this.apiKey);
      const tradingSignal = await openRouterService.generateTradingSignal(marketData, this.strategy, this.model);
      return tradingSignal;
    } catch (error) {
      console.error('Error analyzing market data:', error);
      return {
        signal: 'HOLD',
        confidence: 0.5,
        reasoning: 'Failed to analyze market data.',
        entryPrice: marketData.price,
        targetPrice: marketData.price,
        stopLoss: marketData.price
      };
    }
  }

  public async executeTrade(signal: TradingSignal, currentPrice: number): Promise<boolean> {
    if (!this.isActive) {
      console.log(`Bot ${this.name} is not active, skipping trade execution.`);
      return false;
    }

    if (this.tradesExecutedToday >= this.maxTradesPerDay) {
      console.log(`Bot ${this.name} has reached the maximum trades for today.`);
      return false;
    }

    if (signal.signal === 'BUY' && currentPrice < this.entryThreshold) {
      console.log(`Executing BUY trade for ${this.symbol} at ${currentPrice}`);
      this.tradesExecutedToday++;
      await n8nAutomationService.sendTradingSignal({
        symbol: this.symbol,
        signal: 'BUY',
        confidence: signal.confidence,
        price: currentPrice,
        timestamp: new Date().toISOString(),
        strategy: this.strategy,
        reasoning: signal.reasoning
      });
      return true;
    } else if (signal.signal === 'SELL' && currentPrice > this.exitThreshold) {
      console.log(`Executing SELL trade for ${this.symbol} at ${currentPrice}`);
      this.tradesExecutedToday++;
      await n8nAutomationService.sendTradingSignal({
        symbol: this.symbol,
        signal: 'SELL',
        confidence: signal.confidence,
        price: currentPrice,
        timestamp: new Date().toISOString(),
        strategy: this.strategy,
        reasoning: signal.reasoning
      });
      return true;
    } else {
      console.log(`No trade executed for ${this.symbol}. Signal: ${signal.signal}, Current Price: ${currentPrice}`);
      return false;
    }
  }

  public resetDailyTradeCount(): void {
    this.tradesExecutedToday = 0;
  }

  public updateConfig(config: Partial<AdvancedAITradingBotConfig>): void {
    Object.assign(this, config);
  }
}
