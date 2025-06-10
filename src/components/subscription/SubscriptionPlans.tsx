
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'month' | 'year';
  icon: React.ReactNode;
  popular?: boolean;
  features: PlanFeature[];
}

const SubscriptionPlans: React.FC = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      billingPeriod: 'month',
      icon: <Star className="h-6 w-6" />,
      features: [
        { name: 'Paper Trading', included: true },
        { name: 'Basic AI Models (3/day)', included: true },
        { name: 'Market Data Access', included: true },
        { name: 'Portfolio Tracking', included: true },
        { name: 'Live Trading', included: false },
        { name: 'Advanced AI Models', included: false },
        { name: 'Priority Support', included: false },
        { name: 'Copy Trading', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious traders',
      price: 29,
      billingPeriod: 'month',
      icon: <Zap className="h-6 w-6" />,
      popular: true,
      features: [
        { name: 'Paper Trading', included: true },
        { name: 'Unlimited AI Models', included: true },
        { name: 'Live Trading', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Multi-Exchange Support', included: true },
        { name: 'Real-time Alerts', included: true },
        { name: 'Priority Support', included: false },
        { name: 'Copy Trading', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Professional trading suite',
      price: 99,
      billingPeriod: 'month',
      icon: <Crown className="h-6 w-6" />,
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Copy Trading', included: true },
        { name: 'Social Trading Features', included: true },
        { name: 'Advanced Order Types', included: true },
        { name: 'Custom Strategies', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Tax Reporting', included: true },
        { name: 'API Access', included: true }
      ]
    }
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      toast({
        title: 'Free Plan Activated',
        description: 'You can start using the free features immediately.',
      });
    } else {
      toast({
        title: 'Subscription Coming Soon',
        description: 'Payment processing will be available soon.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Choose Your Trading Plan</h1>
        <p className="text-muted-foreground text-lg">
          Unlock advanced trading features and AI-powered strategies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden ${
              plan.popular 
                ? 'border-primary shadow-lg scale-105' 
                : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  plan.popular 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {plan.icon}
                </div>
              </div>
              
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-muted-foreground">{plan.description}</p>
              
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/{plan.billingPeriod}</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                      feature.included 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {feature.included ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">×</span>
                      )}
                    </div>
                    <span className={feature.included ? '' : 'text-muted-foreground'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full mt-6 ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary/90' 
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                disabled={selectedPlan === plan.id}
              >
                {selectedPlan === plan.id 
                  ? 'Processing...' 
                  : plan.price === 0 
                    ? 'Get Started' 
                    : 'Subscribe'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Feature</th>
                  <th className="text-center py-3">Free</th>
                  <th className="text-center py-3">Pro</th>
                  <th className="text-center py-3">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">AI Trading Bots</td>
                  <td className="text-center">3/day</td>
                  <td className="text-center">Unlimited</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Exchange Connections</td>
                  <td className="text-center">1</td>
                  <td className="text-center">5</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">API Calls/Month</td>
                  <td className="text-center">1,000</td>
                  <td className="text-center">50,000</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Support Response</td>
                  <td className="text-center">Community</td>
                  <td className="text-center">24-48h</td>
                  <td className="text-center">Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Can I change plans anytime?</h4>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Is there a free trial for paid plans?</h4>
            <p className="text-muted-foreground text-sm">
              All paid plans come with a 7-day free trial. No credit card required.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
            <p className="text-muted-foreground text-sm">
              We accept all major credit cards, PayPal, and cryptocurrency payments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
