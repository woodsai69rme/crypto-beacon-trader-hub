
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContentStore, WikiArticle } from '@/stores/useContentStore';
import { BookOpen, Plus, Search, Upload, Youtube, Globe, FileText, Star, Eye, Calendar, Tag } from 'lucide-react';

const WikiView: React.FC = () => {
  const {
    wikiArticles,
    selectedArticle,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
    generateWikiFromSource,
    searchContent,
    searchResults,
    searchQuery,
    clearSearch
  } = useContentStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    summary: '',
    tags: '',
    category: 'General',
    author: 'User'
  });
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceType, setSourceType] = useState<'youtube' | 'web' | 'pdf'>('web');
  const [filter, setFilter] = useState('all');

  const categories = ['General', 'Technology', 'Research', 'How-to', 'Reference', 'Generated'];

  const handleCreateArticle = () => {
    if (!newArticle.title || !newArticle.content) return;

    addWikiArticle({
      ...newArticle,
      tags: newArticle.tags.split(',').map(t => t.trim()).filter(Boolean),
      sourceType: 'manual',
      status: 'published'
    });

    setNewArticle({
      title: '',
      content: '',
      summary: '',
      tags: '',
      category: 'General',
      author: 'User'
    });
    setIsCreating(false);
  };

  const handleUpdateArticle = (id: string) => {
    if (!newArticle.title || !newArticle.content) return;

    updateWikiArticle(id, {
      ...newArticle,
      tags: newArticle.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setEditingId(null);
    setNewArticle({
      title: '',
      content: '',
      summary: '',
      tags: '',
      category: 'General',
      author: 'User'
    });
  };

  const handleEditArticle = (article: WikiArticle) => {
    setNewArticle({
      title: article.title,
      content: article.content,
      summary: article.summary,
      tags: article.tags.join(', '),
      category: article.category,
      author: article.author
    });
    setEditingId(article.id);
    setIsCreating(true);
  };

  const handleGenerateFromSource = async () => {
    if (!sourceUrl) return;
    await generateWikiFromSource(sourceUrl, sourceType);
    setSourceUrl('');
  };

  const filteredArticles = wikiArticles.filter(article => {
    if (filter === 'all') return true;
    if (filter === 'published') return article.status === 'published';
    if (filter === 'draft') return article.status === 'draft';
    if (filter === 'generated') return article.sourceType !== 'manual';
    return true;
  });

  const displayArticles = searchQuery ? 
    searchResults.filter(r => r.type === 'wiki').map(r => r.item) : 
    filteredArticles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-green-400" />
            AI-Powered Wiki
          </h1>
          <p className="text-muted-foreground">Knowledge base with auto-generation from any source</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => searchContent(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Articles</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="generated">Auto-Generated</SelectItem>
              </SelectContent>
            </Select>
            {searchQuery && (
              <Button variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>

          {/* Auto-generation */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Generate from Source</h3>
            <div className="flex gap-2">
              <Select value={sourceType} onValueChange={(value: any) => setSourceType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Web
                    </div>
                  </SelectItem>
                  <SelectItem value="youtube">
                    <div className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Enter URL or upload file..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGenerateFromSource}>
                <Upload className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Article */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Article' : 'Create New Article'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Article title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              />
              <Select value={newArticle.category} onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Article summary"
              value={newArticle.summary}
              onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
              rows={2}
            />
            
            <Textarea
              placeholder="Article content (Markdown supported)"
              value={newArticle.content}
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
              rows={10}
            />
            
            <Input
              placeholder="Tags (comma separated)"
              value={newArticle.tags}
              onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
            />
            
            <div className="flex gap-2">
              <Button onClick={editingId ? () => handleUpdateArticle(editingId) : handleCreateArticle}>
                {editingId ? 'Update' : 'Create'} Article
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setNewArticle({
                    title: '',
                    content: '',
                    summary: '',
                    tags: '',
                    category: 'General',
                    author: 'User'
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map((article: WikiArticle) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {article.status}
                    </Badge>
                    <Badge variant="outline">{article.category}</Badge>
                    {article.sourceType !== 'manual' && (
                      <Badge variant="secondary">Auto-generated</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {article.summary || article.content.substring(0, 150) + '...'}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {article.ratings.length > 0 
                      ? (article.ratings.reduce((a, b) => a + b, 0) / article.ratings.length).toFixed(1)
                      : '0'
                    }
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.created).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteWikiArticle(article.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayArticles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Articles Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No articles match your search.' : 'Create your first wiki article or generate one from a source.'}
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WikiView;
