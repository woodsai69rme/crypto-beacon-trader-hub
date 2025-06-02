
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DemoLoginButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Demo credentials
      const demoEmail = 'demo@cryptobeacon.com';
      const demoPassword = 'demo123456';

      console.log('Attempting demo login...');

      // First try to sign in with existing demo account
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) {
        console.log('Sign in failed, attempting to create demo account:', signInError.message);
        
        // If sign in fails, try to create the demo user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
          console.error('Sign up error:', signUpError);
          throw new Error(`Demo account creation failed: ${signUpError.message}`);
        }

        console.log('Demo account created, attempting sign in again...');
        
        // Try signing in again after signup
        const { data: secondSignInData, error: secondSignInError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword,
        });

        if (secondSignInError) {
          console.error('Second sign in error:', secondSignInError);
          throw new Error(`Demo login failed after account creation: ${secondSignInError.message}`);
        }

        console.log('Demo login successful after account creation');
      } else {
        console.log('Demo login successful');
      }

      toast({
        title: "Demo Access Granted! 🎉",
        description: "Welcome to the full crypto trading platform experience!",
      });

    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo Login Failed",
        description: error.message || "Please try again or contact support",
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
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Connecting to Demo...
          </>
        ) : (
          <>
            <Crown className="h-5 w-5 mr-2" />
            Demo Login - Full Access
          </>
        )}
      </Button>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          All Features
        </Badge>
        <Badge variant="secondary" className="text-xs">AI Bots</Badge>
        <Badge variant="secondary" className="text-xs">Live Data</Badge>
        <Badge variant="secondary" className="text-xs">Analytics</Badge>
        <Badge variant="secondary" className="text-xs">Paper Trading</Badge>
      </div>
      
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p className="font-medium">Experience the full platform instantly</p>
        <p className="text-gray-500">Pre-configured with demo portfolio and AI trading bots</p>
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-700 dark:text-blue-300">
          <p className="font-mono text-xs">demo@cryptobeacon.com</p>
          <p className="font-mono text-xs">Password: demo123456</p>
        </div>
      </div>
    </div>
  );
};

export default DemoLoginButton;
