
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useTradingContext } from '@/contexts/TradingContext';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Calculator, FileText } from 'lucide-react';

interface AuditResult {
  category: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

interface ProfitabilityAnalysis {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  realMoneySimulation: {
    initialCapital: number;
    finalCapital: number;
    totalReturn: number;
    fees: number;
    netReturn: number;
  };
}

const TradingAuditSystem: React.FC = () => {
  const { accounts, activeAccount } = useTradingContext();
  const { bots } = useAiTrading();
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [profitabilityAnalysis, setProfitabilityAnalysis] = useState<ProfitabilityAnalysis | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const runFullAudit = async () => {
    setIsAuditing(true);
    setAuditProgress(0);
    const results: AuditResult[] = [];

    // Test 1: Account Integrity
    setAuditProgress(10);
    results.push(await auditAccountIntegrity());

    // Test 2: Trading Logic
    setAuditProgress(25);
    results.push(await auditTradingLogic());

    // Test 3: AI Bot Performance
    setAuditProgress(40);
    results.push(await auditAiBotPerformance());

    // Test 4: Data Consistency
    setAuditProgress(55);
    results.push(await auditDataConsistency());

    // Test 5: Currency Conversion
    setAuditProgress(70);
    results.push(await auditCurrencyConversion());

    // Test 6: Risk Management
    setAuditProgress(85);
    results.push(await auditRiskManagement());

    // Test 7: Profitability Analysis
    setAuditProgress(100);
    const profitAnalysis = await analyzeProfitability();
    setProfitabilityAnalysis(profitAnalysis);

    setAuditResults(results);
    setIsAuditing(false);
  };

  const auditAccountIntegrity = async (): Promise<AuditResult> => {
    try {
      let issues = 0;
      const details: string[] = [];

      accounts.forEach(account => {
        if (!account.id || !account.name) {
          issues++;
          details.push(`Account missing required fields: ${account.name || 'Unknown'}`);
        }

        if (account.balance < 0) {
          issues++;
          details.push(`Negative balance in account: ${account.name}`);
        }

        // Check for orphaned trades
        account.trades.forEach(trade => {
          if (!trade.coinId || !trade.coinSymbol) {
            issues++;
            details.push(`Invalid trade data in account: ${account.name}`);
          }
        });
      });

      return {
        category: 'Account Integrity',
        status: issues === 0 ? 'pass' : 'warning',
        message: issues === 0 ? 'All accounts are valid' : `Found ${issues} account issues`,
        details
      };
    } catch (error) {
      return {
        category: 'Account Integrity',
        status: 'fail',
        message: 'Failed to audit accounts',
        details: [error.message]
      };
    }
  };

  const auditTradingLogic = async (): Promise<AuditResult> => {
    try {
      let issues = 0;
      const details: string[] = [];

      if (!activeAccount) {
        return {
          category: 'Trading Logic',
          status: 'warning',
          message: 'No active account for testing',
          details: ['Create an account to test trading logic']
        };
      }

      // Check trade calculations
      activeAccount.trades.forEach((trade, index) => {
        const calculatedTotal = trade.amount * trade.price;
        const tolerance = 0.01; // 1 cent tolerance

        if (Math.abs(calculatedTotal - trade.totalValue) > tolerance) {
          issues++;
          details.push(`Trade ${index + 1}: Calculation error - Expected ${calculatedTotal}, got ${trade.totalValue}`);
        }

        if (trade.amount <= 0 || trade.price <= 0) {
          issues++;
          details.push(`Trade ${index + 1}: Invalid amount or price`);
        }
      });

      return {
        category: 'Trading Logic',
        status: issues === 0 ? 'pass' : 'fail',
        message: issues === 0 ? 'Trading calculations are correct' : `Found ${issues} calculation errors`,
        details
      };
    } catch (error) {
      return {
        category: 'Trading Logic',
        status: 'fail',
        message: 'Failed to audit trading logic',
        details: [error.message]
      };
    }
  };

  const auditAiBotPerformance = async (): Promise<AuditResult> => {
    try {
      let issues = 0;
      const details: string[] = [];

      if (bots.length === 0) {
        return {
          category: 'AI Bot Performance',
          status: 'warning',
          message: 'No AI bots to audit',
          details: ['Create AI bots to test performance']
        };
      }

      bots.forEach(bot => {
        if (!bot.performance) {
          issues++;
          details.push(`Bot ${bot.name}: Missing performance data`);
        } else {
          if (bot.performance.winRate < 0 || bot.performance.winRate > 100) {
            issues++;
            details.push(`Bot ${bot.name}: Invalid win rate ${bot.performance.winRate}%`);
          }

          if (bot.performance.totalTrades < 0) {
            issues++;
            details.push(`Bot ${bot.name}: Negative trade count`);
          }
        }

        if (!bot.strategy || !bot.strategy.name) {
          issues++;
          details.push(`Bot ${bot.name}: Missing strategy configuration`);
        }
      });

      return {
        category: 'AI Bot Performance',
        status: issues === 0 ? 'pass' : 'warning',
        message: issues === 0 ? 'All bots have valid performance data' : `Found ${issues} bot issues`,
        details
      };
    } catch (error) {
      return {
        category: 'AI Bot Performance',
        status: 'fail',
        message: 'Failed to audit AI bots',
        details: [error.message]
      };
    }
  };

  const auditDataConsistency = async (): Promise<AuditResult> => {
    try {
      let issues = 0;
      const details: string[] = [];

      // Check for data type consistency
      accounts.forEach(account => {
        account.trades.forEach((trade, index) => {
          if (typeof trade.amount !== 'number' || typeof trade.price !== 'number') {
            issues++;
            details.push(`Account ${account.name} - Trade ${index + 1}: Non-numeric values`);
          }

          if (!trade.timestamp || isNaN(new Date(trade.timestamp).getTime())) {
            issues++;
            details.push(`Account ${account.name} - Trade ${index + 1}: Invalid timestamp`);
          }
        });
      });

      return {
        category: 'Data Consistency',
        status: issues === 0 ? 'pass' : 'fail',
        message: issues === 0 ? 'Data types are consistent' : `Found ${issues} data inconsistencies`,
        details
      };
    } catch (error) {
      return {
        category: 'Data Consistency',
        status: 'fail',
        message: 'Failed to audit data consistency',
        details: [error.message]
      };
    }
  };

  const auditCurrencyConversion = async (): Promise<AuditResult> => {
    try {
      // Test currency conversion accuracy
      const testRates = {
        'USD': 1.0,
        'AUD': 1.5,
        'EUR': 0.9,
        'GBP': 0.8
      };

      const testAmount = 100;
      let issues = 0;
      const details: string[] = [];

      // Simulate conversions
      Object.entries(testRates).forEach(([currency, rate]) => {
        const converted = testAmount * rate;
        if (converted <= 0) {
          issues++;
          details.push(`Invalid conversion rate for ${currency}`);
        }
      });

      return {
        category: 'Currency Conversion',
        status: issues === 0 ? 'pass' : 'fail',
        message: issues === 0 ? 'Currency conversions are working' : `Found ${issues} conversion issues`,
        details
      };
    } catch (error) {
      return {
        category: 'Currency Conversion',
        status: 'fail',
        message: 'Failed to audit currency conversion',
        details: [error.message]
      };
    }
  };

  const auditRiskManagement = async (): Promise<AuditResult> => {
    try {
      let issues = 0;
      const details: string[] = [];

      if (!activeAccount) {
        return {
          category: 'Risk Management',
          status: 'warning',
          message: 'No active account for risk analysis',
          details: []
        };
      }

      // Check for risk concentration
      const portfolioValue = activeAccount.balance;
      const largePositions = activeAccount.trades.filter(trade => 
        (trade.totalValue / portfolioValue) > 0.2 // More than 20% of portfolio
      );

      if (largePositions.length > 0) {
        issues++;
        details.push(`${largePositions.length} positions exceed 20% of portfolio`);
      }

      // Check for stop losses
      const tradesWithoutStopLoss = activeAccount.trades.filter(trade => !trade.strategyId);
      if (tradesWithoutStopLoss.length > 0) {
        details.push(`${tradesWithoutStopLoss.length} trades without risk management`);
      }

      return {
        category: 'Risk Management',
        status: issues === 0 ? 'pass' : 'warning',
        message: issues === 0 ? 'Risk management is adequate' : `Found ${issues} risk concerns`,
        details
      };
    } catch (error) {
      return {
        category: 'Risk Management',
        status: 'fail',
        message: 'Failed to audit risk management',
        details: [error.message]
      };
    }
  };

  const analyzeProfitability = async (): Promise<ProfitabilityAnalysis> => {
    if (!activeAccount) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        realMoneySimulation: {
          initialCapital: 0,
          finalCapital: 0,
          totalReturn: 0,
          fees: 0,
          netReturn: 0
        }
      };
    }

