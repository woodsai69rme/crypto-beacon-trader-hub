
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WikiArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  category: string;
  source?: string;
  sourceType: 'manual' | 'chat' | 'pdf' | 'youtube' | 'web' | 'project';
  author: string;
  status: 'draft' | 'published' | 'archived';
  created: string;
  updated: string;
  views: number;
  ratings: number[];
  attachments: string[];
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  category: string;
  favicon?: string;
  screenshot?: string;
  isPrivate: boolean;
  created: string;
  updated: string;
  lastVisited?: string;
  visitCount: number;
  notes: string;
}

export interface EBook {
  id: string;
  title: string;
  author: string;
  description: string;
  chapters: EBookChapter[];
  cover?: string;
  tags: string[];
  status: 'draft' | 'published';
  format: 'pdf' | 'epub' | 'html' | 'markdown';
  created: string;
  updated: string;
  wordCount: number;
  downloadCount: number;
}

export interface EBookChapter {
  id: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
}

export interface ContentExtraction {
  id: string;
  source: string;
  type: 'youtube' | 'web' | 'pdf' | 'document';
  title: string;
  content: string;
  summary: string;
  metadata: Record<string, any>;
  status: 'processing' | 'completed' | 'error';
  created: string;
  tags: string[];
}

export interface SocialMediaPost {
  id: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'linkedin';
  content: string;
  mediaUrls: string[];
  tags: string[];
  scheduledFor?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  created: string;
  updated: string;
}

interface ContentState {
  // Wiki
  wikiArticles: WikiArticle[];
  selectedArticle: WikiArticle | null;
  
  // Bookmarks
  bookmarks: Bookmark[];
  bookmarkCategories: string[];
  
  // EBooks
  ebooks: EBook[];
  selectedEbook: EBook | null;
  
  // Content Extraction
  extractions: ContentExtraction[];
  
  // Social Media
  socialPosts: SocialMediaPost[];
  socialAccounts: Record<string, any>;
  
  // Search
  searchResults: any[];
  searchQuery: string;
  
  // Actions - Wiki
  addWikiArticle: (article: Omit<WikiArticle, 'id' | 'created' | 'updated'>) => void;
  updateWikiArticle: (id: string, updates: Partial<WikiArticle>) => void;
  deleteWikiArticle: (id: string) => void;
  generateWikiFromSource: (source: string, type: WikiArticle['sourceType']) => Promise<void>;
  
