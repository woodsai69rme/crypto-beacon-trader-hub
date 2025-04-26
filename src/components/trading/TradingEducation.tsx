
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Signal {
  id: string;
  coin: string;
  type: "buy" | "sell";
  price: number;
  target: number;
  stopLoss: number;
  confidence: "low" | "medium" | "high";
  timeframe: string;
  date: string;
  analyst: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  modules: number;
  image: string;
  author: string;
}

const TradingEducation = () => {
  const [signals] = useState<Signal[]>([
    {
      id: "sig1",
      coin: "Bitcoin",
      type: "buy",
      price: 86400,
      target: 92000,
      stopLoss: 84000,
      confidence: "high",
      timeframe: "1d",
      date: "2025-04-25",
      analyst: "CryptoVision AI"
    },
    {
      id: "sig2",
      coin: "Ethereum",
      type: "buy",
      price: 3240,
      target: 3500,
      stopLoss: 3100,
      confidence: "medium",
      timeframe: "4h",
      date: "2025-04-26",
      analyst: "TrendMaster"
    },
    {
      id: "sig3",
      coin: "Solana",
      type: "sell",
      price: 145.50,
      target: 135.00,
      stopLoss: 150.00,
      confidence: "medium",
      timeframe: "1d",
      date: "2025-04-26",
      analyst: "CryptoVision AI"
    },
    {
      id: "sig4",
      coin: "Cardano",
      type: "buy",
      price: 0.56,
      target: 0.65,
      stopLoss: 0.52,
      confidence: "high",
      timeframe: "1w",
      date: "2025-04-24",
      analyst: "MarketScope"
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: "course1",
      title: "Crypto Trading Fundamentals",
      description: "Learn the basics of cryptocurrency trading, chart analysis, and risk management",
      level: "beginner",
      duration: "6 hours",
      modules: 8,
      image: "placeholder.svg",
      author: "Alex Rivers"
    },
    {
      id: "course2",
      title: "Advanced Technical Analysis",
      description: "Master complex chart patterns, indicators, and develop your own trading system",
      level: "intermediate",
      duration: "10 hours",
      modules: 12,
      image: "placeholder.svg",
      author: "Sarah Zhang"
    },
    {
      id: "course3",
      title: "AI-Powered Trading Strategies",
      description: "Leverage artificial intelligence and machine learning for trading advantage",
      level: "advanced",
      duration: "8 hours",
      modules: 10,
      image: "placeholder.svg",
      author: "Dr. Marcus Chen"
    },
    {
      id: "course4",
      title: "Psychology of Trading",
      description: "Develop mental discipline and emotional control for consistent profits",
      level: "intermediate",
      duration: "4 hours",
      modules: 6,
      image: "placeholder.svg",
      author: "Elena Kowalski"
    }
  ]);

  const handleAddToWatchlist = (coin: string) => {
    toast({
      title: "Added to Watchlist",
      description: `${coin} has been added to your watchlist`,
    });
  };

  const handleEnrollCourse = (courseTitle: string) => {
    toast({
      title: "Enrolled Successfully",
      description: `You've enrolled in "${courseTitle}"`,
    });
  };

  const getConfidenceColor = (confidence: "low" | "medium" | "high") => {
    switch (confidence) {
      case "low": return "bg-yellow-500/10 text-yellow-500";
      case "medium": return "bg-blue-500/10 text-blue-500";
      case "high": return "bg-green-500/10 text-green-500";
      default: return "";
    }
  };

  const getLevelColor = (level: "beginner" | "intermediate" | "advanced") => {
    switch (level) {
      case "beginner": return "bg-green-500/10 text-green-500";
      case "intermediate": return "bg-blue-500/10 text-blue-500";
      case "advanced": return "bg-purple-500/10 text-purple-500";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Education & Signals</CardTitle>
        <CardDescription>Premium trading signals and educational resources</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="signals" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="signals">Trading Signals</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Latest Signals</h3>
                <Button variant="outline" size="sm">
                  View All Signals
                </Button>
              </div>
              
              <div className="grid gap-4">
                {signals.map(signal => (
                  <div key={signal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{signal.coin}</span>
                        <Badge className={signal.type === "buy" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                          {signal.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getConfidenceColor(signal.confidence)}>
                          {signal.confidence.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {signal.date} • {signal.timeframe}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Entry Price</div>
                        <div className="font-medium">${signal.price.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Target</div>
                        <div className="font-medium text-green-500">${signal.target.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Stop Loss</div>
                        <div className="font-medium text-red-500">${signal.stopLoss.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-muted-foreground">
                        by {signal.analyst}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAddToWatchlist(signal.coin)}
                      >
                        Add to Watchlist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button>
                  Subscribe to Premium Signals
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="education">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Featured Courses</h3>
                <Button variant="outline" size="sm">
                  Browse All Courses
                </Button>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {courses.map(course => (
                  <div key={course.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge variant="outline" className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                      
                      <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                        <div>by {course.author}</div>
                        <div>{course.duration} • {course.modules} modules</div>
                      </div>
                      
                      <Button 
                        className="w-full mt-3"
                        size="sm"
                        onClick={() => handleEnrollCourse(course.title)}
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingEducation;