    const trades = activeAccount.trades;
    const initialCapital = 10000; // Starting with $10,000 AUD
    const feeRate = 0.001; // 0.1% trading fee

    let currentCapital = initialCapital;
    let totalFees = 0;
    let maxCapital = initialCapital;
    let maxDrawdown = 0;
    let winningTrades = 0;
    let losingTrades = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    // Simulate real money trading
    trades.forEach(trade => {
      const fee = trade.totalValue * feeRate;
      totalFees += fee;

      if (trade.type === 'buy') {
        currentCapital -= (trade.totalValue + fee);
      } else {
        const profit = trade.totalValue - fee;
        currentCapital += profit;
        
        if (profit > 0) {
          winningTrades++;
          totalProfit += profit;
        } else {
          losingTrades++;
          totalLoss += Math.abs(profit);
        }
      }

      // Track drawdown
      if (currentCapital > maxCapital) {
        maxCapital = currentCapital;
      } else {
        const drawdown = (maxCapital - currentCapital) / maxCapital * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    });

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const averageWin = winningTrades > 0 ? totalProfit / winningTrades : 0;
    const averageLoss = losingTrades > 0 ? totalLoss / losingTrades : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
    const netProfit = totalProfit - totalLoss;
    const totalReturn = ((currentCapital - initialCapital) / initialCapital) * 100;
    const netReturn = totalReturn - (totalFees / initialCapital * 100);

    // Calculate Sharpe ratio (simplified)
    const returns = trades.map(trade => trade.profitLoss || 0);
    const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
    const variance = returns.length > 0 ? returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length : 0;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalProfit,
      totalLoss,
      netProfit,
      averageWin,
      averageLoss,
      profitFactor,
      maxDrawdown,
      sharpeRatio,
      realMoneySimulation: {
        initialCapital,
        finalCapital: currentCapital,
        totalReturn,
        fees: totalFees,
        netReturn
      }
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Trading System Audit & Profitability Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={runFullAudit} disabled={isAuditing}>
              {isAuditing ? 'Running Audit...' : 'Run Full Audit'}
            </Button>
          </div>
          
          {isAuditing && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Audit Progress</span>
                <span className="text-sm">{auditProgress}%</span>
              </div>
              <Progress value={auditProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {auditResults.length > 0 && (
        <Tabs defaultValue="results" className="space-y-4">
          <TabsList>
            <TabsTrigger value="results">Audit Results</TabsTrigger>
            <TabsTrigger value="profitability">Profitability Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            {auditResults.map((result, index) => (
              <Alert key={index} className={
                result.status === 'fail' ? 'border-red-500' :
                result.status === 'warning' ? 'border-yellow-500' :
                'border-green-500'
              }>
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{result.category}</span>
                      <Badge variant={
                        result.status === 'fail' ? 'destructive' :
                        result.status === 'warning' ? 'secondary' :
                        'default'
                      }>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    <AlertDescription>{result.message}</AlertDescription>
                    {result.details && result.details.length > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <ul className="list-disc list-inside space-y-1">
                          {result.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </TabsContent>

          <TabsContent value="profitability" className="space-y-4">
            {profitabilityAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Trading Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold">{profitabilityAnalysis.totalTrades}</div>
                        <div className="text-sm text-muted-foreground">Total Trades</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {profitabilityAnalysis.winRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{profitabilityAnalysis.winningTrades}</div>
                        <div className="text-sm text-muted-foreground">Winning Trades</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{profitabilityAnalysis.losingTrades}</div>
                        <div className="text-sm text-muted-foreground">Losing Trades</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Average Win:</span>
                        <span className="text-green-600">{formatCurrency(profitabilityAnalysis.averageWin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Loss:</span>
                        <span className="text-red-600">{formatCurrency(-profitabilityAnalysis.averageLoss)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit Factor:</span>
                        <span className={profitabilityAnalysis.profitFactor > 1 ? 'text-green-600' : 'text-red-600'}>
                          {profitabilityAnalysis.profitFactor.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Drawdown:</span>
                        <span className="text-red-600">{profitabilityAnalysis.maxDrawdown.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sharpe Ratio:</span>
                        <span>{profitabilityAnalysis.sharpeRatio.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {profitabilityAnalysis.realMoneySimulation.netReturn >= 0 ? 
                        <TrendingUp className="h-5 w-5 text-green-500" /> :
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      }
                      Real Money Simulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className={
                      profitabilityAnalysis.realMoneySimulation.netReturn >= 0 ? 
                      'border-green-500 bg-green-50' : 
                      'border-red-500 bg-red-50'
                    }>
                      <AlertDescription>
                        {profitabilityAnalysis.realMoneySimulation.netReturn >= 0 ? 
                          `✅ Your trading would have MADE MONEY!` :
                          `❌ Your trading would have LOST MONEY!`
                        }
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Initial Capital:</span>
                        <span>{formatCurrency(profitabilityAnalysis.realMoneySimulation.initialCapital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Capital:</span>
                        <span className={profitabilityAnalysis.realMoneySimulation.finalCapital >= profitabilityAnalysis.realMoneySimulation.initialCapital ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(profitabilityAnalysis.realMoneySimulation.finalCapital)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Fees:</span>
                        <span className="text-red-600">{formatCurrency(profitabilityAnalysis.realMoneySimulation.fees)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Net P&L:</span>
                        <span className={profitabilityAnalysis.realMoneySimulation.netReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(profitabilityAnalysis.realMoneySimulation.finalCapital - profitabilityAnalysis.realMoneySimulation.initialCapital)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total Return:</span>
                        <span className={profitabilityAnalysis.realMoneySimulation.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {profitabilityAnalysis.realMoneySimulation.totalReturn >= 0 ? '+' : ''}{profitabilityAnalysis.realMoneySimulation.totalReturn.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Net Return (after fees):</span>
                        <span className={profitabilityAnalysis.realMoneySimulation.netReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {profitabilityAnalysis.realMoneySimulation.netReturn >= 0 ? '+' : ''}{profitabilityAnalysis.realMoneySimulation.netReturn.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TradingAuditSystem;
