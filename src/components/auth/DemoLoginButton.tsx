
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DemoLoginButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Create or sign in demo user
      const demoEmail = 'demo@cryptobeacon.com';
      const demoPassword = 'demo123456';

      // First try to sign in
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      // If sign in fails, create the demo user
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: 'Demo User',
              demo_account: true
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        // Try signing in again after signup
        const { error: secondSignInError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });

        if (secondSignInError) {
          throw secondSignInError;
        }
      }

      toast({
        title: "Demo Access Granted",
        description: "Welcome to the full platform experience!",
      });

    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo Login Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Crown className="h-5 w-5 mr-2" />
            Demo Login - Full Access
          </>
        )}
      </Button>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          All Features
        </Badge>
        <Badge variant="secondary" className="text-xs">AI Bots</Badge>
        <Badge variant="secondary" className="text-xs">Live Data</Badge>
        <Badge variant="secondary" className="text-xs">Analytics</Badge>
        <Badge variant="secondary" className="text-xs">Paper Trading</Badge>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Experience the full platform with pre-configured portfolio and AI bots
      </p>
    </div>
  );
};

export default DemoLoginButton;