  // Actions - Bookmarks
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'created' | 'updated'>) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  bulkImportBookmarks: (data: string) => void;
  bulkExportBookmarks: (format: 'html' | 'csv' | 'json') => string;
  
  // Actions - EBooks
  addEbook: (ebook: Omit<EBook, 'id' | 'created' | 'updated'>) => void;
  updateEbook: (id: string, updates: Partial<EBook>) => void;
  deleteEbook: (id: string) => void;
  generateEbookFromProject: (projectId: string) => Promise<void>;
  exportEbook: (id: string, format: 'pdf' | 'epub' | 'html') => Promise<string>;
  
  // Actions - Content Extraction
  extractContent: (source: string, type: ContentExtraction['type']) => Promise<void>;
  deleteExtraction: (id: string) => void;
  
  // Actions - Social Media
  addSocialPost: (post: Omit<SocialMediaPost, 'id' | 'created' | 'updated'>) => void;
  updateSocialPost: (id: string, updates: Partial<SocialMediaPost>) => void;
  deleteSocialPost: (id: string) => void;
  schedulePost: (id: string, dateTime: string) => void;
  publishPost: (id: string) => Promise<void>;
  
  // Actions - Search
  searchContent: (query: string) => void;
  clearSearch: () => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      // Initial state
      wikiArticles: [],
      selectedArticle: null,
      bookmarks: [],
      bookmarkCategories: ['Tools', 'Resources', 'Learning', 'Entertainment', 'Work', 'Personal'],
      ebooks: [],
      selectedEbook: null,
      extractions: [],
      socialPosts: [],
      socialAccounts: {},
      searchResults: [],
      searchQuery: '',

      // Wiki actions
      addWikiArticle: (articleData) => {
        const article: WikiArticle = {
          ...articleData,
          id: `wiki-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          views: 0,
          ratings: [],
          attachments: []
        };
        set((state) => ({ wikiArticles: [...state.wikiArticles, article] }));
      },

      updateWikiArticle: (id, updates) => {
        set((state) => ({
          wikiArticles: state.wikiArticles.map(article =>
            article.id === id ? { ...article, ...updates, updated: new Date().toISOString() } : article
          )
        }));
      },

      deleteWikiArticle: (id) => {
        set((state) => ({
          wikiArticles: state.wikiArticles.filter(article => article.id !== id),
          selectedArticle: state.selectedArticle?.id === id ? null : state.selectedArticle
        }));
      },

      generateWikiFromSource: async (source, type) => {
        const extraction: ContentExtraction = {
          id: `extract-${Date.now()}`,
          source,
          type: type === 'chat' ? 'document' : type as ContentExtraction['type'],
          title: `Extracted from ${source}`,
          content: '',
          summary: '',
          metadata: {},
          status: 'processing',
          created: new Date().toISOString(),
          tags: []
        };
        
        set((state) => ({ extractions: [...state.extractions, extraction] }));

        try {
          // Simulate content extraction
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const extractedContent = `# Generated Content from ${source}\n\nThis is auto-generated content extracted from the source. The system analyzed the content and created this structured article.`;
          const summary = 'Auto-generated summary of the extracted content.';
          
          // Update extraction
          set((state) => ({
            extractions: state.extractions.map(ext =>
              ext.id === extraction.id 
                ? { ...ext, content: extractedContent, summary, status: 'completed' }
                : ext
            )
          }));

          // Create wiki article
          get().addWikiArticle({
            title: `Wiki: ${source}`,
            content: extractedContent,
            summary,
            tags: ['auto-generated'],
            category: 'Generated',
            source,
            sourceType: type,
            author: 'System',
            status: 'published'
          });
        } catch (error) {
          set((state) => ({
            extractions: state.extractions.map(ext =>
              ext.id === extraction.id 
                ? { ...ext, status: 'error' }
                : ext
            )
          }));
        }
      },

      // Bookmark actions
      addBookmark: (bookmarkData) => {
        const bookmark: Bookmark = {
          ...bookmarkData,
          id: `bookmark-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          visitCount: 0,
          notes: ''
        };
        set((state) => ({ bookmarks: [...state.bookmarks, bookmark] }));
      },

      updateBookmark: (id, updates) => {
        set((state) => ({
          bookmarks: state.bookmarks.map(bookmark =>
            bookmark.id === id ? { ...bookmark, ...updates, updated: new Date().toISOString() } : bookmark
          )
        }));
      },

      deleteBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== id)
        }));
      },

      bulkImportBookmarks: (data) => {
        try {
          // Handle different formats
          let bookmarks: any[] = [];
          
          if (data.startsWith('<')) {
            // HTML format (browser export)
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const links = doc.querySelectorAll('a');
            bookmarks = Array.from(links).map(link => ({
              title: link.textContent || 'Untitled',
              url: link.href,
              description: '',
              tags: [],
              category: 'Imported',
              isPrivate: false
            }));
          } else {
            // JSON format
            bookmarks = JSON.parse(data);
          }

          bookmarks.forEach(b => get().addBookmark(b));
        } catch (error) {
          console.error('Failed to import bookmarks:', error);
        }
      },

      bulkExportBookmarks: (format) => {
        const bookmarks = get().bookmarks;
        
        switch (format) {
          case 'html':
            return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<HTML>
<HEAD>
<TITLE>Bookmarks</TITLE>
</HEAD>
<BODY>
<H1>Bookmarks</H1>
<DL>
${bookmarks.map(b => `<DT><A HREF="${b.url}">${b.title}</A>`).join('\n')}
</DL>
</BODY>
</HTML>`;
          
          case 'csv':
            const csvHeader = 'Title,URL,Description,Tags,Category\n';
            const csvRows = bookmarks.map(b => 
              `"${b.title}","${b.url}","${b.description}","${b.tags.join(';')}","${b.category}"`
            ).join('\n');
            return csvHeader + csvRows;
          
          case 'json':
          default:
            return JSON.stringify(bookmarks, null, 2);
        }
      },

      // EBook actions
      addEbook: (ebookData) => {
        const ebook: EBook = {
          ...ebookData,
          id: `ebook-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          wordCount: 0,
          downloadCount: 0
        };
        set((state) => ({ ebooks: [...state.ebooks, ebook] }));
      },

      updateEbook: (id, updates) => {
        set((state) => ({
          ebooks: state.ebooks.map(ebook =>
            ebook.id === id ? { ...ebook, ...updates, updated: new Date().toISOString() } : ebook
          )
        }));
      },

      deleteEbook: (id) => {
        set((state) => ({
          ebooks: state.ebooks.filter(ebook => ebook.id !== id),
          selectedEbook: state.selectedEbook?.id === id ? null : state.selectedEbook
        }));
      },

      generateEbookFromProject: async (projectId) => {
        // Simulate ebook generation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const ebook: Omit<EBook, 'id' | 'created' | 'updated'> = {
          title: `Project Guide: ${projectId}`,
          author: 'ZeroOne Generator',
          description: 'Auto-generated guide from project data',
          chapters: [
            {
              id: 'ch1',
              title: 'Introduction',
              content: 'This is an auto-generated ebook from your project.',
              order: 1,
              wordCount: 100
            },
            {
              id: 'ch2',
              title: 'Project Overview',
              content: 'Detailed overview of the project components and features.',
              order: 2,
              wordCount: 250
            }
          ],
          tags: ['auto-generated', 'project'],
          status: 'published',
          format: 'pdf',
          wordCount: 350,
          downloadCount: 0
        };
        
        get().addEbook(ebook);
      },

      exportEbook: async (id, format) => {
        const ebook = get().ebooks.find(e => e.id === id);
        if (!ebook) throw new Error('EBook not found');
        
        // Simulate export
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Return download URL or file content
        return `data:application/${format};base64,${btoa('Mock ebook content')}`;
      },

      // Content extraction actions
      extractContent: async (source, type) => {
        const extraction: ContentExtraction = {
          id: `extract-${Date.now()}`,
          source,
          type,
          title: `Extracted: ${source}`,
          content: '',
          summary: '',
          metadata: {},
          status: 'processing',
          created: new Date().toISOString(),
          tags: []
        };
        
        set((state) => ({ extractions: [...state.extractions, extraction] }));

        try {
          // Simulate extraction process
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const content = `Extracted content from ${source}. This would contain the actual extracted and processed content.`;
          const summary = 'AI-generated summary of the extracted content.';
          
          set((state) => ({
            extractions: state.extractions.map(ext =>
              ext.id === extraction.id 
                ? { ...ext, content, summary, status: 'completed' }
                : ext
            )
          }));
        } catch (error) {
          set((state) => ({
            extractions: state.extractions.map(ext =>
              ext.id === extraction.id 
                ? { ...ext, status: 'error' }
                : ext
            )
          }));
        }
      },

      deleteExtraction: (id) => {
        set((state) => ({
          extractions: state.extractions.filter(ext => ext.id !== id)
        }));
      },

      // Social media actions
      addSocialPost: (postData) => {
        const post: SocialMediaPost = {
          ...postData,
          id: `post-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        };
        set((state) => ({ socialPosts: [...state.socialPosts, post] }));
      },

      updateSocialPost: (id, updates) => {
        set((state) => ({
          socialPosts: state.socialPosts.map(post =>
            post.id === id ? { ...post, ...updates, updated: new Date().toISOString() } : post
          )
        }));
      },

      deleteSocialPost: (id) => {
        set((state) => ({
          socialPosts: state.socialPosts.filter(post => post.id !== id)
        }));
      },

      schedulePost: (id, dateTime) => {
        get().updateSocialPost(id, { 
          scheduledFor: dateTime, 
          status: 'scheduled' 
        });
      },

      publishPost: async (id) => {
        const post = get().socialPosts.find(p => p.id === id);
        if (!post) return;

        get().updateSocialPost(id, { status: 'publishing' });
        
        try {
          // Simulate publishing
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          get().updateSocialPost(id, { 
            status: 'published',
            publishedAt: new Date().toISOString(),
            analytics: {
              views: 0,
              likes: 0,
              shares: 0,
              comments: 0
            }
          });
        } catch (error) {
          get().updateSocialPost(id, { status: 'failed' });
        }
      },

      // Search actions
      searchContent: (query) => {
        const state = get();
        const results: any[] = [];
        
        // Search wiki articles
        state.wikiArticles.forEach(article => {
          if (article.title.toLowerCase().includes(query.toLowerCase()) ||
              article.content.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'wiki', item: article });
          }
        });
        
        // Search bookmarks
        state.bookmarks.forEach(bookmark => {
          if (bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
              bookmark.description.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'bookmark', item: bookmark });
          }
        });
        
        // Search ebooks
        state.ebooks.forEach(ebook => {
          if (ebook.title.toLowerCase().includes(query.toLowerCase()) ||
              ebook.description.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'ebook', item: ebook });
          }
        });

        set({ searchResults: results, searchQuery: query });
      },

      clearSearch: () => {
        set({ searchResults: [], searchQuery: '' });
      }
    }),
    {
      name: 'content-store',
      partialize: (state) => ({
        wikiArticles: state.wikiArticles,
        bookmarks: state.bookmarks,
        bookmarkCategories: state.bookmarkCategories,
        ebooks: state.ebooks,
        extractions: state.extractions,
        socialPosts: state.socialPosts,
        socialAccounts: state.socialAccounts
      })
    }
  )
);
