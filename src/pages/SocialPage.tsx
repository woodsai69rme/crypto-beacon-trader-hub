
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Trophy, Share } from 'lucide-react';

const SocialPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Social Trading
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect with traders, share strategies, and learn from the community
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Following</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared Strategies</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Share className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leaderboard Rank</p>
                <p className="text-2xl font-bold">#23</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Community Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Traders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {rank}
                    </div>
                    <div>
                      <p className="font-medium">Trader{rank}</p>
                      <p className="text-sm text-muted-foreground">+{(Math.random() * 50 + 10).toFixed(1)}% this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(Math.random() * 500 + 100).toFixed(0)} followers</p>
                    <p className="text-sm text-green-600">+{(Math.random() * 10 + 5).toFixed(1)}% today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  T1
                </div>
                <div className="flex-1">
                  <p className="font-medium">Trader1 shared a new strategy</p>
                  <p className="text-sm text-muted-foreground">"Grid Trading with AI Risk Management"</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                  T2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Trader2 achieved 15% monthly gain</p>
                  <p className="text-sm text-muted-foreground">Using momentum trading strategy</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                  T3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Trader3 posted market analysis</p>
                  <p className="text-sm text-muted-foreground">"Bitcoin trend reversal signals"</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialPage;
