import { Trade, CoinOption, AIBot, TradingSignal } from '@/types/trading';
import { algorandService } from '../algorand/algorandService';
import { n8nAutomationService } from '../automation/n8nAutomationService';

interface RealTimePrice {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  timestamp: number;
}

interface BotExecution {
  botId: string;
  trade: Trade;
  signal: TradingSignal;
  timestamp: string;
}

class RealTimeTradingService {
  private priceCache = new Map<string, RealTimePrice>();
  private subscribers = new Set<(data: any) => void>();
  private botExecutions: BotExecution[] = [];
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;

  // Available cryptocurrencies with real market data
  private readonly supportedCoins: CoinOption[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 0,
      value: 'bitcoin',
      label: 'Bitcoin (BTC)',
      image: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 0,
      value: 'ethereum',
      label: 'Ethereum (ETH)',
      image: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png'
    },
    {
      id: 'algorand',
      name: 'Algorand',
      symbol: 'ALGO',
      price: 0,
      value: 'algorand',
      label: 'Algorand (ALGO)',
      image: 'https://coin-images.coingecko.com/coins/images/4030/small/algorand.png'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      price: 0,
      value: 'solana',
      label: 'Solana (SOL)',
      image: 'https://coin-images.coingecko.com/coins/images/4128/small/solana.png'
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      price: 0,
      value: 'cardano',
      label: 'Cardano (ADA)',
      image: 'https://coin-images.coingecko.com/coins/images/975/small/cardano.png'
    },
    {
      id: 'polkadot',
      name: 'Polkadot',
      symbol: 'DOT',
      price: 0,
      value: 'polkadot',
      label: 'Polkadot (DOT)',
      image: 'https://coin-images.coingecko.com/coins/images/12171/small/polkadot.png'
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      price: 0,
      value: 'chainlink',
      label: 'Chainlink (LINK)',
      image: 'https://coin-images.coingecko.com/coins/images/877/small/chainlink-new-logo.png'
    },
    {
      id: 'dogecoin',
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: 0,
      value: 'dogecoin',
      label: 'Dogecoin (DOGE)',
      image: 'https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png'
    }
  ];

  async startRealTimeTracking(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting real-time trading service...');
    
    // Initial price fetch
    await this.updatePrices();
    
    // Set up real-time updates every 5 seconds
    this.interval = setInterval(async () => {
      await this.updatePrices();
      await this.executeBotTrades();
      this.notifySubscribers();
    }, 5000);
  }

  stopRealTimeTracking(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Stopped real-time trading service');
  }

  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private async updatePrices(): Promise<void> {
    try {
      // Fetch real prices from CoinGecko
      const coinIds = this.supportedCoins.map(coin => coin.id).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=aud&include_24hr_change=true&include_24hr_vol=true`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Update price cache with real data
        this.supportedCoins.forEach(coin => {
          const coinData = data[coin.id];
          if (coinData) {
            const priceInfo: RealTimePrice = {
              symbol: coin.symbol,
              price: coinData.aud,
              change24h: coinData.aud_24h_change || 0,
              volume: coinData.aud_24h_vol || 0,
              timestamp: Date.now()
            };
            
            this.priceCache.set(coin.symbol, priceInfo);
            coin.price = priceInfo.price;
            coin.changePercent = priceInfo.change24h;
            coin.volume = priceInfo.volume;
          }
        });

        console.log('✅ Updated real-time prices from CoinGecko');
      } else {
        // Fallback to mock data if API fails
        this.generateMockPrices();
      }
    } catch (error) {
      console.error('Error fetching real prices:', error);
      this.generateMockPrices();
    }
  }

  private generateMockPrices(): void {
    // Generate realistic mock prices if real API fails
    const mockPrices = {
      'BTC': 105000 + (Math.random() - 0.5) * 2000,
      'ETH': 2500 + (Math.random() - 0.5) * 100,
      'ALGO': 0.48 + (Math.random() - 0.5) * 0.05,
      'SOL': 150 + (Math.random() - 0.5) * 10,
      'ADA': 0.45 + (Math.random() - 0.5) * 0.05,
      'DOT': 8.5 + (Math.random() - 0.5) * 1,
      'LINK': 25 + (Math.random() - 0.5) * 2,
      'DOGE': 0.08 + (Math.random() - 0.5) * 0.01
    };

    Object.entries(mockPrices).forEach(([symbol, price]) => {
      const change24h = (Math.random() - 0.5) * 10; // ±5% change
      const priceInfo: RealTimePrice = {
        symbol,
        price,
        change24h,
        volume: Math.random() * 1000000,
        timestamp: Date.now()
      };
      
      this.priceCache.set(symbol, priceInfo);
      
      // Update coin data
      const coin = this.supportedCoins.find(c => c.symbol === symbol);
      if (coin) {
        coin.price = price;
        coin.changePercent = change24h;
        coin.volume = priceInfo.volume;
      }
    });
  }

  private async executeBotTrades(): Promise<void> {
    // Simulate AI bot trading decisions
    const activeBots = this.getActiveBots();
    
    for (const bot of activeBots) {
      const signal = await this.generateTradingSignal(bot);
      
      if (signal && signal.type !== 'hold') {
        const trade = this.createTradeFromSignal(bot, signal);
        
        this.botExecutions.push({
          botId: bot.id,
          trade,
          signal,
          timestamp: new Date().toISOString()
        });

        // Update bot performance
        this.updateBotPerformance(bot, trade);
        
        console.log(`🤖 Bot ${bot.name} executed ${signal.type} trade: ${trade.amount} ${trade.coinSymbol} at $${trade.price}`);
      }
    }
  }

  private getActiveBots(): AIBot[] {
    // Mock active bots - in real implementation, this would come from the bot store
    return [
      {
        id: 'bot-1',
        name: 'BTC Trend Follower',
        strategy: 'trend-following',
        status: 'active',
        isActive: true,
        model: 'deepseek/deepseek-r1',
        createdAt: new Date().toISOString(),
        riskLevel: 'medium',
        maxTradeAmount: 1000,
        targetAssets: ['BTC'],
        performance: {
          totalReturn: 15.4,
          winRate: 68,
          trades: 42,
          totalTrades: 42,
          maxDrawdown: 8.5,
          sharpeRatio: 1.2
        },
        auditLog: []
      },
      {
        id: 'bot-2',
        name: 'ALGO Arbitrage',
        strategy: 'arbitrage',
        status: 'active',
        isActive: true,
        model: 'google/gemini-2.0-flash-exp',
        createdAt: new Date().toISOString(),
        riskLevel: 'low',
        maxTradeAmount: 500,
        targetAssets: ['ALGO'],
        performance: {
          totalReturn: 8.7,
          winRate: 82,
          trades: 156,
          totalTrades: 156,
          maxDrawdown: 3.2,
          sharpeRatio: 2.1
        },
        auditLog: []
      }
    ];
  }

  private async generateTradingSignal(bot: AIBot): Promise<TradingSignal | null> {
    const targetAsset = bot.targetAssets[0];
    const priceData = this.priceCache.get(targetAsset);
    
    if (!priceData) return null;

    // AI-based signal generation logic
    const strategy = bot.strategy;
    const price = priceData.price;
    const change24h = priceData.change24h;
    
    let signal: 'buy' | 'sell' | 'hold' = 'hold';
    let confidence = 0.5;
    let reasoning = 'No clear signal';

    switch (strategy) {
      case 'trend-following':
        if (change24h > 3) {
          signal = 'buy';
          confidence = Math.min(0.9, 0.5 + (change24h / 20));
          reasoning = `Strong upward trend detected: +${change24h.toFixed(2)}%`;
        } else if (change24h < -3) {
          signal = 'sell';
          confidence = Math.min(0.9, 0.5 + Math.abs(change24h) / 20);
          reasoning = `Downward trend detected: ${change24h.toFixed(2)}%`;
        }
        break;
        
      case 'arbitrage':
        // Simulate arbitrage opportunity detection
        if (Math.random() > 0.8) {
          signal = Math.random() > 0.5 ? 'buy' : 'sell';
          confidence = 0.8 + Math.random() * 0.15;
          reasoning = 'Arbitrage opportunity detected across exchanges';
        }
        break;
        
      case 'mean-reversion':
        if (Math.abs(change24h) > 5) {
          signal = change24h > 0 ? 'sell' : 'buy';
          confidence = 0.7;
          reasoning = `Mean reversion signal: price deviation ${change24h.toFixed(2)}%`;
        }
        break;
    }

    if (signal === 'hold') return null;

    return {
      id: `signal-${Date.now()}`,
      coinId: this.supportedCoins.find(c => c.symbol === targetAsset)?.id || targetAsset.toLowerCase(),
      coinSymbol: targetAsset,
      type: signal,
      price,
      strength: confidence,
      timestamp: new Date().toISOString(),
      reason: reasoning,
      suggestedActions: {
        entry: price,
        target: signal === 'buy' ? price * 1.05 : price * 0.95,
        stopLoss: signal === 'buy' ? price * 0.98 : price * 1.02
      }
    };
  }

  private createTradeFromSignal(bot: AIBot, signal: TradingSignal): Trade {
    const amount = Math.min(bot.maxTradeAmount / signal.price, bot.maxTradeAmount * 0.1);
    const totalValue = amount * signal.price;
    const fees = totalValue * 0.001; // 0.1% fee
    
    return {
      id: `trade-${Date.now()}`,
      coinId: signal.coinId,
      coinName: this.supportedCoins.find(c => c.symbol === signal.coinSymbol)?.name || signal.coinSymbol,
      coinSymbol: signal.coinSymbol,
      symbol: signal.coinSymbol,
      type: signal.type,
      amount,
      quantity: amount,
      price: signal.price,
      totalValue,
      timestamp: signal.timestamp,
      currency: 'AUD',
      total: totalValue,
      botGenerated: true,
      strategyId: bot.strategy,
      fees
    };
  }

  private updateBotPerformance(bot: AIBot, trade: Trade): void {
    // Update bot performance metrics
    bot.performance.trades += 1;
    bot.performance.totalTrades += 1;
    
    // Simulate win/loss (in real implementation, this would be calculated based on actual performance)
    const isWin = Math.random() > 0.4; // 60% win rate
    if (isWin) {
      const profit = trade.totalValue * 0.02; // 2% profit
      bot.performance.totalReturn += (profit / 10000) * 100; // Convert to percentage
    }
    
    bot.performance.winRate = (bot.performance.winRate + (isWin ? 1 : 0)) / 2;
  }

  private notifySubscribers(): void {
    const data = {
      prices: Array.from(this.priceCache.values()),
      coins: this.supportedCoins,
      executions: this.botExecutions.slice(-10), // Last 10 executions
      timestamp: Date.now()
    };
    
    this.subscribers.forEach(callback => callback(data));
  }

  // Public API methods
  getCurrentPrices(): CoinOption[] {
    return this.supportedCoins;
  }

  getRecentExecutions(): BotExecution[] {
    return this.botExecutions.slice(-20);
  }

  getPriceHistory(symbol: string, hours: number = 24): any[] {
    // Mock price history - in real implementation, this would store historical data
    const currentPrice = this.priceCache.get(symbol)?.price || 0;
    const history = [];
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = Date.now() - (i * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const price = currentPrice * (1 + variation);
      
      history.push({
        timestamp,
        price,
        volume: Math.random() * 1000000
      });
    }
    
    return history;
  }

  async getAlgorandData(): Promise<any> {
    try {
      const status = await algorandService.getNetworkStatus();
      const mockData = algorandService.getMockData();
      
      return {
        ...mockData,
        networkStatus: status,
        realTimeConnected: true
      };
    } catch (error) {
      console.error('Error fetching Algorand data:', error);
      return algorandService.getMockData();
    }
  }

  // N8N Integration methods
  async sendTradingSignalToN8N(signal: TradingSignal): Promise<boolean> {
    return await n8nAutomationService.sendTradingSignal({
      symbol: signal.coinSymbol,
      signal: signal.type.toUpperCase() as 'BUY' | 'SELL',
      confidence: signal.strength,
      price: signal.price,
      timestamp: signal.timestamp,
      strategy: 'ai-bot',
      reasoning: signal.reason
    });
  }

  async sendPortfolioUpdateToN8N(portfolioData: any): Promise<boolean> {
    return await n8nAutomationService.sendPortfolioUpdate(portfolioData);
  }

  async sendRiskAlertToN8N(riskData: any): Promise<boolean> {
    return await n8nAutomationService.sendRiskAlert(riskData);
  }
}

export const realTimeTradingService = new RealTimeTradingService();
export default realTimeTradingService;
