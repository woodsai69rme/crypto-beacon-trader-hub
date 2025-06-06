
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  created: string;
  updated: string;
  tags: string[];
  category: string;
  tasks: Task[];
  files: ProjectFile[];
  collaborators: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: string;
  created: string;
  updated: string;
  tags: string[];
  projectId: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'markdown' | 'pdf' | 'image' | 'code';
  size: number;
  created: string;
  updated: string;
  tags: string[];
  projectId?: string;
  path: string;
  metadata: Record<string, any>;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created: string;
  updated: string;
  tags: string[];
  summary?: string;
  projectId?: string;
  archived: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  created: string;
  projectId: string;
}

export interface ViewType {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  category: 'core' | 'ai' | 'content' | 'crypto' | 'tools';
}

interface AppState {
  // Current view
  currentView: string;
  
  // Projects
  projects: Project[];
  selectedProject: Project | null;
  
  // Tasks
  tasks: Task[];
  
  // Documents
  documents: Document[];
  selectedDocument: Document | null;
  
  // Conversations
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  
  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Search
  globalSearchQuery: string;
  searchResults: any[];
  
  // Views
  views: ViewType[];
  
  // Actions - Navigation
  setCurrentView: (view: string) => void;
  
  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'created' | 'updated'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (project: Project | null) => void;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'created' | 'updated'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Actions - Documents
  addDocument: (document: Omit<Document, 'id' | 'created' | 'updated'>) => string;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  selectDocument: (document: Document | null) => void;
  
  // Actions - Conversations
  addConversation: (conversation: Omit<Conversation, 'id' | 'created' | 'updated'>) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  selectConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  
  // Actions - UI
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Actions - Search
  setGlobalSearch: (query: string) => void;
  performGlobalSearch: (query: string) => void;
  clearSearch: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentView: 'chat',
      projects: [],
      selectedProject: null,
      tasks: [],
      documents: [],
      selectedDocument: null,
      conversations: [],
      selectedConversation: null,
      sidebarCollapsed: false,
      theme: 'dark',
      globalSearchQuery: '',
      searchResults: [],
      
      views: [
        // Core Views
        { id: 'chat', name: 'AI Chat', icon: 'MessageSquare', description: 'Chat with AI assistants', category: 'core' },
        { id: 'projects', name: 'Projects', icon: 'FolderOpen', description: 'Project management', category: 'core' },
        { id: 'documents', name: 'Documents', icon: 'FileText', description: 'Document management', category: 'core' },
        { id: 'workflow', name: 'Workflows', icon: 'Workflow', description: 'Automation workflows', category: 'core' },
        
        // AI Tools
        { id: 'wiki', name: 'AI Wiki', icon: 'BookOpen', description: 'AI-powered knowledge base', badge: 'AI', category: 'ai' },
        { id: 'prompts', name: 'Prompt Library', icon: 'MessageSquare', description: 'Manage AI prompts', badge: 'AI', category: 'ai' },
        { id: 'agents', name: 'AI Agents', icon: 'Bot', description: 'Autonomous AI agents', badge: 'AI', category: 'ai' },
        { id: 'ai-tools', name: 'AI Tools', icon: 'Zap', description: 'AI toolkit suite', badge: 'AI', category: 'ai' },
        
        // Content Tools
        { id: 'bookmarks', name: 'Bookmarks', icon: 'Bookmark', description: 'Bookmark manager', category: 'content' },
        { id: 'ebooks', name: 'E-Books', icon: 'Book', description: 'E-book generator', category: 'content' },
        { id: 'social', name: 'Social Media', icon: 'Share2', description: 'Social media toolkit', category: 'content' },
        { id: 'content-extraction', name: 'Content Extractor', icon: 'Download', description: 'Extract content from sources', category: 'content' },
        
        // Crypto Tools
        { id: 'crypto-trading', name: 'Crypto Trading', icon: 'TrendingUp', description: 'Crypto trading dashboard', badge: 'CRYPTO', category: 'crypto' },
        { id: 'mining', name: 'Mining', icon: 'Cpu', description: 'Crypto mining tools', badge: 'CRYPTO', category: 'crypto' },
        { id: 'defi', name: 'DeFi', icon: 'Coins', description: 'DeFi protocols', badge: 'CRYPTO', category: 'crypto' },
        
        // Developer Tools
        { id: 'dev-tools', name: 'Dev Tools', icon: 'Code', description: 'Development toolkit', badge: 'DEV', category: 'tools' },
        { id: 'api-tools', name: 'API Tools', icon: 'Globe', description: 'API testing and management', badge: 'DEV', category: 'tools' },
        { id: 'analytics', name: 'Analytics', icon: 'BarChart3', description: 'Analytics dashboard', category: 'tools' },
        { id: 'resume-builder', name: 'Resume Builder', icon: 'FileUser', description: 'AI resume builder', category: 'tools' },
        
        // Utility Tools
        { id: 'osint', name: 'OSINT', icon: 'Search', description: 'Intelligence gathering', badge: 'OSINT', category: 'tools' },
        { id: 'monitoring', name: 'Monitoring', icon: 'Eye', description: 'Content monitoring', category: 'tools' },
        { id: 'settings', name: 'Settings', icon: 'Settings', description: 'Application settings', category: 'tools' }
      ],

