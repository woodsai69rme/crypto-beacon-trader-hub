
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building } from 'lucide-react';

const SubscriptionPlans: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for beginners',
      icon: Zap,
      features: [
        'Paper trading with $10,000 AUD virtual balance',
        'Basic AI trading bot (1 bot)',
        'Real-time market data',
        'Basic analytics dashboard',
        'Community access',
        'Email support'
      ],
      limitations: [
        'No live trading',
        'Limited AI models',
        'Basic technical indicators'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'secondary' as const,
      popular: false
    },
    {
      name: 'Premium',
      price: 29,
      description: 'For serious traders',
      icon: Crown,
      features: [
        'Everything in Free',
        'Live trading with real exchanges',
        'Advanced AI trading bots (5 bots)',
        'Premium AI models (GPT-4, Claude)',
        'Advanced analytics & risk management',
        'Social trading & copy trading',
        'News sentiment analysis',
        'Priority support'
      ],
      limitations: [
        'Limited to 5 exchanges',
        'Basic Web3 features'
      ],
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      description: 'For institutions and professionals',
      icon: Building,
      features: [
        'Everything in Premium',
        'Unlimited AI trading bots',
        'All AI models + custom models',
        'Advanced Web3 & DeFi integration',
        'Portfolio management tools',
        'API access',
        'White-label options',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Unlock the full power of AI-driven cryptocurrency trading
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                  disabled={plan.name === 'Free'}
                >
                  {plan.buttonText}
                </Button>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Included Features</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-muted-foreground">Limitations</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-4 h-4 mt-0.5 text-center">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
            <h4 className="font-semibold">Can I change plans anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Is there a free trial for premium plans?</h4>
            <p className="text-sm text-muted-foreground">
              We offer a 14-day free trial for Premium plans. No credit card required.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards, PayPal, and cryptocurrency payments.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">How secure is live trading?</h4>
            <p className="text-sm text-muted-foreground">
              All API keys are encrypted and stored securely. We never have access to your exchange funds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
