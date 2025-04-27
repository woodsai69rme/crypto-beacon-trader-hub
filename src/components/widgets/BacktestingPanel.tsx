
import React, { useState } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  BacktestResult, BacktestTrade, TimeframeOption, 
  AITradingStrategy  
} from '@/types/trading';
import { 
  availableTimeframes, 
  sampleStrategies 
} from '@/utils/aiTradingStrategies';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const sampleCoins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB' },
];

const generateMockBacktestResults = (): BacktestResult => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  
  const endDate = new Date();
  const initialBalance = 10000;
  
  // Generate some random trades
  const trades: BacktestTrade[] = [];
  let runningBalance = initialBalance;
  
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Generate a trade every 1-3 days
    if (Math.random() < 0.33) {
      const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
      const price = 20000 + (Math.random() * 10000) - 5000;  // Around 20k ±5k
      const amount = 0.1 + Math.random() * 0.4;  // 0.1 to 0.5 coins
      const total = price * amount;
      
      let profit = 0;
      let profitPercentage = 0;
      
      // Calculate profit for sell orders
      if (tradeType === 'sell' && trades.length > 0) {
        // Find last buy order to calculate profit
        const lastBuy = [...trades].reverse().find(t => t.type === 'buy');
        if (lastBuy) {
          profit = (price - lastBuy.price) * amount;
          profitPercentage = ((price / lastBuy.price) - 1) * 100;
        }
      }
      
      const trade: BacktestTrade = {
        id: `trade-${trades.length + 1}`,
        timestamp: currentDate.toISOString(),
        type: tradeType as 'buy' | 'sell',
        price,
        amount,
        total,
        profit,
        profitPercentage,
        date: currentDate.toLocaleDateString(),
      };
      
      trades.push(trade);
      
      if (tradeType === 'buy') {
        runningBalance -= total;
      } else {
        runningBalance += total;
      }
    }
    
    // Advance 1-3 days
    const daysToAdvance = 1 + Math.floor(Math.random() * 3);
    currentDate.setDate(currentDate.getDate() + daysToAdvance);
  }
  
  // Calculate final metrics
  const winningTrades = trades.filter(t => (t.profit || 0) > 0).length;
  const losingTrades = trades.filter(t => (t.profit || 0) < 0).length;
  
  const totalProfit = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const finalBalance = initialBalance + totalProfit;
  
  // Calculate maximum drawdown
  let peak = initialBalance;
  let maxDrawdown = 0;
  
  trades.forEach(trade => {
    const currentBalance = trade.type === 'buy' 
      ? peak - trade.total 
      : peak + trade.total + (trade.profit || 0);
    
    if (currentBalance > peak) {
      peak = currentBalance;
    }
    
    const drawdown = (peak - currentBalance) / peak * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    initialBalance,
    finalBalance,
    profit: finalBalance - initialBalance,
    profitPercentage: ((finalBalance / initialBalance) - 1) * 100,
    maxDrawdown,
    winRate: trades.length > 0 ? winningTrades / trades.length : 0,
    trades,
    sharpeRatio: 1.2 + Math.random() * 0.8,  // Random between 1.2 and 2.0
    profitFactor: 1.5 + Math.random() * 1.0,  // Random between 1.5 and 2.5
    averageProfit: totalProfit / (winningTrades || 1),
    averageLoss: -totalProfit / (losingTrades || 1),
    totalTrades: trades.length,
    winningTrades,
    losingTrades,
    sortinoRatio: 1.3 + Math.random() * 0.7,  // Random between 1.3 and 2.0
  };
};

