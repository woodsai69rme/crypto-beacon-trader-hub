
import { BacktestResult, Trade, AITradingStrategy } from '@/types/trading';

export class BacktestService {
  async runBacktest(
    strategy: AITradingStrategy,
    historicalData: number[][],
    initialBalance: number = 10000,
    startDate: string,
    endDate: string
  ): Promise<BacktestResult> {
    const trades: Trade[] = [];
    let balance = initialBalance;
    let position = 0;
    let wins = 0;
    let losses = 0;
    let maxDrawdown = 0;
    let peakBalance = initialBalance;

    // Simple simulation based on strategy type
    for (let i = 1; i < historicalData.length; i++) {
      const currentPrice = historicalData[i][1];
      const previousPrice = historicalData[i - 1][1];
      const priceChange = (currentPrice - previousPrice) / previousPrice;

      // Generate signals based on strategy
      const signal = this.generateSignal(strategy, historicalData, i);

      if (signal === 'buy' && position === 0) {
        const quantity = balance * 0.1 / currentPrice; // Use 10% of balance
        position = quantity;
        balance -= quantity * currentPrice;

        trades.push({
          id: `trade-${i}`,
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          coinSymbol: 'BTC',
          symbol: 'BTC',
          type: 'buy',
          quantity,
          price: currentPrice,
          totalValue: quantity * currentPrice,
          timestamp: new Date(historicalData[i][0]).toISOString(),
          currency: 'USD',
          botGenerated: true,
          strategyId: strategy.id
        });
      } else if (signal === 'sell' && position > 0) {
        const saleValue = position * currentPrice;
        balance += saleValue;
        
        const lastBuy = trades.filter(t => t.type === 'buy').pop();
        if (lastBuy && saleValue > lastBuy.totalValue) {
          wins++;
        } else {
          losses++;
        }

        trades.push({
          id: `trade-${i}-sell`,
          coinId: 'bitcoin',
          coinName: 'Bitcoin',
          coinSymbol: 'BTC',
          symbol: 'BTC',
          type: 'sell',
          quantity: position,
          price: currentPrice,
          totalValue: saleValue,
          timestamp: new Date(historicalData[i][0]).toISOString(),
          currency: 'USD',
          botGenerated: true,
          strategyId: strategy.id
        });

        position = 0;
      }

      // Calculate current portfolio value
      const currentValue = balance + (position * currentPrice);
      if (currentValue > peakBalance) {
        peakBalance = currentValue;
      }

      const drawdown = (peakBalance - currentValue) / peakBalance;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // Final portfolio value
    const finalPrice = historicalData[historicalData.length - 1][1];
    const finalBalance = balance + (position * finalPrice);

    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const profit = finalBalance - initialBalance;
    const profitPercentage = (profit / initialBalance) * 100;

    return {
      startDate,
      endDate,
      initialBalance,
      finalBalance,
      profit,
      profitPercentage,
      winRate,
      winningTrades: wins,
      totalTrades,
      losingTrades: losses,
      maxDrawdown: maxDrawdown * 100,
      sharpeRatio: this.calculateSharpeRatio(trades),
      profitFactor: this.calculateProfitFactor(trades),
      trades,
      averageProfit: wins > 0 ? profit / wins : 0,
      averageLoss: losses > 0 ? Math.abs(profit) / losses : 0,
      initialCapital: initialBalance,
      finalCapital: finalBalance,
      totalReturn: profitPercentage,
      sortinoRatio: this.calculateSortinoRatio(trades)
    };
  }

  private generateSignal(
    strategy: AITradingStrategy,
    data: number[][],
    index: number
  ): 'buy' | 'sell' | 'hold' {
    if (index < 20) return 'hold'; // Need enough data

    const currentPrice = data[index][1];
    const prices = data.slice(Math.max(0, index - 20), index + 1).map(d => d[1]);

    switch (strategy.type) {
      case 'trend-following':
        return this.generateTrendFollowingSignal(prices, strategy.parameters);
      case 'mean-reversion':
        return this.generateMeanReversionSignal(prices, strategy.parameters);
      case 'breakout':
        return this.generateBreakoutSignal(prices, strategy.parameters);
      default:
        return 'hold';
    }
  }

  private generateTrendFollowingSignal(prices: number[], params: any): 'buy' | 'sell' | 'hold' {
    const shortMA = this.calculateSMA(prices, params.shortPeriod || 10);
    const longMA = this.calculateSMA(prices, params.longPeriod || 20);

    if (shortMA > longMA && prices[prices.length - 2] <= prices[prices.length - 3]) {
      return 'buy';
    } else if (shortMA < longMA && prices[prices.length - 2] >= prices[prices.length - 3]) {
      return 'sell';
    }

    return 'hold';
  }

  private generateMeanReversionSignal(prices: number[], params: any): 'buy' | 'sell' | 'hold' {
    const rsi = this.calculateRSI(prices, params.period || 14);
    
    if (rsi < (params.oversold || 30)) {
      return 'buy';
    } else if (rsi > (params.overbought || 70)) {
      return 'sell';
    }

    return 'hold';
  }

  private generateBreakoutSignal(prices: number[], params: any): 'buy' | 'sell' | 'hold' {
    const currentPrice = prices[prices.length - 1];
    const sma = this.calculateSMA(prices, params.period || 20);
    const stdDev = this.calculateStandardDeviation(prices);
    
    const upperBand = sma + (stdDev * (params.stdDev || 2));
    const lowerBand = sma - (stdDev * (params.stdDev || 2));

    if (currentPrice > upperBand) {
      return 'buy';
    } else if (currentPrice < lowerBand) {
      return 'sell';
    }

    return 'hold';
  }

  private calculateSMA(prices: number[], period: number): number {
    const slice = prices.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / slice.length;
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;

    return 100 - (100 / (1 + rs));
  }

  private calculateStandardDeviation(prices: number[]): number {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance);
  }

  private calculateSharpeRatio(trades: Trade[]): number {
    if (trades.length < 2) return 0;

    const returns = trades.map((trade, index) => {
      if (index === 0) return 0;
      return (trade.totalValue - trades[index - 1].totalValue) / trades[index - 1].totalValue;
    }).slice(1);

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length);

    return stdDev === 0 ? 0 : avgReturn / stdDev;
  }

  private calculateProfitFactor(trades: Trade[]): number {
    let grossProfit = 0;
    let grossLoss = 0;

    for (let i = 1; i < trades.length; i += 2) {
      if (i < trades.length) {
        const profit = trades[i].totalValue - trades[i - 1].totalValue;
        if (profit > 0) {
          grossProfit += profit;
        } else {
          grossLoss += Math.abs(profit);
        }
      }
    }

    return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  }

  private calculateSortinoRatio(trades: Trade[]): number {
    if (trades.length < 2) return 0;

    const returns = trades.map((trade, index) => {
      if (index === 0) return 0;
      return (trade.totalValue - trades[index - 1].totalValue) / trades[index - 1].totalValue;
    }).slice(1);

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const negativeReturns = returns.filter(ret => ret < 0);
    
    if (negativeReturns.length === 0) return avgReturn > 0 ? Infinity : 0;

    const downwardDeviation = Math.sqrt(
      negativeReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / negativeReturns.length
    );

    return downwardDeviation === 0 ? 0 : avgReturn / downwardDeviation;
  }
}

export const backtestService = new BacktestService();
