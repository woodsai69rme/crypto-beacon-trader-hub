
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  icon: React.ReactNode;
  stripePriceId?: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'AUD',
    interval: 'forever',
    description: 'Perfect for getting started with crypto trading education',
    icon: <Star className="h-6 w-6" />,
    features: [
      { name: 'Paper Trading (Basic)', included: true },
      { name: '5 Cryptocurrencies', included: true },
      { name: 'Basic AI Trading Bot', included: true },
      { name: 'Community Support', included: true },
      { name: 'Advanced Analytics', included: false },
      { name: 'Premium AI Models', included: false },
      { name: 'Unlimited Crypto Support', included: false },
      { name: 'Priority Support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    currency: 'AUD',
    interval: 'month',
    description: 'Ideal for serious traders and educators',
    icon: <Zap className="h-6 w-6" />,
    popular: true,
    stripePriceId: 'price_pro_monthly',
    features: [
      { name: 'Paper Trading (Advanced)', included: true },
      { name: '30+ Cryptocurrencies', included: true },
      { name: 'Multiple AI Trading Bots', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Premium AI Models (GPT-4, Claude)', included: true },
      { name: 'Custom Trading Strategies', included: true },
      { name: 'Email Support', included: true },
      { name: 'Data Export', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'AUD',
    interval: 'month',
    description: 'For institutions and professional traders',
    icon: <Crown className="h-6 w-6" />,
    stripePriceId: 'price_enterprise_monthly',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited Cryptocurrencies', included: true },
      { name: 'White-Label Options', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Advanced Reporting', included: true },
      { name: 'Multi-User Management', included: true },
    ],
  },
];

const SubscriptionPlans: React.FC = () => {
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive"
      });
      return;
    }

    if (plan.id === 'free') {
      toast({
        title: "Free Plan Active",
        description: "You're already on the free plan!",
      });
      return;
    }

    setLoading(plan.id);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId: plan.id, priceId: plan.stripePriceId }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "Unable to start subscription process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const getCurrentPlan = () => {
    if (!subscription || !subscription.subscribed) return 'free';
    return subscription.subscription_tier?.toLowerCase() || 'free';
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Trading Education Plan
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start your crypto trading journey with our comprehensive educational platform. 
          All plans include paper trading with virtual funds - no real money at risk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isPopular = plan.popular;

          return (
            <Card 
              key={plan.id} 
              className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              
              {isCurrentPlan && (
                <Badge className="absolute -top-3 right-4 bg-green-500">
                  Current Plan
                </Badge>
              )}

              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-primary">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                    /{plan.interval}
                  </span>
                </div>
                <CardDescription className="text-center">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check 
                        className={`h-4 w-4 mr-3 ${
                          feature.included 
                            ? 'text-green-500' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                      <span className={feature.included ? '' : 'text-gray-500 line-through'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? 'secondary' : isPopular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id || isCurrentPlan}
                >
                  {loading === plan.id ? (
                    'Processing...'
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Get Started Free'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          All plans include a 7-day free trial • Cancel anytime • No hidden fees
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Educational platform only - Not financial advice • Virtual trading with no real money at risk
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
