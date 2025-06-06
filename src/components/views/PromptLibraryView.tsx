
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIStore, Prompt } from '@/stores/useAIStore';
import { 
  MessageSquare, Plus, Star, Download, Upload, Copy, 
  BarChart3, Tag, Heart, TrendingUp, Search, Filter 
} from 'lucide-react';

const PromptLibraryView: React.FC = () => {
  const {
    prompts,
    promptCategories,
    addPrompt,
    updatePrompt,
    deletePrompt,
    ratePrompt,
    toggleFavorite,
    incrementUsage,
    bulkExportPrompts,
    bulkImportPrompts
  } = useAIStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleCreatePrompt = () => {
    if (!newPrompt.title || !newPrompt.content) return;

    addPrompt({
      ...newPrompt,
      tags: newPrompt.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setNewPrompt({
      title: '',
      content: '',
      category: 'General',
      tags: ''
    });
    setIsCreating(false);
  };

  const handleUpdatePrompt = (id: string) => {
    if (!newPrompt.title || !newPrompt.content) return;

    updatePrompt(id, {
      ...newPrompt,
      tags: newPrompt.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setEditingId(null);
    setNewPrompt({
      title: '',
      content: '',
      category: 'General',
      tags: ''
    });
    setIsCreating(false);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setNewPrompt({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags.join(', ')
    });
    setEditingId(prompt.id);
    setIsCreating(true);
  };

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleUsePrompt = (id: string) => {
    incrementUsage(id);
    // Copy to clipboard or send to chat
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      navigator.clipboard.writeText(prompt.content);
    }
  };

  const handleExport = () => {
    const data = bulkExportPrompts();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompts-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importData) return;
    bulkImportPrompts(importData);
    setImportData('');
    setShowImport(false);
  };

  const filteredPrompts = prompts
    .filter(prompt => {
      const matchesSearch = !searchQuery || 
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'usage':
          return b.usage - a.usage;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
        default:
          return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
    });

  const topPrompts = prompts
    .filter(p => p.usage > 0)
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  const favoritePrompts = prompts.filter(p => p.favorite);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-green-400" />
            Prompt Library
          </h1>
          <p className="text-muted-foreground">Organize, rate, and share your AI prompts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Prompt
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Prompts</p>
                <p className="text-2xl font-bold">{prompts.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{favoritePrompts.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{promptCategories.length}</p>
              </div>
              <Tag className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{prompts.reduce((sum, p) => sum + p.usage, 0)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {promptCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Recently Created</SelectItem>
                <SelectItem value="title">Alphabetical</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="usage">Most Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Top Prompts */}
      {topPrompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Used Prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPrompts.map((prompt, index) => (
                <div key={prompt.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-green-400">#{index + 1}</span>
                    <Badge variant="outline">{prompt.usage} uses</Badge>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2">{prompt.title}</h4>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{prompt.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Modal */}
      {showImport && (
        <Card>
          <CardHeader>
            <CardTitle>Import Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste JSON data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={8}
            />
            <div className="flex gap-2">
              <Button onClick={handleImport}>Import</Button>
              <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Prompt */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Prompt' : 'Create New Prompt'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Prompt title"
                value={newPrompt.title}
                onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
              />
              <Select value={newPrompt.category} onValueChange={(value) => setNewPrompt({ ...newPrompt, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {promptCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Prompt content"
              value={newPrompt.content}
              onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
              rows={8}
            />
            
            <Input
              placeholder="Tags (comma separated)"
              value={newPrompt.tags}
              onChange={(e) => setNewPrompt({ ...newPrompt, tags: e.target.value })}
            />
            
            <div className="flex gap-2">
              <Button onClick={editingId ? () => handleUpdatePrompt(editingId) : handleCreatePrompt}>
                {editingId ? 'Update' : 'Create'} Prompt
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setNewPrompt({
                    title: '',
                    content: '',
                    category: 'General',
                    tags: ''
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{prompt.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{prompt.category}</Badge>
                    {prompt.favorite && (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(prompt.id)}
                >
                  <Heart className={`h-4 w-4 ${prompt.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                {prompt.content}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {prompt.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{prompt.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    {prompt.usage} uses
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{prompt.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleUsePrompt(prompt.id)}>
                  Use
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCopyPrompt(prompt.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditPrompt(prompt)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => deletePrompt(prompt.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Prompts Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No prompts match your search.' : 'Create your first prompt to get started.'}
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Prompt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptLibraryView;
