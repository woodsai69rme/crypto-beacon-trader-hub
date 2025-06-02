
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthProvider';
import { Info, ArrowLeft } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crypto Beacon Trading Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Professional crypto trading platform with AI-powered insights
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Authentication Temporarily Disabled
            </CardTitle>
            <CardDescription>
              Sign-in functionality is currently disabled for platform development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Authentication features are being prepared for deployment. 
                All trading features are currently available in demo mode without sign-in required.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                <h3 className="font-semibold text-sm mb-2">Available Features:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Paper trading with real market data</li>
                  <li>• AI trading bots and strategies</li>
                  <li>• Live market analytics and charts</li>
                  <li>• News feed and sentiment analysis</li>
                  <li>• Portfolio tracking and management</li>
                </ul>
              </div>

              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
                variant="default"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue to Platform
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Authentication will be enabled before final deployment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
