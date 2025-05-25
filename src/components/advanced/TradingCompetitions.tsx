
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Clock, DollarSign, TrendingUp } from "lucide-react";

interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'profit' | 'consistency' | 'risk-adjusted' | 'ai-only';
  prizePool: number;
  currency: string;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  entry: 'free' | 'paid';
  entryFee?: number;
  rules: string[];
}

interface Leaderboard {
  rank: number;
  trader: {
    id: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  portfolio: number;
  return: number;
  trades: number;
  winRate: number;
  maxDrawdown: number;
}

const TradingCompetitions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [joinedCompetitions, setJoinedCompetitions] = useState<string[]>([]);

  const competitions: Competition[] = [
    {
      id: '1',
      title: 'January Profit Challenge',
      description: 'Maximize your portfolio returns over 30 days',
      type: 'profit',
      prizePool: 50000,
      currency: 'AUD',
      participants: 2847,
      maxParticipants: 5000,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'active',
      entry: 'free',
      rules: [
        'Starting balance: $10,000 virtual funds',
        'No leverage allowed',
        'Minimum 10 trades required',
        'Results based on total portfolio return'
      ]
    },
    {
      id: '2',
      title: 'AI Trading Masters',
      description: 'AI-only trading competition using automated strategies',
      type: 'ai-only',
      prizePool: 25000,
      currency: 'AUD',
      participants: 1523,
      maxParticipants: 2000,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      entry: 'paid',
      entryFee: 50,
      rules: [
        'Only AI trading bots allowed',
        'Starting balance: $5,000 virtual funds',
        'Maximum 5x leverage',
        'Judged on risk-adjusted returns'
      ]
    },
    {
      id: '3',
      title: 'Consistency Challenge',
      description: 'Steady gains over volatility - consistency wins',
      type: 'consistency',
      prizePool: 15000,
      currency: 'AUD',
      participants: 892,
      maxParticipants: 1500,
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      status: 'upcoming',
      entry: 'free',
      rules: [
        'Starting balance: $8,000 virtual funds',
        'Judged on Sharpe ratio',
        'Maximum 20% drawdown limit',
        'Bonus points for low volatility'
      ]
    }
  ];

  const mockLeaderboard: Leaderboard[] = [
    {
      rank: 1,
      trader: {
        id: '1',
        username: 'CryptoMaster_AU',
        avatar: '/placeholder-avatar.png',
        verified: true
      },
      portfolio: 14750,
      return: 47.5,
      trades: 28,
      winRate: 78.6,
      maxDrawdown: 8.2
    },
    {
      rank: 2,
      trader: {
        id: '2',
        username: 'AITraderPro',
        avatar: '/placeholder-avatar.png',
        verified: true
      },
      portfolio: 14200,
      return: 42.0,
      trades: 45,
      winRate: 71.1,
      maxDrawdown: 12.5
    },
    {
      rank: 3,
      trader: {
        id: '3',
        username: 'TechAnalyst',
        avatar: '/placeholder-avatar.png',
        verified: false
      },
      portfolio: 13890,
      return: 38.9,
      trades: 33,
      winRate: 75.8,
      maxDrawdown: 9.8
    }
  ];

  const joinCompetition = (competitionId: string) => {
    setJoinedCompetitions(prev => [...prev, competitionId]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'profit': return <TrendingUp className="h-4 w-4" />;
      case 'ai-only': return <Trophy className="h-4 w-4" />;
      case 'consistency': return <Clock className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Trading Competitions
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {competitions
              .filter(comp => comp.status === 'active')
              .map(competition => (
                <Card key={competition.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(competition.type)}
                        <div>
                          <h3 className="text-lg font-semibold">{competition.title}</h3>
                          <p className="text-muted-foreground">{competition.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(competition.status)}`} />
                        <Badge variant="default">{competition.status}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Prize Pool</div>
                        <div className="font-semibold text-green-500">
                          ${competition.prizePool.toLocaleString()} {competition.currency}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Participants</div>
                        <div className="font-semibold">
                          {competition.participants.toLocaleString()} / {competition.maxParticipants.toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Entry</div>
                        <div className="font-semibold">
                          {competition.entry === 'free' ? 'Free' : `$${competition.entryFee} ${competition.currency}`}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Ends</div>
                        <div className="font-semibold">{new Date(competition.endDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Participation</div>
                      <Progress 
                        value={(competition.participants / competition.maxParticipants) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Rules:</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {competition.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={() => joinCompetition(competition.id)}
                        disabled={joinedCompetitions.includes(competition.id)}
                      >
                        {joinedCompetitions.includes(competition.id) ? 'Joined' : 'Join Competition'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {competitions
              .filter(comp => comp.status === 'upcoming')
              .map(competition => (
                <Card key={competition.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(competition.type)}
                        <div>
                          <h3 className="text-lg font-semibold">{competition.title}</h3>
                          <p className="text-muted-foreground">{competition.description}</p>
                        </div>
                      </div>
                      
                      <Badge variant="outline">{competition.status}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Prize Pool</div>
                        <div className="font-semibold text-green-500">
                          ${competition.prizePool.toLocaleString()} {competition.currency}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Entry</div>
                        <div className="font-semibold">
                          {competition.entry === 'free' ? 'Free' : `$${competition.entryFee} ${competition.currency}`}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Starts</div>
                        <div className="font-semibold">{new Date(competition.startDate).toLocaleDateString()}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-semibold">30 days</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Pre-Register
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="space-y-2">
              {mockLeaderboard.map(entry => (
                <Card key={entry.rank}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-muted-foreground">#{entry.rank}</div>
                        <Avatar>
                          <AvatarImage src={entry.trader.avatar} alt={entry.trader.username} />
                          <AvatarFallback>{entry.trader.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{entry.trader.username}</span>
                            {entry.trader.verified && <Badge variant="secondary">Verified</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.trades} trades • {entry.winRate}% win rate
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Portfolio</div>
                          <div className="font-semibold">${entry.portfolio.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Return</div>
                          <div className="font-semibold text-green-500">+{entry.return}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Max DD</div>
                          <div className="font-semibold text-red-500">{entry.maxDrawdown}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No competition history yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Join a competition to see your performance history
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingCompetitions;