      // Navigation actions
      setCurrentView: (view) => {
        set({ currentView: view });
      },

      // Project actions
      addProject: (projectData) => {
        const project: Project = {
          ...projectData,
          id: `project-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          tasks: [],
          files: [],
          collaborators: []
        };
        set((state) => ({ projects: [...state.projects, project] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id ? { ...project, ...updates, updated: new Date().toISOString() } : project
          )
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id),
          selectedProject: state.selectedProject?.id === id ? null : state.selectedProject
        }));
      },

      selectProject: (project) => {
        set({ selectedProject: project });
      },

      // Task actions
      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates, updated: new Date().toISOString() } : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },

      // Document actions
      addDocument: (documentData) => {
        const document: Document = {
          ...documentData,
          id: `doc-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        };
        set((state) => ({ documents: [...state.documents, document] }));
        return document.id;
      },

      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map(doc =>
            doc.id === id ? { ...doc, ...updates, updated: new Date().toISOString() } : doc
          )
        }));
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter(doc => doc.id !== id),
          selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument
        }));
      },

      selectDocument: (document) => {
        set({ selectedDocument: document });
      },

      // Conversation actions
      addConversation: (conversationData) => {
        const conversation: Conversation = {
          ...conversationData,
          id: `conv-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          archived: false
        };
        set((state) => ({ conversations: [...state.conversations, conversation] }));
      },

      updateConversation: (id, updates) => {
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, ...updates, updated: new Date().toISOString() } : conv
          )
        }));
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter(conv => conv.id !== id),
          selectedConversation: state.selectedConversation?.id === id ? null : state.selectedConversation
        }));
      },

      selectConversation: (conversation) => {
        set({ selectedConversation: conversation });
      },

      addMessage: (conversationId, messageData) => {
        const message: Message = {
          ...messageData,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId 
              ? { ...conv, messages: [...conv.messages, message], updated: new Date().toISOString() }
              : conv
          )
        }));
      },

      // UI actions
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setTheme: (theme) => {
        set({ theme });
      },

      // Search actions
      setGlobalSearch: (query) => {
        set({ globalSearchQuery: query });
      },

      performGlobalSearch: (query) => {
        const state = get();
        const results: any[] = [];

        // Search projects
        state.projects.forEach(project => {
          if (project.title.toLowerCase().includes(query.toLowerCase()) ||
              project.description.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'project', item: project });
          }
        });

        // Search documents
        state.documents.forEach(doc => {
          if (doc.title.toLowerCase().includes(query.toLowerCase()) ||
              doc.content.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'document', item: doc });
          }
        });

        // Search conversations
        state.conversations.forEach(conv => {
          if (conv.title.toLowerCase().includes(query.toLowerCase()) ||
              conv.messages.some(msg => msg.content.toLowerCase().includes(query.toLowerCase()))) {
            results.push({ type: 'conversation', item: conv });
          }
        });

        // Search tasks
        state.tasks.forEach(task => {
          if (task.title.toLowerCase().includes(query.toLowerCase()) ||
              task.description.toLowerCase().includes(query.toLowerCase())) {
            results.push({ type: 'task', item: task });
          }
        });

        set({ searchResults: results, globalSearchQuery: query });
      },

      clearSearch: () => {
        set({ searchResults: [], globalSearchQuery: '' });
      }
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        currentView: state.currentView,
        projects: state.projects,
        tasks: state.tasks,
        documents: state.documents,
        conversations: state.conversations,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme
      })
    }
  )
);
