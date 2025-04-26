
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/use-toast";
import { Share2, MessageSquare, Users, Star, Trophy, TrendingUp, ArrowRight, ThumbsUp, Copy, MessagesSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StrategyShare {
  id: string;
  userId: string;
  username: string;
  strategyId: string;
  strategyName: string;
  description: string;
  timeframe: string;
  likes: number;
  comments: number;
  performance: number;
  type: string;
  timestamp: string;
  tags: string[];
}

interface TradingSignal {
  id: string;
  userId: string;
  username: string;
  coin: string;
  action: 'buy' | 'sell';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  timestamp: string;
  timeframe: string;
  expiresIn: string;
  likes: number;
  source: 'trader' | 'ai';
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  parentId?: string;
}

const mockUsers = [
  { id: 'user1', username: 'CryptoSage', verified: true, following: 245, followers: 1240, performance: 32.5 },
  { id: 'user2', username: 'TradeNinja', verified: true, following: 78, followers: 890, performance: 28.7 },
  { id: 'user3', username: 'BlockchainWhiz', verified: false, following: 112, followers: 573, performance: 15.3 },
  { id: 'user4', username: 'SatoshiFan', verified: false, following: 325, followers: 289, performance: 8.2 },
  { id: 'user5', username: 'CoinCollector', verified: true, following: 67, followers: 1450, performance: 42.8 },
];

const SocialTradingFeatures = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("strategies");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [shareDescription, setShareDescription] = useState<string>("");
  const [strategyShares, setStrategyShares] = useLocalStorage<StrategyShare[]>("strategyShares", [
    {
      id: "share1",
      userId: "user1",
      username: "CryptoSage",
      strategyId: "momentum-ai-1",
      strategyName: "AI Momentum Alpha",
      description: "This strategy has been working great for me in the current market conditions. 32% return in the last month!",
      timeframe: "1h",
      likes: 42,
      comments: 12,
      performance: 32.4,
      type: "momentum",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      tags: ["momentum", "ai", "machine-learning"]
    },
    {
      id: "share2",
      userId: "user2",
      username: "TradeNinja",
      strategyId: "mean-reversion-ai-1",
      strategyName: "Smart Mean Reversion",
      description: "Solid low-risk strategy that performs well in sideways markets. I've modified the parameters a bit from the original.",
      timeframe: "4h",
      likes: 28,
      comments: 8,
      performance: 17.5,
      type: "mean-reversion",
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      tags: ["mean-reversion", "low-risk", "modified"]
    }
  ]);
  
  const [tradingSignals, setTradingSignals] = useLocalStorage<TradingSignal[]>("tradingSignals", [
    {
      id: "signal1",
      userId: "user1",
      username: "CryptoSage",
      coin: "BTC",
      action: "buy",
      price: 51200,
      targetPrice: 54000,
      stopLoss: 49800,
      confidence: 85,
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      timeframe: "4h",
      expiresIn: "24h",
      likes: 38,
      source: "trader"
    },
    {
      id: "signal2",
      userId: "user5",
      username: "CoinCollector",
      coin: "ETH",
      action: "sell",
      price: 2950,
      targetPrice: 2800,
      stopLoss: 3050,
      confidence: 75,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      timeframe: "1h",
      expiresIn: "12h",
      likes: 25,
      source: "ai"
    },
    {
      id: "signal3",
      userId: "user3",
      username: "BlockchainWhiz",
      coin: "SOL",
      action: "buy",
      price: 125.50,
      targetPrice: 140,
      stopLoss: 120,
      confidence: 68,
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      timeframe: "1d",
      expiresIn: "72h",
      likes: 12,
      source: "trader"
    }
  ]);

  const [comments, setComments] = useLocalStorage<Comment[]>("strategyComments", [
    {
      id: "comment1",
      userId: "user3",
      username: "BlockchainWhiz",
      content: "I've been using this strategy with a slight modification to the RSI parameters. 28% return so far!",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      likes: 8
    },
    {
      id: "comment2",
      userId: "user4",
      username: "SatoshiFan",
      content: "What timeframe works best for this in your experience?",
      timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(),
      likes: 2
    },
    {
      id: "comment3",
      userId: "user1",
      username: "CryptoSage",
      content: "I find the 1H timeframe to be most effective for this strategy, especially during market volatility.",
      timestamp: new Date(Date.now() - 86400000 * 0.7).toISOString(),
      likes: 5,
      parentId: "comment2"
    }
  ]);
  
  const [newComment, setNewComment] = useState<string>("");

  const handleShareStrategy = (strategyId: string, strategyName: string) => {
    if (!shareDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please add a description before sharing your strategy.",
        variant: "destructive"
      });
      return;
    }
    
    const newShare: StrategyShare = {
      id: `share${Date.now()}`,
      userId: "currentUser", // Would come from auth context in a real app
      username: "You",
      strategyId,
      strategyName,
      description: shareDescription,
      timeframe: "1h", // This would be dynamic in a real app
      likes: 0,
      comments: 0,
      performance: Math.random() * 20 + 10, // Just for demo
      type: "custom",
      timestamp: new Date().toISOString(),
      tags: ["custom", "shared"]
    };
    
    setStrategyShares([newShare, ...strategyShares]);
    setShareDescription("");
    
    toast({
      title: "Strategy Shared",
      description: "Your strategy has been shared with the community."
    });
  };

  const handleLikeStrategy = (shareId: string) => {
    setStrategyShares(shares => 
      shares.map(share => 
        share.id === shareId 
          ? { ...share, likes: share.likes + 1 } 
          : share
      )
    );
  };

  const handleLikeSignal = (signalId: string) => {
    setTradingSignals(signals => 
      signals.map(signal => 
        signal.id === signalId 
          ? { ...signal, likes: signal.likes + 1 } 
          : signal
      )
    );
  };

  const handleAddComment = (shareId: string) => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: `comment${Date.now()}`,
      userId: "currentUser", // Would come from auth context in a real app
      username: "You",
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    setComments([...comments, newCommentObj]);
    
    // Update comment count on the share
    setStrategyShares(shares => 
      shares.map(share => 
        share.id === shareId 
          ? { ...share, comments: share.comments + 1 } 
          : share
      )
    );
    
    setNewComment("");
    
    toast({
      title: "Comment Added",
      description: "Your comment has been posted successfully."
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleCopyStrategy = (shareId: string) => {
    const share = strategyShares.find(s => s.id === shareId);
    if (share) {
      toast({
        title: "Strategy Copied",
        description: `${share.strategyName} has been copied to your strategies.`
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Social Trading
        </CardTitle>
        <CardDescription>
          Share strategies, signals and insights with the trading community
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="strategies">
              <Star className="mr-1 h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Strategies</span>
            </TabsTrigger>
            <TabsTrigger value="signals">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Signals</span>
            </TabsTrigger>
            <TabsTrigger value="traders">
              <Trophy className="mr-1 h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Top Traders</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategies" className="space-y-4">
            {selectedStrategy ? (
              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedStrategy(null)}
                  className="mb-2"
                >
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Back to Strategies
                </Button>
                
                {strategyShares
                  .filter(share => share.id === selectedStrategy)
                  .map(share => (
                    <div key={share.id} className="space-y-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                                  {share.username.charAt(0)}
                                </div>
                              </Avatar>
                              <div>
                                <div className="font-medium">{share.username}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTimeAgo(share.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Badge className="capitalize">{share.type}</Badge>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-1">{share.strategyName}</h3>
                            <p className="text-muted-foreground">{share.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {share.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            <div className="bg-muted p-2 rounded">
                              <div className="text-xs text-muted-foreground">Performance</div>
                              <div className="text-green-500 font-semibold">+{share.performance}%</div>
                            </div>
                            <div className="bg-muted p-2 rounded">
                              <div className="text-xs text-muted-foreground">Timeframe</div>
                              <div>{share.timeframe}</div>
                            </div>
                            <div className="bg-muted p-2 rounded">
                              <div className="text-xs text-muted-foreground">Engagement</div>
                              <div>{share.likes} likes</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLikeStrategy(share.id)}
                            >
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              Like
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleCopyStrategy(share.id)}
                            >
                              <Copy className="mr-1 h-4 w-4" />
                              Copy Strategy
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Comments ({share.comments})</h3>
                        
                        <div className="space-y-3">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className={`bg-muted/50 p-3 rounded-lg ${
                                comment.parentId ? "ml-6 border-l-2 border-primary" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
                                      {comment.username.charAt(0)}
                                    </div>
                                  </Avatar>
                                  <span className="font-medium text-sm">{comment.username}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {comment.likes}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button onClick={() => handleAddComment(share.id)}>Post</Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Share Your Strategy</h3>
                  <div className="space-y-3">
                    <Select defaultValue="custom">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a strategy to share" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">My Custom Strategy</SelectItem>
                        <SelectItem value="momentum-ai-1">AI Momentum Alpha</SelectItem>
                        <SelectItem value="mean-reversion-ai-1">Smart Mean Reversion</SelectItem>
                        <SelectItem value="breakout-ai-1">Neural Breakout Detector</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Textarea
                      placeholder="Share details about your strategy and results..."
                      value={shareDescription}
                      onChange={(e) => setShareDescription(e.target.value)}
                    />
                    
                    <div className="flex justify-end">
                      <Button onClick={() => handleShareStrategy("custom", "My Custom Strategy")}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Strategy
                      </Button>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">Community Strategies</h3>
                <div className="space-y-4">
                  {strategyShares.map((share) => (
                    <Card key={share.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                                {share.username.charAt(0)}
                              </div>
                            </Avatar>
                            <div>
                              <div className="font-medium">{share.username}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatTimeAgo(share.timestamp)}
                              </div>
                            </div>
                          </div>
                          <Badge className="capitalize">{share.type}</Badge>
                        </div>
                        
                        <div className="mb-2">
                          <h4 className="font-semibold">{share.strategyName}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {share.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {share.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center text-sm">
                          <div className="bg-muted p-1 rounded">
                            <span className="text-green-500">+{share.performance}%</span>
                          </div>
                          <div className="bg-muted p-1 rounded">{share.timeframe}</div>
                          <div className="bg-muted p-1 rounded">
                            <ThumbsUp className="inline h-3 w-3 mr-1" />
                            {share.likes}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleLikeStrategy(share.id)}
                            className="text-xs"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Like
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedStrategy(share.id)}
                            className="text-xs"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Comments ({share.comments})
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopyStrategy(share.id)}
                            className="text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-4">
            {selectedSignal ? (
              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedSignal(null)}
                  className="mb-2"
                >
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Back to Signals
                </Button>
                
                {tradingSignals
                  .filter(signal => signal.id === selectedSignal)
                  .map(signal => (
                    <Card key={signal.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                                {signal.username.charAt(0)}
                              </div>
                            </Avatar>
                            <div>
                              <div className="font-medium">{signal.username}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatTimeAgo(signal.timestamp)}
                              </div>
                            </div>
                          </div>
                          <Badge variant={signal.source === 'ai' ? "secondary" : "default"}>
                            {signal.source === 'ai' ? 'AI Generated' : 'Trader Signal'}
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{signal.coin}</h3>
                            <Badge className={signal.action === 'buy' ? 'bg-green-500' : 'bg-red-500'}>
                              {signal.action.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-muted p-3 rounded">
                              <div className="text-xs text-muted-foreground">Entry Price</div>
                              <div className="font-semibold">${signal.price.toLocaleString()}</div>
                            </div>
                            <div className="bg-muted p-3 rounded">
                              <div className="text-xs text-muted-foreground">Target Price</div>
                              <div className="font-semibold text-green-500">${signal.targetPrice.toLocaleString()}</div>
                            </div>
                            <div className="bg-muted p-3 rounded">
                              <div className="text-xs text-muted-foreground">Stop Loss</div>
                              <div className="font-semibold text-red-500">${signal.stopLoss.toLocaleString()}</div>
                            </div>
                            <div className="bg-muted p-3 rounded">
                              <div className="text-xs text-muted-foreground">Confidence</div>
                              <div className="font-semibold">{signal.confidence}%</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="bg-muted p-3 rounded">
                              <div className="text-xs text-muted-foreground">Timeframe</div>
                              <div className="font-semibold">{signal.timeframe}</div>
                            </div>
                            <div className="bg-muted p-3 rounded">
                              <div className="text-xs text-muted-foreground">Expires In</div>
                              <div className="font-semibold">{signal.expiresIn}</div>
                            </div>
                            <div className="bg-muted p-3 rounded">
                              <div className="text-xs text-muted-foreground">Potential</div>
                              <div className="font-semibold text-green-500">
                                {(Math.abs(signal.targetPrice - signal.price) / signal.price * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLikeSignal(signal.id)}
                          >
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            Like ({signal.likes})
                          </Button>
                          <Button>
                            <Copy className="mr-1 h-4 w-4" />
                            Copy Signal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Discussion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
                                T
                              </div>
                            </Avatar>
                            <span className="font-medium text-sm">TradeNinja</span>
                          </div>
                          <span className="text-xs text-muted-foreground">2h ago</span>
                        </div>
                        <p className="text-sm">Great signal! I'm also watching this level closely.</p>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
                                C
                              </div>
                            </Avatar>
                            <span className="font-medium text-sm">CryptoSage</span>
                          </div>
                          <span className="text-xs text-muted-foreground">1h ago</span>
                        </div>
                        <p className="text-sm">I'd set the stop loss a bit tighter, but overall solid analysis.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Input placeholder="Add your thoughts..." />
                      <Button>Send</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tradingSignals.map((signal) => (
                    <Card key={signal.id} className="overflow-hidden h-full">
                      <div className="p-4 h-full flex flex-col">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                                {signal.username.charAt(0)}
                              </div>
                            </Avatar>
                            <div>
                              <div className="font-medium">{signal.username}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatTimeAgo(signal.timestamp)}
                              </div>
                            </div>
                          </div>
                          <Badge variant={signal.action === 'buy' ? 'default' : 'destructive'} className="uppercase">
                            {signal.action}
                          </Badge>
                        </div>
                        
                        <div className="my-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-lg">{signal.coin}</h4>
                            <Badge variant="outline">{signal.timeframe}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 my-3 text-center text-sm">
                            <div className="bg-muted p-2 rounded">
                              <div className="text-xs text-muted-foreground">Entry</div>
                              <div>${signal.price.toLocaleString()}</div>
                            </div>
                            <div className="bg-muted p-2 rounded">
                              <div className="text-xs text-muted-foreground">Target</div>
                              <div className="text-green-500">${signal.targetPrice.toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div className="bg-muted p-2 rounded text-center mb-3">
                            <div className="text-xs text-muted-foreground">Confidence</div>
                            <div className="bg-primary/10 h-2 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${signal.confidence}%` }}
                              ></div>
                            </div>
                            <div className="text-xs mt-1">{signal.confidence}%</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-auto">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleLikeSignal(signal.id)}
                            className="text-xs"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {signal.likes}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSignal(signal.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline">
                    Load More Signals
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="traders" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mockUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3">
                          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                            {user.username.charAt(0)}
                          </div>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{user.username}</span>
                            {user.verified && (
                              <svg
                                className="ml-1 h-4 w-4 text-blue-500"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.followers} followers
                          </div>
                        </div>
                      </div>
                      {user.performance > 0 && (
                        <Badge className="bg-green-500">
                          +{user.performance}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                      <div className="border rounded p-3">
                        <div className="text-2xl font-semibold">{user.following}</div>
                        <div className="text-xs text-muted-foreground">Following</div>
                      </div>
                      <div className="border rounded p-3">
                        <div className="text-2xl font-semibold">{user.followers}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline">
                Discover More Traders
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" size="sm">
          <MessagesSquare className="mr-2 h-4 w-4" />
          Trading Lounge
        </Button>
        <Button size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share Your Portfolio
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SocialTradingFeatures;
