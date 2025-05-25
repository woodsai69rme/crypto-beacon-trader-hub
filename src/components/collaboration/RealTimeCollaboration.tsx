
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageCircle, Share2, Edit, Eye } from "lucide-react";

interface CollaboratorUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  role: 'owner' | 'editor' | 'viewer';
  cursor?: { x: number; y: number };
}

interface SharedStrategy {
  id: string;
  name: string;
  description: string;
  owner: string;
  collaborators: string[];
  lastModified: string;
  version: number;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
  };
}

const RealTimeCollaboration: React.FC = () => {
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: '/placeholder-avatar.png',
      status: 'online',
      role: 'editor'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: '/placeholder-avatar.png',
      status: 'online',
      role: 'viewer'
    },
    {
      id: '3',
      name: 'Carol Davis',
      avatar: '/placeholder-avatar.png',
      status: 'away',
      role: 'editor'
    }
  ]);

  const sharedStrategies: SharedStrategy[] = [
    {
      id: '1',
      name: 'Team Momentum Strategy',
      description: 'Collaborative momentum-based trading strategy',
      owner: 'You',
      collaborators: ['Alice', 'Bob', 'Carol'],
      lastModified: '2 minutes ago',
      version: 3,
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true
      }
    },
    {
      id: '2',
      name: 'Diversified Portfolio Plan',
      description: 'Multi-asset portfolio strategy developed by team',
      owner: 'Alice Johnson',
      collaborators: ['You', 'Bob'],
      lastModified: '1 hour ago',
      version: 8,
      permissions: {
        canEdit: false,
        canComment: true,
        canShare: false
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-500';
      case 'editor': return 'bg-blue-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const startCollaboration = () => {
    setIsCollaborating(true);
  };

  const stopCollaboration = () => {
    setIsCollaborating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Real-Time Collaboration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Collaboration Session</h3>
            <p className="text-sm text-muted-foreground">
              Work together on trading strategies in real-time
            </p>
          </div>
          
          <Button 
            onClick={isCollaborating ? stopCollaboration : startCollaboration}
            variant={isCollaborating ? "destructive" : "default"}
          >
            {isCollaborating ? 'Stop Collaboration' : 'Start Collaboration'}
          </Button>
        </div>

        {isCollaborating && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Live Collaboration Active
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-green-700 dark:text-green-300">Active Users:</span>
                <div className="flex -space-x-2">
                  {collaborators
                    .filter(user => user.status === 'online')
                    .map(user => (
                      <Avatar key={user.id} className="border-2 border-white w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share Screen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Team Members</h3>
          <div className="space-y-2">
            {collaborators.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                  </div>
                  
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">{user.status}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={`${getRoleColor(user.role)} text-white border-none`}
                  >
                    {user.role}
                  </Badge>
                  
                  {user.status === 'online' && (
                    <Badge variant="secondary">
                      {user.role === 'viewer' ? <Eye className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shared Strategies</h3>
          <div className="space-y-4">
            {sharedStrategies.map(strategy => (
              <Card key={strategy.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{strategy.name}</h4>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                    
                    <Badge variant="outline">v{strategy.version}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>Owner: {strategy.owner}</span>
                    <span>Modified {strategy.lastModified}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Collaborators:</span>
                      <div className="flex -space-x-1">
                        {strategy.collaborators.slice(0, 3).map((name, index) => (
                          <Avatar key={index} className="w-6 h-6 border border-white">
                            <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        {strategy.collaborators.length > 3 && (
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                            +{strategy.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {strategy.permissions.canEdit && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {strategy.permissions.canComment && (
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                      )}
                      
                      {strategy.permissions.canShare && (
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Invite Collaborators</h3>
          <div className="flex gap-2">
            <Input placeholder="Enter email address" className="flex-1" />
            <Button>Send Invite</Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Invited users will receive an email with collaboration access
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeCollaboration;
