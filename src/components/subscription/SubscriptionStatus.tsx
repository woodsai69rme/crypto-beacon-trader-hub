
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CreditCard, RefreshCw, Settings } from 'lucide-react';
import { format } from 'date-fns';

const SubscriptionStatus: React.FC = () => {
  const { user, subscription, checkSubscription } = useAuth();
  const { toast } = useToast();

  const handleRefreshStatus = async () => {
    await checkSubscription();
    toast({
      title: "Status Updated",
      description: "Subscription status has been refreshed",
    });
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Error",
        description: "Unable to open customer portal. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Please sign in to view your subscription</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isSubscribed = subscription?.subscribed || false;
  const tier = subscription?.subscription_tier || 'Free';
  const endDate = subscription?.subscription_end;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Manage your plan and billing</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefreshStatus}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Current Plan:</span>
          </div>
          <Badge variant={isSubscribed ? "default" : "secondary"}>
            {tier}
          </Badge>
        </div>

        {isSubscribed && endDate && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Next Billing:</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {format(new Date(endDate), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Status:</span>
          </div>
          <Badge variant={isSubscribed ? "default" : "outline"}>
            {isSubscribed ? 'Active' : 'Free Plan'}
          </Badge>
        </div>

        {isSubscribed && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleManageSubscription}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        )}

        {!isSubscribed && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              Upgrade to unlock premium features:
            </p>
            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Advanced AI trading models</li>
              <li>• 30+ cryptocurrency support</li>
              <li>• Custom trading strategies</li>
              <li>• Priority support</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
