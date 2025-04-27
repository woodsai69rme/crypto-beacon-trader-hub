
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, AlertTriangle, Info, Shield, ChevronRight, Download } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Risk profile questionnaire
const RISK_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is your investment time horizon?',
    options: [
      { value: '1', label: 'Less than 1 year', riskScore: 1 },
      { value: '2', label: '1-3 years', riskScore: 2 },
      { value: '3', label: '3-5 years', riskScore: 3 },
      { value: '4', label: '5-10 years', riskScore: 4 },
      { value: '5', label: 'More than 10 years', riskScore: 5 }
    ],
  },
  {
    id: 'q2',
    question: 'How would you react if your portfolio dropped 30% in a month?',
    options: [
      { value: '1', label: 'Sell everything immediately', riskScore: 1 },
      { value: '2', label: 'Sell some assets to reduce risk', riskScore: 2 },
      { value: '3', label: 'Do nothing and wait', riskScore: 3 },
      { value: '4', label: 'Buy a little more if I have cash', riskScore: 4 },
      { value: '5', label: 'Buy significantly more to average down', riskScore: 5 }
    ],
  },
  {
    id: 'q3',
    question: 'What percentage of your total investable assets are in crypto?',
    options: [
      { value: '1', label: 'Less than 5%', riskScore: 5 },
      { value: '2', label: '5-15%', riskScore: 4 },
      { value: '3', label: '15-30%', riskScore: 3 },
      { value: '4', label: '30-50%', riskScore: 2 },
      { value: '5', label: 'More than 50%', riskScore: 1 }
    ],
  },
  {
    id: 'q4',
    question: 'What is your primary investment goal?',
    options: [
      { value: '1', label: 'Preserve capital and minimize risk', riskScore: 1 },
      { value: '2', label: 'Generate income with low risk', riskScore: 2 },
      { value: '3', label: 'Balanced growth and income', riskScore: 3 },
      { value: '4', label: 'Growth with moderate risk', riskScore: 4 },
      { value: '5', label: 'Maximum growth with high risk', riskScore: 5 }
    ],
  },
  {
    id: 'q5',
    question: 'How experienced are you with crypto investing?',
    options: [
      { value: '1', label: 'Complete beginner', riskScore: 1 },
      { value: '2', label: 'Some basic knowledge', riskScore: 2 },
      { value: '3', label: 'Moderate experience', riskScore: 3 },
      { value: '4', label: 'Experienced investor', riskScore: 4 },
      { value: '5', label: 'Professional/expert', riskScore: 5 }
    ],
  }
];

// Risk profiles
const RISK_PROFILES = [
  {
    name: 'Conservative',
    range: [5, 12],
    description: 'Focus on capital preservation with minimal exposure to volatility.',
    allocation: {
      'Bitcoin': 15,
      'Ethereum': 10,
      'Stablecoins': 60,
      'Blue-chip alts': 10,
      'DeFi & others': 5
    },
    expectedReturn: '5-10%',
    volatility: 'Low',
    maxDrawdown: '10-15%'
  },
  {
    name: 'Moderate',
    range: [13, 17],
    description: 'Balance between growth and stability with controlled risk.',
    allocation: {
      'Bitcoin': 30,
      'Ethereum': 25,
      'Stablecoins': 25,
      'Blue-chip alts': 15,
      'DeFi & others': 5
    },
    expectedReturn: '10-20%',
    volatility: 'Medium',
    maxDrawdown: '25-35%'
  },
  {
    name: 'Growth',
    range: [18, 21],
    description: 'Focus on long-term appreciation with tolerance for significant volatility.',
    allocation: {
      'Bitcoin': 40,
      'Ethereum': 30,
      'Stablecoins': 5,
      'Blue-chip alts': 15,
      'DeFi & others': 10
    },
    expectedReturn: '20-40%',
    volatility: 'High',
    maxDrawdown: '40-55%'
  },
  {
    name: 'Aggressive',
    range: [22, 25],
    description: 'Maximize growth potential with acceptance of maximum volatility.',
    allocation: {
      'Bitcoin': 35,
      'Ethereum': 30,
      'Stablecoins': 0,
      'Blue-chip alts': 20,
      'DeFi & others': 15
    },
    expectedReturn: '>40%',
    volatility: 'Very high',
    maxDrawdown: '>60%'
  }
];

