
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      icon: Star,
      features: [
        "Basic portfolio tracking",
        "Real-time prices",
        "3 AI trading strategies",
        "Community access",
        "Email support"
      ],
      limitations: [
        "Limited to $10,000 portfolio value",
        "5 trades per day",
        "Basic analytics only"
      ]
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      icon: Zap,
      popular: true,
      features: [
        "Everything in Free",
        "13+ AI trading strategies",
        "Advanced analytics",
        "Unlimited trades",
        "Priority support",
        "Copy trading",
        "Tax reporting",
        "API access"
      ],
      limitations: []
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "month",
      icon: Crown,
      features: [
        "Everything in Pro",
        "White-label options",
        "Custom AI strategies",
        "Dedicated support",
        "Advanced risk management",
        "Multi-user accounts",
        "Custom integrations",
        "Priority execution"
      ],
      limitations: []
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Unlock the full potential of AI-powered crypto trading
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <plan.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              {plan.limitations.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Limitations:</p>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-300" />
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                {plan.name === "Free" ? "Current Plan" : "Upgrade Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployment & Monetization Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ready to Deploy</h3>
              <ul className="space-y-2 text-sm">
                <li>• Complete platform with all features functional</li>
                <li>• Real-time data integration (AUD default)</li>
                <li>• 13+ AI trading strategies implemented</li>
                <li>• Mobile-responsive design</li>
                <li>• Production-ready codebase</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Revenue Streams</h3>
              <ul className="space-y-2 text-sm">
                <li>• Subscription plans ($29-$199/month)</li>
                <li>• Trading fee commissions (0.1-0.25%)</li>
                <li>• White-label licensing ($15K+ setup)</li>
                <li>• API access fees ($499/month)</li>
                <li>• Strategy marketplace commissions (30%)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-800">Estimated Monthly Revenue Potential</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
              <div>
                <p className="font-medium">Year 1: $35K-$85K/month</p>
                <p className="text-blue-600">1,500-3,000 users</p>
              </div>
              <div>
                <p className="font-medium">Year 2: $150K-$350K/month</p>
                <p className="text-blue-600">6,000-12,000 users</p>
              </div>
              <div>
                <p className="font-medium">Year 3: $500K-$1.2M/month</p>
                <p className="text-blue-600">18,000-35,000 users</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
