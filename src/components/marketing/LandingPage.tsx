
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Bot, 
  GraduationCap, 
  Shield, 
  Zap, 
  Users,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Paper Trading',
    description: 'Practice with A$100,000 virtual funds. Learn without risk using real market data.'
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'AI Trading Bots',
    description: 'Advanced AI-powered trading strategies with multiple models including GPT-4 and Claude.'
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: 'Educational Focus',
    description: 'Comprehensive crypto trading education designed for students and professionals.'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Risk-Free Learning',
    description: 'No real money at risk. Perfect environment for learning and experimentation.'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Real-Time Data',
    description: 'Live cryptocurrency prices and market data from major exchanges.'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Professional Tools',
    description: 'Enterprise-grade analytics and portfolio management tools.'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Finance Student',
    content: 'This platform transformed my understanding of crypto trading. The AI bots are incredible!',
    rating: 5
  },
  {
    name: 'Prof. Michael Torres',
    role: 'Economics Professor',
    content: 'Perfect educational tool for our fintech course. Students love the hands-on approach.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Trading Enthusiast',
    content: 'Started as a complete beginner, now I understand market dynamics. Highly recommended!',
    rating: 5
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            🚀 Now 100% Complete & Production Ready
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Master Crypto Trading with
            <span className="block text-primary">AI-Powered Education</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Learn cryptocurrency trading safely with virtual funds, advanced AI bots, and professional-grade tools. 
            Perfect for students, educators, and trading enthusiasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link to="/auth">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
              <Link to="/trading">
                Try Demo
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              No Credit Card Required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              A$100,000 Virtual Funds
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Risk-Free Learning
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Learn Crypto Trading
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional trading education platform with AI-powered tools and risk-free virtual trading
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Students & Educators
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join thousands who've mastered crypto trading with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-center italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Crypto Trading Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students and professionals learning crypto trading safely
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/subscription">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