const BacktestingPanel = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>(sampleStrategies[0]?.id || '');
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
  const [initialBalance, setInitialBalance] = useState<number>(10000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const handleRunBacktest = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults = generateMockBacktestResults();
      setResults(mockResults);
      setIsLoading(false);
      
      toast({
        title: "Backtest completed",
        description: "The strategy has been tested with historical data.",
      });
    }, 2000);
  };

  const strategyOptions = sampleStrategies.map(strategy => ({
    label: strategy.name,
    value: strategy.id,
  }));

  const timeframeOptions = availableTimeframes;
  
  const selectedTimeframeObj = timeframeOptions.find(tf => tf.value === selectedTimeframe);
  const selectedStrategyObj = sampleStrategies.find(s => s.id === selectedStrategy);

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format number as percentage
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Generate chart data from backtest results
  const generateChartData = (backtest: BacktestResult | null) => {
    if (!backtest) return [];
    
    // Start with initial balance
    const data: { date: string; balance: number }[] = [{
      date: new Date(backtest.startDate).toLocaleDateString(),
      balance: backtest.initialBalance
    }];
    
    let runningBalance = backtest.initialBalance;
    
    // Add data points for each trade
    backtest.trades.forEach(trade => {
      if (trade.type === 'buy') {
        runningBalance -= trade.total;
      } else {
        runningBalance += trade.total;
      }
      
      data.push({
        date: new Date(trade.timestamp).toLocaleDateString(),
        balance: runningBalance
      });
    });
    
    return data;
  };
  
  const chartData = generateChartData(results);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Strategy Backtesting</CardTitle>
        <CardDescription>
          Test your trading strategies against historical price data
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="strategy">Trading Strategy</Label>
              <Select
                value={selectedStrategy}
                onValueChange={setSelectedStrategy}
              >
                <SelectTrigger id="strategy">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="coin">Cryptocurrency</Label>
              <Select
                value={selectedCoin}
                onValueChange={setSelectedCoin}
              >
                <SelectTrigger id="coin">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  {sampleCoins.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select
                value={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map(tf => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label} - {tf.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="balance">Initial Balance (USD)</Label>
              <Input
                id="balance"
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        {selectedStrategyObj && (
          <div className="p-4 border rounded-md mb-6">
            <h3 className="font-medium text-sm mb-2">Strategy Details: {selectedStrategyObj.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{selectedStrategyObj.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Risk Level: </span>
                <span className="font-medium">{selectedStrategyObj.riskLevel}</span>
              </div>
              <div>
                <span className="text-gray-500">Indicators: </span>
                <span className="font-medium">{selectedStrategyObj.indicators.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Parameters: </span>
                <span className="font-medium">{selectedStrategyObj.parameters.length}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <Button onClick={handleRunBacktest} disabled={isLoading}>
            {isLoading ? 'Running Backtest...' : 'Run Backtest'}
          </Button>
        </div>
        
        {results && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-muted/40 rounded-md">
                <div className="text-xs text-gray-500">Total Profit/Loss</div>
                <div className={`text-lg font-bold ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.profit)}
                </div>
                <div className={`text-xs ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(results.profitPercentage)}
                </div>
              </div>
              
              <div className="p-4 bg-muted/40 rounded-md">
                <div className="text-xs text-gray-500">Win Rate</div>
                <div className="text-lg font-bold">{formatPercent(results.winRate * 100)}</div>
                <div className="text-xs text-gray-500">
                  {results.winningTrades} / {results.totalTrades} trades
                </div>
              </div>
              
              <div className="p-4 bg-muted/40 rounded-md">
                <div className="text-xs text-gray-500">Max Drawdown</div>
                <div className="text-lg font-bold text-red-600">{formatPercent(results.maxDrawdown)}</div>
                <div className="text-xs text-gray-500">Peak to trough</div>
              </div>
              
              <div className="p-4 bg-muted/40 rounded-md">
                <div className="text-xs text-gray-500">Sharpe Ratio</div>
                <div className="text-lg font-bold">{results.sharpeRatio?.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Risk-adjusted return</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Balance History</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#8884d8"
                      name="Account Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Trade History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-right">Profit/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.trades.slice(0, 10).map((trade) => (
                      <tr key={trade.id} className="border-b last:border-b-0">
                        <td className="px-4 py-2">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </td>
                        <td className={`px-4 py-2 ${
                          trade.type === 'buy' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.type.toUpperCase()}
                        </td>
                        <td className="px-4 py-2 text-right">{formatCurrency(trade.price)}</td>
                        <td className="px-4 py-2 text-right">{trade.amount.toFixed(4)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(trade.total)}</td>
                        <td className={`px-4 py-2 text-right ${
                          (trade.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.profit !== undefined ? formatCurrency(trade.profit) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {results.trades.length > 10 && (
                <div className="text-center mt-2 text-sm text-gray-500">
                  Showing 10 of {results.trades.length} trades
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline">Reset</Button>
        <Button 
          variant="outline" 
          disabled={!results}
          onClick={() => {
            toast({
              title: "Report Generated",
              description: "Backtest report has been exported as a CSV file."
            });
          }}
        >
          Export Results
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BacktestingPanel;
