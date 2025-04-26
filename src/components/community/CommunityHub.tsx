
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Users, BarChart, ChartLine, Share } from "lucide-react";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface ChatMessage {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState("forum");
  const [posts] = useState<ForumPost[]>([
    {
      id: "post1",
      title: "Bitcoin's price action after the halving - Analysis",
      content: "I've been analyzing the price patterns following previous halvings and noticed an interesting trend...",
      author: {
        name: "CryptoExpert",
        avatar: ""
      },
      date: "2 hours ago",
      likes: 42,
      comments: 18,
      tags: ["Bitcoin", "Halving", "Analysis"]
    },
    {
      id: "post2",
      title: "My experience with AI trading bots - 3 month results",
      content: "I've been testing several AI trading strategies for the past 3 months. Here are my results and thoughts...",
      author: {
        name: "TradingEnthusiast",
        avatar: ""
      },
      date: "8 hours ago",
      likes: 87,
      comments: 36,
      tags: ["AI", "Bots", "Results"]
    },
    {
      id: "post3",
      title: "Technical analysis: SOL forming a bullish pattern?",
      content: "Looking at the 4h chart for Solana, I'm seeing what appears to be an inverse head and shoulders pattern...",
      author: {
        name: "ChartWizard",
        avatar: ""
      },
      date: "Yesterday",
      likes: 29,
      comments: 14,
      tags: ["Solana", "Technical Analysis"]
    }
  ]);
  
  const [messages] = useState<ChatMessage[]>([
    {
      id: "msg1",
      author: {
        name: "System",
        avatar: ""
      },
      content: "Welcome to the Trading Lounge! Discuss market movements and share ideas with fellow traders.",
      timestamp: "12:00 PM"
    },
    {
      id: "msg2",
      author: {
        name: "MarketMaker",
        avatar: ""
      },
      content: "Anyone watching BTC's rejection at the 92K level? Looks like we might retest support soon.",
      timestamp: "12:05 PM"
    },
    {
      id: "msg3",
      author: {
        name: "AlphaCryptoTrader",
        avatar: ""
      },
      content: "Yeah, I've got my eyes on it. Volume is decreasing on this push up, might indicate weakening momentum.",
      timestamp: "12:07 PM"
    },
    {
      id: "msg4",
      author: {
        name: "TechnicalTom",
        avatar: ""
      },
      content: "RSI is showing overbought on the 4h chart too. I'm looking for entries around 88K if we drop.",
      timestamp: "12:10 PM"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to a backend
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the trading lounge"
    });
    
    setNewMessage("");
  };
  
  const handleLikePost = (postId: string) => {
    toast({
      description: "Post liked"
    });
  };
  
  const handleSharePost = (postId: string) => {
    toast({
      title: "Post Shared",
      description: "Link copied to clipboard"
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Community Hub</CardTitle>
        <CardDescription>Connect with fellow traders, share insights, and learn together</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="forum" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Forum</span>
            </TabsTrigger>
            <TabsTrigger value="trading-lounge" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Trading Lounge</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <ChartLine className="h-4 w-4" />
              <span>Community Analysis</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="forum">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Button variant="outline" size="sm">Latest</Button>
                <Button>Create Post</Button>
              </div>
              
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{post.title}</h4>
                          <span className="text-xs text-muted-foreground">{post.date}</span>
                        </div>
                        
                        <div className="text-sm mt-1">
                          <span className="font-medium">{post.author.name}</span>
                        </div>
                        
                        <p className="mt-2 text-sm">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-4 mt-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLikePost(post.id)}
                            className="text-muted-foreground text-xs"
                          >
                            ❤️ {post.likes}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground text-xs"
                          >
                            💬 {post.comments}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSharePost(post.id)}
                            className="text-muted-foreground text-xs"
                          >
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-4">
                <Button variant="outline">Load More</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trading-lounge">
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto border rounded-md p-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.author.avatar} />
                        <AvatarFallback>{message.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-medium text-sm">{message.author.name}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <p className="text-sm mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="text-center py-8">
              <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Community Analysis</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                View and share technical analysis from the community. This feature will be available soon!
              </p>
              <Button className="mt-4">Get Notified When Available</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunityHub;
