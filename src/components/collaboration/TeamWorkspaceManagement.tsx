
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Settings, Shield, Folder, Plus, MoreHorizontal } from "lucide-react";

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedDate: string;
  lastActive: string;
}

interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  type: 'strategy' | 'portfolio' | 'analysis';
  members: string[];
  status: 'active' | 'completed' | 'archived';
  createdDate: string;
  lastModified: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  roles: {
    admin: boolean;
    editor: boolean;
    viewer: boolean;
  };
}

const TeamWorkspaceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');

  const workspaceMembers: WorkspaceMember[] = [
    {
      id: '1',
      name: 'You',
      email: 'you@example.com',
      avatar: '/placeholder-avatar.png',
      role: 'admin',
      status: 'active',
      joinedDate: '2023-01-15',
      lastActive: 'Now'
    },
    {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: '/placeholder-avatar.png',
      role: 'editor',
      status: 'active',
      joinedDate: '2023-02-01',
      lastActive: '5 minutes ago'
    },
    {
      id: '3',
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: '/placeholder-avatar.png',
      role: 'editor',
      status: 'active',
      joinedDate: '2023-02-15',
      lastActive: '2 hours ago'
    },
    {
      id: '4',
      name: 'Carol Davis',
      email: 'carol@example.com',
      avatar: '/placeholder-avatar.png',
      role: 'viewer',
      status: 'pending',
      joinedDate: '2023-03-01',
      lastActive: 'Never'
    }
  ];

  const workspaceProjects: WorkspaceProject[] = [
    {
      id: '1',
      name: 'Momentum Trading Strategy',
      description: 'Advanced momentum-based trading algorithm',
      type: 'strategy',
      members: ['1', '2', '3'],
      status: 'active',
      createdDate: '2023-02-01',
      lastModified: '2 hours ago'
    },
    {
      id: '2',
      name: 'Portfolio Risk Analysis',
      description: 'Comprehensive risk assessment framework',
      type: 'analysis',
      members: ['1', '2'],
      status: 'active',
      createdDate: '2023-02-15',
      lastModified: '1 day ago'
    },
    {
      id: '3',
      name: 'Q4 2023 Portfolio',
      description: 'Quarterly portfolio optimization project',
      type: 'portfolio',
      members: ['1', '2', '3', '4'],
      status: 'completed',
      createdDate: '2023-10-01',
      lastModified: '2 weeks ago'
    }
  ];

  const permissions: Permission[] = [
    {
      id: '1',
      name: 'Create Projects',
      description: 'Ability to create new projects and strategies',
      roles: { admin: true, editor: true, viewer: false }
    },
    {
      id: '2',
      name: 'Edit Strategies',
      description: 'Modify existing trading strategies',
      roles: { admin: true, editor: true, viewer: false }
    },
    {
      id: '3',
      name: 'View Analytics',
      description: 'Access to performance analytics and reports',
      roles: { admin: true, editor: true, viewer: true }
    },
    {
      id: '4',
      name: 'Manage Members',
      description: 'Invite, remove, and manage team members',
      roles: { admin: true, editor: false, viewer: false }
    },
    {
      id: '5',
      name: 'Execute Trades',
      description: 'Execute real trades using strategies',
      roles: { admin: true, editor: true, viewer: false }
    }
  ];

  const inviteMember = () => {
    if (!inviteEmail.trim()) return;
    
    console.log('Inviting member:', { email: inviteEmail, role: inviteRole });
    setInviteEmail('');
    setInviteRole('viewer');
  };

  const updateMemberRole = (memberId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    console.log('Updating member role:', { memberId, newRole });
  };

  const removeMember = (memberId: string) => {
    console.log('Removing member:', memberId);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'editor': return 'bg-blue-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return '⚡';
      case 'portfolio': return '📊';
      case 'analysis': return '🔍';
      default: return '📁';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Workspace Management
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Members</div>
                  <div className="text-2xl font-bold">{workspaceMembers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                  <div className="text-2xl font-bold">
                    {workspaceProjects.filter(p => p.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Online Now</div>
                  <div className="text-2xl font-bold">
                    {workspaceMembers.filter(m => m.lastActive === 'Now' || m.lastActive.includes('minutes')).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Storage Used</div>
                  <div className="text-2xl font-bold">2.4 GB</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm">Alice updated the Momentum Trading Strategy</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm">Bob created a new analysis report</div>
                      <div className="text-xs text-muted-foreground">5 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm">You invited Carol to the workspace</div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspaceProjects
                    .filter(project => project.status === 'active')
                    .map(project => (
                      <div key={project.id} className="flex items-center gap-3 p-2 border rounded">
                        <div className="text-2xl">{getProjectTypeIcon(project.type)}</div>
                        <div className="flex-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.members.length} members • {project.lastModified}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-6">
            {/* Invite New Member */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invite Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  
                  <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={inviteMember} disabled={!inviteEmail.trim()}>
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <div className="space-y-3">
              {workspaceMembers.map(member => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                        </div>
                        
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined {new Date(member.joinedDate).toLocaleDateString()} • 
                            Last active {member.lastActive}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline"
                          className={`${getRoleColor(member.role)} text-white border-none`}
                        >
                          {member.role}
                        </Badge>
                        
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                        
                        {member.id !== '1' && (
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Workspace Projects</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="space-y-4">
              {workspaceProjects.map(project => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{getProjectTypeIcon(project.type)}</div>
                        
                        <div>
                          <div className="font-semibold">{project.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {project.description}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Created {new Date(project.createdDate).toLocaleDateString()}</span>
                            <span>Modified {project.lastModified}</span>
                            <span>{project.members.length} members</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={project.status === 'active' ? 'default' : 'secondary'}
                        >
                          {project.status}
                        </Badge>
                        
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Members:</span>
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 4).map(memberId => {
                          const member = workspaceMembers.find(m => m.id === memberId);
                          return (
                            <Avatar key={memberId} className="w-6 h-6 border-2 border-white">
                              <AvatarImage src={member?.avatar} alt={member?.name} />
                              <AvatarFallback className="text-xs">{member?.name?.[0]}</AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {project.members.length > 4 && (
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs border-2 border-white">
                            +{project.members.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Role Permissions</h3>
              
              <div className="space-y-4">
                {permissions.map(permission => (
                  <Card key={permission.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {permission.description}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Admin</div>
                            <div className={`w-4 h-4 rounded ${permission.roles.admin ? 'bg-green-500' : 'bg-gray-300'}`} />
                          </div>
                          
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Editor</div>
                            <div className={`w-4 h-4 rounded ${permission.roles.editor ? 'bg-green-500' : 'bg-gray-300'}`} />
                          </div>
                          
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Viewer</div>
                            <div className={`w-4 h-4 rounded ${permission.roles.viewer ? 'bg-green-500' : 'bg-gray-300'}`} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamWorkspaceManagement;
