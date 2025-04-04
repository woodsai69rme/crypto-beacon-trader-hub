
import { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, TrendingUp } from "lucide-react";

interface RiskAssessmentProps {
  className?: string;
}

interface RiskMetric {
  name: string;
  value: number;
  description: string;
}

interface CoinRiskData {
  coin: string;
  symbol: string;
  volatility: number;
  marketCap: number;
  liquidity: number;
  sentiment: number;
  reputation: number;
  techRisk: number;
  riskScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Very High";
  riskColor: string;
}

const RiskAssessment = ({ className }: RiskAssessmentProps) => {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock risk data for different coins
  const riskData: Record<string, CoinRiskData> = {
    bitcoin: {
      coin: "Bitcoin",
      symbol: "BTC",
      volatility: 65,
      marketCap: 90,
      liquidity: 95,
      sentiment: 80,
      reputation: 90,
      techRisk: 30,
      riskScore: 25,
      riskLevel: "Low",
      riskColor: "#22c55e"
    },
    ethereum: {
      coin: "Ethereum",
      symbol: "ETH",
      volatility: 70,
      marketCap: 85,
      liquidity: 90,
      sentiment: 75,
      reputation: 85,
      techRisk: 40,
      riskScore: 35,
      riskLevel: "Moderate",
      riskColor: "#eab308"
    },
    solana: {
      coin: "Solana",
      symbol: "SOL",
      volatility: 80,
      marketCap: 70,
      liquidity: 75,
      sentiment: 70,
      reputation: 65,
      techRisk: 55,
      riskScore: 55,
      riskLevel: "Moderate",
      riskColor: "#eab308"
    },
    cardano: {
      coin: "Cardano",
      symbol: "ADA",
      volatility: 75,
      marketCap: 65,
      liquidity: 70,
      sentiment: 60,
      reputation: 75,
      techRisk: 45,
      riskScore: 45,
      riskLevel: "Moderate",
      riskColor: "#eab308"
    },
    ripple: {
      coin: "XRP",
      symbol: "XRP",
      volatility: 75,
      marketCap: 65,
      liquidity: 75,
      sentiment: 50,
      reputation: 60,
      techRisk: 65,
      riskScore: 60,
      riskLevel: "High",
      riskColor: "#ef4444"
    },
  };
  
  const currentCoin = riskData[selectedCoin] || riskData.bitcoin;
  
  // Format data for radar chart
  const radarData = [
    {
      subject: "Volatility",
      value: currentCoin.volatility,
      fullMark: 100,
    },
    {
      subject: "Market Cap",
      value: currentCoin.marketCap,
      fullMark: 100,
    },
    {
      subject: "Liquidity",
      value: currentCoin.liquidity,
      fullMark: 100,
    },
    {
      subject: "Sentiment",
      value: currentCoin.sentiment,
      fullMark: 100,
    },
    {
      subject: "Reputation",
      value: currentCoin.reputation,
      fullMark: 100,
    },
    {
      subject: "Tech Risk",
      value: currentCoin.techRisk,
      fullMark: 100,
    },
  ];
  
  // Risk metrics explanation
  const riskMetrics: RiskMetric[] = [
    {
      name: "Volatility",
      value: currentCoin.volatility,
      description: "Measures price fluctuation over time. Higher values indicate more price volatility."
    },
    {
      name: "Market Cap",
      value: currentCoin.marketCap,
      description: "The total market value of the cryptocurrency. Higher values indicate more stability."
    },
    {
      name: "Liquidity",
      value: currentCoin.liquidity,
      description: "Ease of buying/selling without significant price impact. Higher values indicate better liquidity."
    },
    {
      name: "Sentiment",
      value: currentCoin.sentiment,
      description: "Market perception based on social media and news. Higher values indicate positive sentiment."
    },
    {
      name: "Reputation",
      value: currentCoin.reputation,
      description: "The project's history and community trust. Higher values indicate better reputation."
    },
    {
      name: "Tech Risk",
      value: currentCoin.techRisk,
      description: "Potential technical vulnerabilities. Higher values indicate higher technical risk."
    }
  ];
  
  // Get risk score color
  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-green-500";
    if (score <= 50) return "text-yellow-500";
    if (score <= 70) return "text-orange-500";
    return "text-red-500";
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Risk Assessment
            </CardTitle>
            <CardDescription>Analyze risk factors for cryptocurrencies</CardDescription>
          </div>
          
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(riskData).map(coin => (
                <SelectItem key={coin} value={coin}>
                  {riskData[coin].coin} ({riskData[coin].symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <div className="text-lg font-semibold mb-1">Risk Score</div>
                  <div 
                    className={`text-4xl font-bold ${getRiskColor(currentCoin.riskScore)}`}
                    style={{ color: currentCoin.riskColor }}
                  >
                    {currentCoin.riskScore}/100
                  </div>
                  <div 
                    className="text-lg mt-1 px-3 py-0.5 rounded-full" 
                    style={{ 
                      backgroundColor: `${currentCoin.riskColor}20`,
                      color: currentCoin.riskColor
                    }}
                  >
                    {currentCoin.riskLevel} Risk
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    {currentCoin.riskLevel === "Low" && (
                      "This asset has a relatively low risk profile compared to other cryptocurrencies."
                    )}
                    {currentCoin.riskLevel === "Moderate" && (
                      "This asset has a moderate risk profile with some volatility expected."
                    )}
                    {currentCoin.riskLevel === "High" && (
                      "This asset has a high risk profile and may experience significant volatility."
                    )}
                    {currentCoin.riskLevel === "Very High" && (
                      "This asset has a very high risk profile and may experience extreme volatility."
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" fontSize={12} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444" />
                    <Radar
                      name={currentCoin.symbol}
                      dataKey="value"
                      stroke={currentCoin.riskColor}
                      fill={currentCoin.riskColor}
                      fillOpacity={0.5}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="p-4 border rounded-md bg-card">
              <h3 className="font-medium flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk Factors to Consider
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {currentCoin.coin}'s volatility is {currentCoin.volatility > 70 ? 'high' : 'moderate'}, typical of crypto assets</li>
                <li>• {currentCoin.reputation < 70 ? 'Relatively new project with evolving reputation' : 'Well-established project with strong reputation'}</li>
                <li>• {currentCoin.techRisk > 50 ? 'Has some technical risk factors to be aware of' : 'Lower technical risk compared to similar assets'}</li>
                <li>• Market sentiment is {currentCoin.sentiment > 70 ? 'currently positive' : 'mixed at this time'}</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              {riskMetrics.map((metric) => (
                <div key={metric.name} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{metric.name}</span>
                    <span 
                      className={
                        metric.name === "Tech Risk"
                          ? metric.value > 50 ? "text-red-500" : "text-green-500"
                          : metric.value > 50 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {metric.value}/100
                    </span>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${metric.value}%`,
                        backgroundColor: metric.name === "Tech Risk" 
                          ? (metric.value > 50 ? "#ef4444" : "#22c55e")
                          : (metric.value > 50 ? "#22c55e" : "#ef4444")
                      }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium flex items-center mb-3">
                <TrendingUp className="h-4 w-4 mr-2" />
                Volatility Analysis
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {currentCoin.coin} has shown {currentCoin.volatility > 70 ? 'high' : 'moderate'} volatility over the past 30 days. This level of price movement is 
                {currentCoin.volatility > 75 ? ' higher than' : currentCoin.volatility > 60 ? ' typical for' : ' lower than'} most crypto assets.
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Low Volatility</span>
                <span>High Volatility</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5 mt-1">
                <div 
                  className="h-2.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                  style={{ width: `${currentCoin.volatility}%` }}
                >
                  <div 
                    className="h-4 w-4 rounded-full bg-foreground absolute"
                    style={{ 
                      marginTop: "-3px",
                      marginLeft: `calc(${currentCoin.volatility}% - 8px)`
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-3">Portfolio Recommendation</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Based on your risk assessment, we recommend {currentCoin.coin} to make up:
                </p>
                <div className="flex items-center justify-center">
                  <div 
                    className="text-2xl font-bold px-4 py-2 rounded-md"
                    style={{ 
                      backgroundColor: `${currentCoin.riskColor}20`,
                      color: currentCoin.riskColor
                    }}
                  >
                    {currentCoin.riskLevel === "Low" ? "Up to 25%" : 
                     currentCoin.riskLevel === "Moderate" ? "5-15%" :
                     currentCoin.riskLevel === "High" ? "1-5%" : "< 1%"}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  of your total crypto portfolio allocation.
                </p>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Risk Mitigation Strategies</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Consider dollar-cost averaging instead of lump-sum investing</li>
                <li>• Set stop-loss orders at {currentCoin.riskLevel === "Low" ? "10-15%" : 
                                               currentCoin.riskLevel === "Moderate" ? "15-20%" :
                                               "20-30%"} below purchase price</li>
                <li>• Diversify across multiple crypto assets to reduce overall portfolio risk</li>
                <li>• Monitor market sentiment indicators for early warning signals</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
