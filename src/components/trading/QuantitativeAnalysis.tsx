import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuantitativeAnalysisProps } from './types/analysis';
import { TrendingUp, TrendingDown, MinusCircle } from "lucide-react";

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({ 
  symbol = "BTC/USD",
  timeframe = "1D",
  onResultsCalculated
}) => {
  const [activeTab, setActiveTab] = useState('momentum');
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<{
    momentum: any[];
    volatility: any[];
    trends: any[];
    correlations: any[];
    summary: any;
  }>({
    momentum: [],
    volatility: [],
    trends: [],
    correlations: [],
    summary: null
  });

  // Simulate calculation of quantitative indicators
  const calculateIndicators = () => {
    setIsCalculating(true);
    
    // Simulate API call or calculation
    setTimeout(() => {
      // Mock data - in a real app, this would be calculated from actual price data
      const momentum = [
        { name: 'RSI (14)', value: 62.4, interpretation: 'Neutral with bullish bias' },
        { name: 'MACD (12,26,9)', value: '0.12', interpretation: 'Bullish, above signal line' },
        { name: 'Stochastic Oscillator', value: '78.5', interpretation: 'Overbought territory' },
        { name: 'ROC (10)', value: 5.2, interpretation: 'Positive momentum' },
        { name: 'Bull/Bear Power', value: 245.7, interpretation: 'Strong bullish power' }
      ];
      
      const volatility = [
        { name: 'Bollinger Bandwidth', value: '4.2%', interpretation: 'Average volatility' },
        { name: 'ATR (14)', value: '$1280', interpretation: 'High volatility' },
        { name: 'Historical Vol (30D)', value: '48.5%', interpretation: 'Above average' },
        { name: 'Implied Vol', value: '52.3%', interpretation: 'Expecting higher volatility' },
        { name: 'VWAP Distance', value: '2.1%', interpretation: 'Price above VWAP' }
      ];
      
      const trends = [
        { name: 'ADX (14)', value: 28.3, interpretation: 'Strong trend' },
        { name: 'Supertrend (10,3)', value: 'Bullish', interpretation: 'Above supertrend line' },
        { name: 'Ichimoku Cloud', value: 'Bullish', interpretation: 'Price above cloud' },
        { name: 'Parabolic SAR', value: 'Bullish', interpretation: 'Below price' },
        { name: 'Linear Regression Slope', value: 0.67, interpretation: 'Upward sloping' }
      ];
      
      const correlations = [
        { name: 'ETH Correlation (30D)', value: 0.92, interpretation: 'Very high positive' },
        { name: 'S&P 500 Correlation', value: 0.48, interpretation: 'Moderate positive' },
        { name: 'Gold Correlation', value: 0.12, interpretation: 'Low positive' },
        { name: 'DXY Correlation', value: -0.56, interpretation: 'Moderate negative' },
        { name: 'VIX Correlation', value: -0.32, interpretation: 'Low negative' }
      ];
      
      const summary = {
        overallSignal: 'Bullish',
        confidence: 72,
        keyStrengths: [
          'Strong momentum indicators',
          'Positive trend strength',
          'Favorable correlation with ETH'
        ],
        keyWeaknesses: [
          'Overbought on some oscillators',
          'High volatility suggesting risk',
          'Negative correlation with dollar index'
        ],
        recommendation: 'Consider long positions with tight stop losses due to volatility'
      };
      
      const newResults = {
        momentum,
        volatility,
        trends,
        correlations,
        summary
      };
      
      setResults(newResults);
      setIsCalculating(false);
      
      if (onResultsCalculated) {
        onResultsCalculated(newResults);
      }
    }, 1500);
  };
  
  // Calculate on first load
  useEffect(() => {
    calculateIndicators();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              Quantitative Analysis
            </CardTitle>
            <CardDescription>
              {symbol} • {timeframe} Timeframe
            </CardDescription>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={calculateIndicators}
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Recalculate'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isCalculating ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Calculating indicators...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Overall Signal</div>
                  <div className="text-xl font-bold mt-1">
                    {results.summary?.overallSignal}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className="text-xl font-bold mt-1">
                    {results.summary?.confidence}%
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50 md:col-span-2">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Recommendation</div>
                  <div className="text-sm font-medium mt-1">
                    {results.summary?.recommendation}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="momentum">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Momentum</span>
                </TabsTrigger>
                <TabsTrigger value="volatility">
                  <ArrowDownUp className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Volatility</span>
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <LineChart className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Trends</span>
                </TabsTrigger>
                <TabsTrigger value="correlations">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Correlations</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="momentum">
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Momentum Indicators</h3>
                  <div className="space-y-2">
                    {results.momentum.map((indicator, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{indicator.name}</div>
                          <div className="font-mono">{indicator.value}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {indicator.interpretation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="volatility">
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Volatility Indicators</h3>
                  <div className="space-y-2">
                    {results.volatility.map((indicator, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{indicator.name}</div>
                          <div className="font-mono">{indicator.value}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {indicator.interpretation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends">
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Trend Indicators</h3>
                  <div className="space-y-2">
                    {results.trends.map((indicator, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{indicator.name}</div>
                          <div className="font-mono">{indicator.value}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {indicator.interpretation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="correlations">
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Correlation Analysis</h3>
                  <div className="space-y-2">
                    {results.correlations.map((indicator, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{indicator.name}</div>
                          <div className="font-mono">{indicator.value}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {indicator.interpretation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Key Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-500 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {results.summary?.keyStrengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-red-500 mb-2">Weaknesses</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {results.summary?.keyWeaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
