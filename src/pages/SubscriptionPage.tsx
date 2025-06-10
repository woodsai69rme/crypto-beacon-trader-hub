
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for beginners',
      icon: Star,
      features: [
        'Paper trading',
        'Basic AI bots (2)',
        'Market data access',
        'Community features',
        'Basic analytics'
      ],
      limitations: [
        'Limited to $10,000 virtual portfolio',
        'Basic strategy templates only',
        'Standard support'
      ]
    },
    {
      name: 'Pro',
      price: '$29/month',
      description: 'For serious traders',
      icon: Zap,
      popular: true,
      features: [
        'Live trading integration',
        'Advanced AI bots (unlimited)',
        'Real-time market data',
        'Advanced analytics',
        'Custom strategies',
        'API access',
        'Priority support'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      price: '$99/month',
      description: 'For institutions',
      icon: Crown,
      features: [
        'Everything in Pro',
        'White-label solution',
        'Custom integrations',
        'Dedicated support',
        'Advanced risk management',
        'Multi-user management',
        'Custom AI model training'
      ],
      limitations: []
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Unlock the full potential of AI-powered crypto trading
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <Card key={index} className={`relative ${plan.popular ? 'border-2 border-primary' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-muted-foreground">Limitations:</h4>
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground">
                        • {limitation}
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.price === 'Free' ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Can I switch plans anytime?</h4>
            <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time.</p>
          </div>
          <div>
            <h4 className="font-semibold">Is there a free trial?</h4>
            <p className="text-muted-foreground">The Starter plan is completely free with no time limits.</p>
          </div>
          <div>
            <h4 className="font-semibold">What payment methods do you accept?</h4>
            <p className="text-muted-foreground">We accept all major credit cards and cryptocurrencies.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
