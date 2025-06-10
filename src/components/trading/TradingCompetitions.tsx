
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, DollarSign, Clock, Medal, Target } from 'lucide-react';

const TradingCompetitions: React.FC = () => {
  const [activeCompetitions] = useState([
    {
      id: 'monthly-challenge',
      name: 'Monthly Trading Challenge',
      description: 'Compete with traders worldwide in this month-long challenge',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      participants: 1247,
      prize: 'AUD $10,000',
      status: 'active',
      userRank: 45,
      userReturn: 12.5,
      leaderReturn: 28.7,
      timeLeft: '18 days',
      entryFee: 'Free'
    },
    {
      id: 'ai-bot-tournament',
      name: 'AI Bot Tournament',
      description: 'Let your AI bots compete in automated trading',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      participants: 856,
      prize: 'AUD $5,000',
      status: 'upcoming',
      entryFee: 'AUD $10'
    },
    {
      id: 'swing-trading-masters',
      name: 'Swing Trading Masters',
      description: 'Medium-term trading strategies competition',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      participants: 2341,
      prize: 'AUD $25,000',
      status: 'active',
      userRank: 127,
      userReturn: 8.9,
      leaderReturn: 35.2,
      timeLeft: '45 days',
      entryFee: 'AUD $50'
    }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'TradingMaster2024', return: 28.7, trades: 156, country: 'AU' },
    { rank: 2, name: 'CryptoKing', return: 26.3, trades: 89, country: 'US' },
    { rank: 3, name: 'AlgoTrader', return: 24.1, trades: 234, country: 'UK' },
    { rank: 4, name: 'DiamondHands', return: 22.8, trades: 67, country: 'CA' },
    { rank: 5, name: 'MoonShot', return: 21.5, trades: 123, country: 'DE' },
    { rank: 45, name: 'You', return: 12.5, trades: 78, country: 'AU', isUser: true }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trading Competitions</h2>
          <p className="text-muted-foreground">Compete with traders worldwide and win prizes</p>
        </div>
        <Button>
          <Trophy className="h-4 w-4 mr-2" />
          Create Competition
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeCompetitions.filter(comp => comp.status === 'active').map(competition => (
            <Card key={competition.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      {competition.name}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">{competition.description}</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-semibold">{competition.prize}</div>
                      <div className="text-sm text-muted-foreground">Prize Pool</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-semibold">{competition.participants.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Participants</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <div className="font-semibold">{competition.timeLeft}</div>
                      <div className="text-sm text-muted-foreground">Time Left</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-semibold">#{competition.userRank}</div>
                      <div className="text-sm text-muted-foreground">Your Rank</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Your Performance</div>
                    <div className="text-lg font-bold text-green-500">+{competition.userReturn}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Leader Performance</div>
                    <div className="text-lg font-bold">+{competition.leaderReturn}%</div>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {activeCompetitions.filter(comp => comp.status === 'upcoming').map(competition => (
            <Card key={competition.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{competition.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{competition.description}</p>
                  </div>
                  <Badge variant="secondary">Upcoming</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div className="font-semibold">{new Date(competition.startDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Prize Pool</div>
                    <div className="font-semibold">{competition.prize}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Entry Fee</div>
                    <div className="font-semibold">{competition.entryFee}</div>
                  </div>
                </div>
                <Button className="w-full">Register Now</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Challenge Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map(entry => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      entry.isUser ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {entry.rank <= 3 ? (
                          <Medal className={`h-4 w-4 ${
                            entry.rank === 1 ? 'text-yellow-500' :
                            entry.rank === 2 ? 'text-gray-400' :
                            'text-orange-600'
                          }`} />
                        ) : (
                          <span className="text-sm font-semibold">#{entry.rank}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.trades} trades • {entry.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${entry.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {entry.return >= 0 ? '+' : ''}{entry.return}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingCompetitions;
