
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink, Globe, Zap, Shield, Rocket } from 'lucide-react';

interface DeploymentOption {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  cost: string;
  features: string[];
  deployUrl: string;
  docsUrl: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

const deploymentOptions: DeploymentOption[] = [
  {
    name: 'Netlify',
    description: 'One-click deployment with automatic CI/CD and global CDN',
    difficulty: 'Easy',
    cost: 'Free - $45/month',
    features: [
      'Automatic deployments from Git',
      'Global CDN',
      'Custom domains',
      'Form handling',
      'Serverless functions'
    ],
    deployUrl: 'https://app.netlify.com/start/deploy?repository=https://github.com/your-repo',
    docsUrl: 'https://docs.netlify.com/',
    icon: <Globe className="h-6 w-6" />,
    recommended: true
  },
  {
    name: 'Vercel',
    description: 'Optimized for React applications with edge computing',
    difficulty: 'Easy',
    cost: 'Free - $20/month',
    features: [
      'Zero-config deployments',
      'Edge network',
      'Preview deployments',
      'Analytics',
      'Serverless functions'
    ],
    deployUrl: 'https://vercel.com/new',
    docsUrl: 'https://vercel.com/docs',
    icon: <Zap className="h-6 w-6" />
  },
  {
    name: 'AWS Amplify',
    description: 'Enterprise-grade hosting with AWS integration',
    difficulty: 'Medium',
    cost: '$0.01/build + hosting',
    features: [
      'AWS ecosystem integration',
      'Branch-based deployments',
      'Custom domains',
      'Performance monitoring',
      'Global CDN'
    ],
    deployUrl: 'https://console.aws.amazon.com/amplify/',
    docsUrl: 'https://docs.aws.amazon.com/amplify/',
    icon: <Shield className="h-6 w-6" />
  },
  {
    name: 'GitHub Pages',
    description: 'Free hosting directly from your GitHub repository',
    difficulty: 'Easy',
    cost: 'Free',
    features: [
      'Direct Git integration',
      'Custom domains',
      'HTTPS by default',
      'Jekyll support',
      'GitHub Actions CI/CD'
    ],
    deployUrl: 'https://pages.github.com/',
    docsUrl: 'https://docs.github.com/en/pages',
    icon: <Rocket className="h-6 w-6" />
  }
];

const DeploymentGuide: React.FC = () => {
  const getBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'default';
      case 'Medium': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Deploy Your Platform</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your preferred deployment platform and go live in minutes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deploymentOptions.map((option) => (
          <Card key={option.name} className={`relative ${option.recommended ? 'ring-2 ring-primary' : ''}`}>
            {option.recommended && (
              <Badge className="absolute -top-3 left-4 bg-primary">
                Recommended
              </Badge>
            )}
            
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {option.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{option.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getBadgeVariant(option.difficulty)}>
                      {option.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">{option.cost}</span>
                  </div>
                </div>
              </div>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <a href={option.deployUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Deploy Now
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={option.docsUrl} target="_blank" rel="noopener noreferrer">
                      Docs
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            Pre-Deployment Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Environment Setup:</h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Configure Supabase URL and keys
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Set up OpenRouter API key
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Configure Stripe keys (for subscriptions)
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Domain & Security:</h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Custom domain setup
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  SSL certificate configuration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Analytics tracking setup
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentGuide;
