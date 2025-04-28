
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, TrendingUp, TrendingDown, Circle } from 'lucide-react';

interface AiTradingVisualizerProps {
  botId: string;
  tradingPair: string;
  timeframe: string;
  isRunning: boolean;
}

const AiTradingVisualizer: React.FC<AiTradingVisualizerProps> = ({
  botId,
  tradingPair,
  timeframe,
  isRunning
}) => {
  // This is a placeholder component for visualization
  // In a real implementation, this would connect to trading data
  // and render actual charts and market data visualizations
  
  const isBitcoin = tradingPair.includes('BTC');
  const mockCurrentPrice = isBitcoin ? 88750 : (tradingPair.includes('ETH') ? 3450 : 150);
  
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium">Trading Visualization</h3>
          <div className="text-sm text-muted-foreground">
            {tradingPair} ({timeframe})
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{tradingPair}</Badge>
          <Badge variant="outline">{timeframe}</Badge>
          <Badge variant={isRunning ? "default" : "outline"} className={isRunning ? "bg-green-500/10 text-green-500" : ""}>
            {isRunning ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>
      
      <div className="h-80 border rounded-lg relative">
        {isRunning ? (
          <>
            {/* Mock chart visualization */}
            <svg 
              viewBox="0 0 100 30" 
              preserveAspectRatio="none" 
              className="w-full h-full"
            >
              <path 
                d="M0,15 L2,14 L4,16 L6,13 L8,14 L10,12 L12,15 L14,13 L16,14 L18,10 L20,12 L22,9 L24,13 L26,11 L28,14 L30,12 L32,10 L34,13 L36,9 L38,11 L40,8 L42,12 L44,10 L46,13 L48,9 L50,12 L52,7 L54,10 L56,6 L58,9 L60,4 L62,8 L64,5 L66,10 L68,7 L70,12 L72,6 L74,9 L76,5 L78,8 L80,4 L82,7 L84,3 L86,8 L88,5 L90,9 L92,4 L94,7 L96,3 L98,5 L100,2" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="0.5"
              />
              <path 
                d="M0,18 L2,19 L4,17 L6,20 L8,18 L10,21 L12,19 L14,22 L16,20 L18,23 L20,21 L22,24 L24,21 L26,24 L28,20 L30,23 L32,25 L34,21 L36,24 L38,22 L40,25 L42,21 L44,24 L46,22 L48,25 L50,22 L52,26 L54,23 L56,27 L58,24 L60,28 L62,25 L64,28 L66,24 L68,27 L70,23 L72,27 L74,24 L76,28 L78,25 L80,29 L82,26 L84,30 L86,26 L88,29 L90,25 L92,29 L94,26 L96,30 L98,27 L100,29" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="0.5"
              />
              
              {/* Prediction indicator */}
              <circle cx="80" cy="4" r="0.8" fill="#10b981" />
              <line x1="80" y1="4" x2="100" y2="2" stroke="#10b981" strokeWidth="0.5" strokeDasharray="0.5,0.5" />
              <text x="85" y="3" fontSize="2" fill="#10b981">Target</text>
              
              {/* Stop loss indicator */}
              <circle cx="80" cy="15" r="0.8" fill="#ef4444" />
              <line x1="80" y1="15" x2="100" y2="15" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="0.5,0.5" />
              <text x="85" y="14" fontSize="2" fill="#ef4444">Stop</text>
              
              {/* Current price indicator */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="#3b82f6" strokeWidth="0.2" strokeDasharray="0.5,0.5" />
              <text x="1" y="9" fontSize="2" fill="#3b82f6">Current Price</text>
              
              {/* Trade signals */}
              <circle cx="20" cy="12" r="0.8" fill="#10b981" />
              <circle cx="40" cy="8" r="0.8" fill="#10b981" />
              <circle cx="60" cy="4" r="0.8" fill="#10b981" />
              <circle cx="30" cy="12" r="0.8" fill="#ef4444" />
              <circle cx="50" cy="12" r="0.8" fill="#ef4444" />
            </svg>
            
            {/* Key trading levels */}
            <div className="absolute top-2 left-2 bg-background/90 p-2 rounded-md border text-xs">
              <div className="font-medium mb-1">Key Levels</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex items-center">
                  <Circle className="h-2 w-2 mr-1 text-green-500 fill-green-500" />
                  <span>Support:</span>
                </div>
                <div>${(mockCurrentPrice * 0.95).toLocaleString()}</div>
                
                <div className="flex items-center">
                  <Circle className="h-2 w-2 mr-1 text-red-500 fill-red-500" />
                  <span>Resistance:</span>
                </div>
                <div>${(mockCurrentPrice * 1.05).toLocaleString()}</div>
                
                <div className="flex items-center">
                  <Circle className="h-2 w-2 mr-1 text-blue-500 fill-blue-500" />
                  <span>Current:</span>
                </div>
                <div>${mockCurrentPrice.toLocaleString()}</div>
              </div>
            </div>
            
            {/* Signals */}
            <div className="absolute top-2 right-2 bg-background/90 p-2 rounded-md border text-xs">
              <div className="font-medium mb-1">AI Signals</div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span>Buy Signal (75%)</span>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span>Sell Signal (25%)</span>
                </div>
              </div>
            </div>
            
            {/* Analytics */}
            <div className="absolute bottom-2 left-2 right-2 bg-background/90 p-2 rounded-md border text-xs flex justify-between">
              <div>
                <div className="font-medium">Price Action Analysis</div>
                <div className="text-muted-foreground mt-1">Bullish divergence detected on RSI indicator</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-500">Long Bias</div>
                <div className="text-muted-foreground mt-1">Target: ${(mockCurrentPrice * 1.08).toLocaleString()}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col">
            <LineChart className="h-10 w-10 mb-2" />
            <div>AI visualization paused. Start the bot to see real-time analysis.</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AiTradingVisualizer;
