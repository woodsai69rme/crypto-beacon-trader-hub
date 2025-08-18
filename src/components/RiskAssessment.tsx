
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Zap
} from 'lucide-react';
import { RiskAssessmentResult, PortfolioAsset } from '@/types/trading';

interface RiskAssessmentProps {
  portfolioAssets?: PortfolioAsset[];
  onRecommendationApply?: (recommendation: string) => void;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ 
  portfolioAssets = [], 
  onRecommendationApply 
}) => {
  const [riskData, setRiskData] = useState<RiskAssessmentResult>({
    score: 75,
    overallScore: 75,
    diversificationScore: 65,
    volatilityScore: 80,
    liquidityScore: 85,
    concentrationRisk: 45,
    correlationRisk: 60,
    riskByAsset: [],
    factors: [
      {
        name: 'Portfolio Diversification',
        weight: 0.3,
        score: 65,
        description: 'Asset allocation spread across different sectors'
      },
      {
        name: 'Volatility Exposure',
        weight: 0.25,
        score: 80,
        description: 'Overall portfolio volatility relative to market'
      }
    ],
    recommendations: [
      'Consider diversifying into more stable assets',
      'Reduce concentration in high-risk altcoins',
      'Add some defensive positions during market uncertainty'
    ],
    riskLevel: 'Medium'
  });

  const [isLoading, setIsLoading] = useState(false);

  const performRiskAssessment = async () => {
    setIsLoading(true);
    
    // Simulate risk assessment calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRiskData: RiskAssessmentResult = {
      score: Math.floor(Math.random() * 40) + 50,
      overallScore: Math.floor(Math.random() * 40) + 50,
      diversificationScore: Math.floor(Math.random() * 40) + 40,
      volatilityScore: Math.floor(Math.random() * 30) + 60,
      liquidityScore: Math.floor(Math.random() * 20) + 70,
      concentrationRisk: Math.floor(Math.random() * 50) + 20,
      correlationRisk: Math.floor(Math.random() * 40) + 30,
      riskByAsset: portfolioAssets.map(asset => ({
        symbol: asset.symbol,
        score: Math.floor(Math.random() * 40) + 40,
        factors: [
          {
            name: 'Volatility',
            weight: 0.4,
            score: Math.floor(Math.random() * 30) + 50,
            description: `${asset.symbol} price volatility assessment`
          },
          {
            name: 'Liquidity',
            weight: 0.3,
            score: Math.floor(Math.random() * 20) + 70,
            description: `${asset.symbol} market liquidity`
          }
        ]
      })),
      factors: [
        {
          name: 'Portfolio Diversification',
          weight: 0.3,
          score: Math.floor(Math.random() * 40) + 40,
          description: 'Asset allocation spread across different sectors'
        },
        {
          name: 'Volatility Exposure',
          weight: 0.25,
          score: Math.floor(Math.random() * 30) + 60,
          description: 'Overall portfolio volatility relative to market'
        },
        {
          name: 'Liquidity Risk',
          weight: 0.2,
          score: Math.floor(Math.random() * 20) + 70,
          description: 'Ability to quickly exit positions'
        },
        {
          name: 'Concentration Risk',
          weight: 0.15,
          score: Math.floor(Math.random() * 50) + 30,
          description: 'Risk from over-concentration in single assets'
        },
        {
          name: 'Correlation Risk',
          weight: 0.1,
          score: Math.floor(Math.random() * 40) + 40,
          description: 'Risk from high asset correlation'
        }
      ],
      recommendations: [
        'Consider diversifying into more stable assets',
        'Reduce concentration in high-risk altcoins',
        'Add some defensive positions during market uncertainty',
        'Consider implementing stop-loss orders',
        'Review position sizes relative to portfolio'
      ],
      riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
    };

    setRiskData(newRiskData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (portfolioAssets.length > 0) {
      performRiskAssessment();
    }
  }, [portfolioAssets]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low':
        return <ShieldCheck className="h-5 w-5 text-green-600" />;
      case 'Medium':
        return <Shield className="h-5 w-5 text-yellow-600" />;
      case 'High':
      case 'Very High':
        return <ShieldAlert className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Portfolio Risk Assessment
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your portfolio's risk profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Risk Score</span>
                <div className="flex items-center gap-2">
                  {getRiskIcon(riskData.riskLevel)}
                  <span className={`font-bold ${getRiskColor(riskData.overallScore)}`}>
                    {riskData.overallScore}/100
                  </span>
                </div>
              </div>
              <Progress 
                value={riskData.overallScore} 
                className={`h-3 ${getRiskColor(riskData.overallScore)}`}
              />
              <Badge variant={riskData.riskLevel === 'Low' ? 'secondary' : 
                           riskData.riskLevel === 'Medium' ? 'default' : 'destructive'}>
                {riskData.riskLevel} Risk
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Diversification</span>
                <span className={`font-medium ${getRiskColor(riskData.diversificationScore)}`}>
                  {riskData.diversificationScore}/100
                </span>
              </div>
              <Progress value={riskData.diversificationScore} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Volatility Control</span>
                <span className={`font-medium ${getRiskColor(riskData.volatilityScore)}`}>
                  {riskData.volatilityScore}/100
                </span>
              </div>
              <Progress value={riskData.volatilityScore} className="h-2" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Liquidity</span>
                <span className={`font-medium ${getRiskColor(riskData.liquidityScore)}`}>
                  {riskData.liquidityScore}/100
                </span>
              </div>
              <Progress value={riskData.liquidityScore} className="h-2" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Concentration Risk</span>
                <span className={`font-medium ${getRiskColor(100 - riskData.concentrationRisk)}`}>
                  {riskData.concentrationRisk}%
                </span>
              </div>
              <Progress value={riskData.concentrationRisk} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Correlation Risk</span>
                <span className={`font-medium ${getRiskColor(100 - riskData.correlationRisk)}`}>
                  {riskData.correlationRisk}%
                </span>
              </div>
              <Progress value={riskData.correlationRisk} className="h-2" />
            </div>
          </div>

          {riskData.riskByAsset && riskData.riskByAsset.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Risk by Asset</h4>
              <div className="space-y-3">
                {riskData.riskByAsset.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{asset.symbol}</span>
                      <div className="text-sm text-muted-foreground">
                        {asset.factors.map((factor, index) => (
                          <div key={index}>
                            {factor.name}: {factor.description}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Badge variant={asset.score >= 70 ? 'secondary' : 
                                  asset.score >= 50 ? 'default' : 'destructive'}>
                      {asset.score}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button 
              onClick={performRiskAssessment} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 animate-spin" />
                  Analyzing Risk...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Refresh Risk Assessment
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskData.recommendations.map((recommendation, index) => (
              <Alert key={index}>
                <AlertDescription className="flex items-center justify-between">
                  <span>{recommendation}</span>
                  {onRecommendationApply && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onRecommendationApply(recommendation)}
                    >
                      Apply
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
