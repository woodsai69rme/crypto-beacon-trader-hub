
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from './AuthProvider';
import { Zap, Crown } from 'lucide-react';

const DemoLoginButton: React.FC = () => {
  const { signIn } = useAuth();

  const handleDemoLogin = async () => {
    // Demo credentials with full access
    await signIn('demo@cryptobeacon.com', 'demo123456');
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={handleDemoLogin}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        <Crown className="h-5 w-5 mr-2" />
        Demo Login - Full Access
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
