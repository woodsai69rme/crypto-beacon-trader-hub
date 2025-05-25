
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitBranch, Clock, User, FileText, ArrowLeft, ArrowRight } from "lucide-react";

interface StrategyVersion {
  id: string;
  version: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  commitMessage: string;
  changes: {
    added: string[];
    modified: string[];
    removed: string[];
  };
  isCurrent: boolean;
  isStable: boolean;
}

interface Branch {
  id: string;
  name: string;
  author: string;
  lastCommit: string;
  commitsAhead: number;
  commitsBehind: number;
  status: 'active' | 'merged' | 'abandoned';
}

const VersionControlSystem: React.FC = () => {
  const [currentBranch, setCurrentBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const versions: StrategyVersion[] = [
    {
      id: '1',
      version: '3.2.1',
      author: 'You',
      authorAvatar: '/placeholder-avatar.png',
      timestamp: '2 hours ago',
      commitMessage: 'Optimized risk management parameters',
      changes: {
        added: ['Stop loss automation'],
        modified: ['Risk threshold settings', 'Position sizing algorithm'],
        removed: []
      },
      isCurrent: true,
      isStable: true
    },
    {
      id: '2',
      version: '3.2.0',
      author: 'Alice Johnson',
      authorAvatar: '/placeholder-avatar.png',
      timestamp: '1 day ago',
      commitMessage: 'Added momentum indicators integration',
      changes: {
        added: ['MACD indicator', 'RSI momentum filter'],
        modified: ['Entry conditions', 'Signal processing'],
        removed: ['Legacy momentum calculation']
      },
      isCurrent: false,
      isStable: true
    },
    {
      id: '3',
      version: '3.1.5',
      author: 'Bob Smith',
      authorAvatar: '/placeholder-avatar.png',
      timestamp: '3 days ago',
      commitMessage: 'Performance improvements and bug fixes',
      changes: {
        added: [],
        modified: ['Execution speed optimization', 'Memory usage'],
        removed: ['Deprecated functions']
      },
      isCurrent: false,
      isStable: true
    },
    {
      id: '4',
      version: '3.1.4-beta',
      author: 'Carol Davis',
      authorAvatar: '/placeholder-avatar.png',
      timestamp: '5 days ago',
      commitMessage: 'Experimental ML feature testing',
      changes: {
        added: ['Neural network prediction module'],
        modified: ['Data preprocessing pipeline'],
        removed: []
      },
      isCurrent: false,
      isStable: false
    }
  ];

  const branches: Branch[] = [
    {
      id: '1',
      name: 'main',
      author: 'You',
      lastCommit: '2 hours ago',
      commitsAhead: 0,
      commitsBehind: 0,
      status: 'active'
    },
    {
      id: '2',
      name: 'feature/advanced-ml',
      author: 'Alice Johnson',
      lastCommit: '6 hours ago',
      commitsAhead: 3,
      commitsBehind: 1,
      status: 'active'
    },
    {
      id: '3',
      name: 'hotfix/risk-calculation',
      author: 'Bob Smith',
      lastCommit: '2 days ago',
      commitsAhead: 1,
      commitsBehind: 5,
      status: 'merged'
    }
  ];

  const commitChanges = () => {
    if (!commitMessage.trim()) return;
    
    console.log('Committing changes:', commitMessage);
    setCommitMessage('');
  };

  const revertToVersion = (versionId: string) => {
    console.log('Reverting to version:', versionId);
  };

  const createBranch = () => {
    console.log('Creating new branch');
  };

  const mergeBranch = (branchId: string) => {
    console.log('Merging branch:', branchId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'merged': return 'bg-blue-500';
      case 'abandoned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Strategy Version Control
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Version History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Version History</h3>
            
            <div className="space-y-3">
              {versions.map(version => (
                <Card key={version.id} className={version.isCurrent ? 'ring-2 ring-blue-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={version.authorAvatar} alt={version.author} />
                          <AvatarFallback>{version.author[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{version.version}</span>
                            {version.isCurrent && <Badge variant="default">Current</Badge>}
                            {version.isStable && <Badge variant="outline">Stable</Badge>}
                            {!version.isStable && <Badge variant="destructive">Beta</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            by {version.author} • {version.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{version.commitMessage}</p>
                    
                    <div className="space-y-2 mb-3">
                      {version.changes.added.length > 0 && (
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">Added: </span>
                          <span>{version.changes.added.join(', ')}</span>
                        </div>
                      )}
                      
                      {version.changes.modified.length > 0 && (
                        <div className="text-sm">
                          <span className="text-blue-600 font-medium">Modified: </span>
                          <span>{version.changes.modified.join(', ')}</span>
                        </div>
                      )}
                      
                      {version.changes.removed.length > 0 && (
                        <div className="text-sm">
                          <span className="text-red-600 font-medium">Removed: </span>
                          <span>{version.changes.removed.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedVersion(version.id)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {!version.isCurrent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => revertToVersion(version.id)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Revert
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Branches and Commit */}
          <div className="space-y-6">
            {/* Current Branch */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Branch: {currentBranch}</h3>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Commit Message</label>
                    <Textarea
                      placeholder="Describe your changes..."
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={commitChanges}
                    disabled={!commitMessage.trim()}
                    className="w-full"
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Commit Changes
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Branches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Branches</h3>
                <Button variant="outline" size="sm" onClick={createBranch}>
                  Create Branch
                </Button>
              </div>
              
              <div className="space-y-2">
                {branches.map(branch => (
                  <Card key={branch.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(branch.status)}`} />
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{branch.name}</span>
                              {branch.name === currentBranch && (
                                <Badge variant="default" className="text-xs">Current</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              by {branch.author} • {branch.lastCommit}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {branch.commitsAhead > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              {branch.commitsAhead}
                            </Badge>
                          )}
                          
                          {branch.commitsBehind > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <ArrowLeft className="h-3 w-3 mr-1" />
                              {branch.commitsBehind}
                            </Badge>
                          )}
                          
                          {branch.status === 'active' && branch.name !== currentBranch && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => mergeBranch(branch.id)}
                            >
                              Merge
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Repository Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Commits</div>
                    <div className="font-semibold">47</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Contributors</div>
                    <div className="font-semibold">4</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Active Branches</div>
                    <div className="font-semibold">2</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last Activity</div>
                    <div className="font-semibold">2 hours ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionControlSystem;