// Allocation colors for charts
const ALLOCATION_COLORS = {
  'Bitcoin': '#F7931A',
  'Ethereum': '#627EEA',
  'Stablecoins': '#26A17B',
  'Blue-chip alts': '#0033AD',
  'DeFi & others': '#8A2BE2'
};

// Chart labels
const ALLOCATION_LABELS = Object.keys(ALLOCATION_COLORS);

const RiskAssessmentAnalyzer = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [riskScore, setRiskScore] = useState<number>(0);
  const [riskProfile, setRiskProfile] = useState<any>(null);
  const [showRiskSettings, setShowRiskSettings] = useState<boolean>(false);
  const [customRiskLevel, setCustomRiskLevel] = useState<number[]>([50]);
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Calculate risk score from answers
  const calculateRiskScore = () => {
    let score = 0;
    Object.keys(answers).forEach(qId => {
      const question = RISK_QUESTIONS.find(q => q.id === qId);
      if (question) {
        const answer = question.options.find(opt => opt.value === answers[qId]);
        if (answer) {
          score += answer.riskScore;
        }
      }
    });
    return score;
  };

  // Determine risk profile based on score
  const determineRiskProfile = (score: number) => {
    return RISK_PROFILES.find(profile => 
      score >= profile.range[0] && score <= profile.range[1]
    );
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle form submission
  const handleSubmitQuestionnaire = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < RISK_QUESTIONS.length) {
      toast({
        title: "Incomplete questionnaire",
        description: "Please answer all questions to get your risk assessment.",
        variant: "destructive"
      });
      return;
    }

    const score = calculateRiskScore();
    setRiskScore(score);
    
    const profile = determineRiskProfile(score);
    setRiskProfile(profile);
    
    setCurrentStep(2);
    
    toast({
      title: "Risk assessment completed",
      description: `Your risk profile: ${profile?.name || 'Custom'}`,
    });
  };

  // Handle risk adjustment
  const handleCustomRiskAdjust = (value: number[]) => {
    setCustomRiskLevel(value);
    
    // Map slider value (0-100) to risk score (5-25)
    const mappedScore = Math.floor(5 + (value[0] / 100) * 20);
    setRiskScore(mappedScore);
    
    const profile = determineRiskProfile(mappedScore);
    setRiskProfile(profile);
  };

  // Reset assessment
  const handleReset = () => {
    setCurrentStep(1);
    setAnswers({});
    setRiskScore(0);
    setRiskProfile(null);
    setCustomRiskLevel([50]);
    setActiveTab("profile");
  };

  // Calculate completion percentage
  const completionPercentage = (Object.keys(answers).length / RISK_QUESTIONS.length) * 100;

  // Get normalized risk percentage (0-100) from risk score (5-25)
  const normalizedRiskPercentage = ((riskScore - 5) / 20) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Risk Assessment
        </CardTitle>
        <CardDescription>
          Analyze your risk tolerance and optimize your crypto portfolio
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentStep === 1 ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">Questionnaire completion</div>
                <div className="text-sm font-medium">
                  {Math.round(completionPercentage)}%
                </div>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="space-y-6">
              {RISK_QUESTIONS.map((question, idx) => (
                <div key={question.id} className="pb-4 border-b">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium mr-2">
                      {idx + 1}
                    </div>
                    <h3 className="font-medium">{question.question}</h3>
                  </div>
                  
                  <RadioGroup 
                    value={answers[question.id] || ""} 
                    onValueChange={(value) => handleAnswerSelect(question.id, value)}
                    className="ml-8 mt-3 space-y-2"
                  >
                    {question.options.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Risk Score Display */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Your Risk Profile</h3>
                <div className="flex items-center">
                  <Switch
                    checked={showRiskSettings}
                    onCheckedChange={setShowRiskSettings}
                    className="mr-2"
                  />
                  <Label>Adjust Risk</Label>
                </div>
              </div>
              
              {showRiskSettings && (
                <div className="p-4 border rounded-md mb-4">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Conservative</span>
                      <span className="text-sm">Aggressive</span>
                    </div>
                    <Slider
                      value={customRiskLevel}
                      onValueChange={handleCustomRiskAdjust}
                      max={100}
                      step={1}
                      className="mb-1"
                    />
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Lower risk & return</span>
                      <span className="text-xs text-muted-foreground">Higher risk & return</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Adjusting your risk level will modify the recommended portfolio allocation.
                      This may override your questionnaire results.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md flex flex-col items-center justify-center text-center">
                  <h4 className="mb-1 text-lg font-bold">{riskProfile?.name}</h4>
                  <div className="text-sm text-muted-foreground mb-3">Risk Score: {riskScore}/25</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        normalizedRiskPercentage >= 75 ? 'bg-red-500' : 
                        normalizedRiskPercentage >= 50 ? 'bg-amber-500' : 
                        normalizedRiskPercentage >= 25 ? 'bg-blue-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${normalizedRiskPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {riskProfile?.description}
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="mb-3 font-medium">Expected Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Annual Return (est.)</span>
                      <span className="font-medium">{riskProfile?.expectedReturn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <span className="font-medium">{riskProfile?.volatility}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Potential Drawdown</span>
                      <span className="font-medium">{riskProfile?.maxDrawdown}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="mb-3 font-medium">Portfolio Allocation</h4>
                  <div className="space-y-2">
                    {riskProfile && Object.entries(riskProfile.allocation).map(([asset, percentage]: [string, any]) => (
                      <div key={asset} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: ALLOCATION_COLORS[asset as keyof typeof ALLOCATION_COLORS] }}
                        />
                        <span className="text-sm flex-1">{asset}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs for detailed recommendations */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      About Your Risk Profile
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {riskProfile?.name} investors {riskProfile?.name === "Conservative" && "prioritize capital preservation and are uncomfortable with large fluctuations in portfolio value. They prefer stable, reliable returns over high growth potential."}
                      {riskProfile?.name === "Moderate" && "seek a balance between growth and stability. They can tolerate some market volatility for the potential of higher long-term returns."}
                      {riskProfile?.name === "Growth" && "are focused on long-term capital appreciation and are willing to accept significant short-term volatility. They have a longer time horizon and higher risk tolerance."}
                      {riskProfile?.name === "Aggressive" && "aim to maximize returns and are comfortable with extreme market volatility. They have a high risk tolerance and a long-term investment perspective."}
                    </p>
                    
                    <h5 className="font-medium mb-2">Characteristics:</h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {riskProfile?.name === "Conservative" && (
                        <>
                          <li>Focus on protecting capital</li>
                          <li>Shorter investment time horizon</li>
                          <li>Lower tolerance for portfolio fluctuations</li>
                          <li>Preference for established cryptocurrencies</li>
                          <li>High allocation to stablecoins</li>
                        </>
                      )}
                      {riskProfile?.name === "Moderate" && (
                        <>
                          <li>Balance between growth and capital preservation</li>
                          <li>Medium-term investment horizon</li>
                          <li>Can tolerate moderate volatility</li>
                          <li>Mix of established cryptocurrencies and some alts</li>
                          <li>Moderate stablecoin allocation for stability</li>
                        </>
                      )}
                      {riskProfile?.name === "Growth" && (
                        <>
                          <li>Focus on capital appreciation</li>
                          <li>Longer investment time horizon</li>
                          <li>High tolerance for market volatility</li>
                          <li>Diversified across major cryptos and established alts</li>
                          <li>Small allocation to stablecoins</li>
                        </>
                      )}
                      {riskProfile?.name === "Aggressive" && (
                        <>
                          <li>Maximum growth potential</li>
                          <li>Very long investment time horizon</li>
                          <li>Very high tolerance for extreme volatility</li>
                          <li>Wider exposure to alternative cryptocurrencies</li>
                          <li>May include exposure to newer protocols and tokens</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3">Typical Investment Strategy</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-1">Portfolio Structure</h5>
                        <p className="text-sm text-muted-foreground">
                          {riskProfile?.name === "Conservative" && "Heavily weighted toward stablecoins (60%) with limited exposure to volatile assets. Focus on Bitcoin and Ethereum with minimal altcoin exposure."}
                          {riskProfile?.name === "Moderate" && "Balanced exposure across major cryptocurrencies and stablecoins. Still focuses on established assets with moderate diversification into blue-chip alternatives."}
                          {riskProfile?.name === "Growth" && "Dominated by Bitcoin and Ethereum (70%) with meaningful exposure to established altcoins. Minimal stablecoin allocation, prioritizing growth assets."}
                          {riskProfile?.name === "Aggressive" && "Focused entirely on growth assets with zero stablecoin allocation. Higher allocation to alternative cryptocurrencies and emerging sectors."}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-1">Investment Approach</h5>
                        <p className="text-sm text-muted-foreground">
                          {riskProfile?.name === "Conservative" && "Dollar-cost averaging with longer intervals. Primary focus on accumulation during major market downturns with minimal trading."}
                          {riskProfile?.name === "Moderate" && "Regular dollar-cost averaging combined with occasional rebalancing. More active during significant market movements."}
                          {riskProfile?.name === "Growth" && "Strategic dollar-cost averaging with tactical adjustments based on market conditions. More frequent rebalancing of portfolio allocations."}
                          {riskProfile?.name === "Aggressive" && "Combination of core holdings and tactical positioning. May include shorter-term positions based on market opportunities."}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-1">Risk Management</h5>
                        <p className="text-sm text-muted-foreground">
                          {riskProfile?.name === "Conservative" && "Strict stop losses, high stablecoin reserves, and immediate risk reduction during increased market volatility."}
                          {riskProfile?.name === "Moderate" && "Moderate stop losses with partial risk reduction during market downturns. May gradually increase positions during extended downtrends."}
                          {riskProfile?.name === "Growth" && "Wider stop losses with incremental buying during market corrections. Uses market volatility as opportunity to enhance positions."}
                          {riskProfile?.name === "Aggressive" && "Limited use of stop losses, focusing instead on fundamental conviction. Views significant drawdowns as major buying opportunities."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Important Considerations
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-3">
                      <li>Risk assessment is a guideline, not financial advice</li>
                      <li>Cryptocurrency markets are highly volatile by nature</li>
                      <li>Past performance does not guarantee future results</li>
                      <li>Consider consulting a financial advisor before making investment decisions</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3">Tailored Recommendations</h4>
                    <div className="space-y-3">
                      {/* Diversification recommendation */}
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium">Diversification Strategy</h5>
                          <p className="text-sm text-muted-foreground">
                            {riskProfile?.name === "Conservative" && "Maintain at least 50-60% in stablecoins for capital preservation. Limit exposure to altcoins and focus on established assets like Bitcoin and Ethereum."}
                            {riskProfile?.name === "Moderate" && "Balance your portfolio with 25-30% stablecoins. Allocate the majority to Bitcoin and Ethereum, with selective exposure to established altcoins."}
                            {riskProfile?.name === "Growth" && "Maintain a small stablecoin reserve (5-10%) for buying opportunities. Focus primarily on Bitcoin and Ethereum, with strategic allocation to blue-chip altcoins."}
                            {riskProfile?.name === "Aggressive" && "Diversify across high-conviction cryptoassets with a core allocation to Bitcoin and Ethereum. Consider selective exposure to emerging protocols with strong fundamentals."}
                          </p>
                        </div>
                      </div>
                      
                      {/* Investment strategy recommendation */}
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium">Investment Strategy</h5>
                          <p className="text-sm text-muted-foreground">
                            {riskProfile?.name === "Conservative" && "Use a dollar-cost averaging approach with monthly or quarterly purchases. Focus on accumulation during major market downturns when risk/reward is more favorable."}
                            {riskProfile?.name === "Moderate" && "Implement a consistent dollar-cost averaging strategy with bi-weekly or monthly purchases. Consider increasing investment during moderate market corrections."}
                            {riskProfile?.name === "Growth" && "Maintain a core dollar-cost averaging strategy while allocating additional capital during significant market corrections. Review and rebalance quarterly."}
                            {riskProfile?.name === "Aggressive" && "Combine strategic long-term holdings with tactical allocations. Consider increasing investment frequency and taking advantage of short-term market inefficiencies."}
                          </p>
                        </div>
                      </div>
                      
                      {/* Risk management recommendation */}
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium">Risk Management</h5>
                          <p className="text-sm text-muted-foreground">
                            {riskProfile?.name === "Conservative" && "Set strict stop-losses at 10-15% for non-stablecoin assets. Consider taking partial profits when assets experience significant appreciation."}
                            {riskProfile?.name === "Moderate" && "Implement moderate stop-losses at 20-25% for volatile assets. Rebalance when individual assets exceed their target allocation by 20%."}
                            {riskProfile?.name === "Growth" && "Use wider stop-losses of 30-40% for core holdings. Consider taking partial profits after significant runs, reinvesting during corrections."}
                            {riskProfile?.name === "Aggressive" && "Focus on fundamental conviction rather than strict stop-losses. Use significant market drawdowns as opportunities to enhance positions in high-conviction assets."}
                          </p>
                        </div>
                      </div>
                      
                      {/* Monitoring recommendation */}
                      <div className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium">Portfolio Monitoring</h5>
                          <p className="text-sm text-muted-foreground">
                            {riskProfile?.name === "Conservative" && "Review your portfolio weekly and rebalance monthly or quarterly. Set alerts for unusual market volatility to manage risk proactively."}
                            {riskProfile?.name === "Moderate" && "Review your portfolio bi-weekly and rebalance quarterly. Adjust allocations when market conditions change significantly."}
                            {riskProfile?.name === "Growth" && "Monitor your portfolio weekly with quarterly rebalancing. Stay informed about market developments that may affect your long-term holdings."}
                            {riskProfile?.name === "Aggressive" && "Maintain active awareness of market conditions while focusing on long-term conviction. Consider quarterly portfolio reviews and annual strategic reassessments."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="education">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3">Key Investment Concepts</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-1">Risk vs. Return</h5>
                        <p className="text-sm text-muted-foreground">
                          Higher potential returns generally come with higher risk. Understanding this relationship is fundamental to building a portfolio aligned with your financial goals and risk tolerance.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-1">Diversification</h5>
                        <p className="text-sm text-muted-foreground">
                          Spreading investments across different assets to reduce risk. While diversification doesn't eliminate risk, it can help reduce the impact of volatility on your overall portfolio.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-1">Dollar-Cost Averaging (DCA)</h5>
                        <p className="text-sm text-muted-foreground">
                          Investing a fixed amount at regular intervals, regardless of price. This strategy reduces the impact of volatility and eliminates the need to time the market.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium mb-1">Market Cycles</h5>
                        <p className="text-sm text-muted-foreground">
                          Cryptocurrency markets move in cycles of expansion and contraction. Understanding where we are in the cycle can help inform investment decisions and manage expectations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-3">Educational Resources</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Crypto Investment Fundamentals</h5>
                          <p className="text-xs text-muted-foreground">Beginner's guide to cryptocurrency investing</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Risk Management Strategies</h5>
                          <p className="text-xs text-muted-foreground">Techniques to protect your portfolio</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Portfolio Construction</h5>
                          <p className="text-xs text-muted-foreground">Building a balanced crypto portfolio</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Market Analysis Fundamentals</h5>
                          <p className="text-xs text-muted-foreground">Understanding technical and fundamental analysis</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`${currentStep === 2 ? 'justify-between' : 'justify-end'}`}>
        {currentStep === 2 && (
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
        )}
        
        {currentStep === 1 ? (
          <Button onClick={handleSubmitQuestionnaire}>
            Complete Assessment
          </Button>
        ) : (
          <Button onClick={() => toast({
            title: "Report Downloaded",
            description: "Your risk assessment report has been downloaded.",
          })}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RiskAssessmentAnalyzer;
