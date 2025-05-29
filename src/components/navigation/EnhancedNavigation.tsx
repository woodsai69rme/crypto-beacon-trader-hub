
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Bot, 
  Wallet, 
  Settings, 
  Newspaper, 
  BarChart3, 
  Shield, 
  Zap,
  Globe,
  Users,
  BookOpen,
  Target,
  Activity,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  badge?: string | number;
  isNew?: boolean;
  children?: NavigationItem[];
}

const EnhancedNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['trading', 'ai']);
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/'
    },
    {
      id: 'trading',
      label: 'Trading',
      icon: TrendingUp,
      children: [
        {
          id: 'real-trading',
          label: 'Real Trading',
          icon: Target,
          path: '/trading/real',
          badge: 'Live'
        },
        {
          id: 'paper-trading',
          label: 'Paper Trading',
          icon: Activity,
          path: '/trading/paper'
        },
        {
          id: 'advanced-trading',
          label: 'Advanced Trading',
          icon: Zap,
          path: '/trading/advanced',
          isNew: true
        },
        {
          id: 'exchange-integration',
          label: 'Exchange Integration',
          icon: Globe,
          path: '/trading/exchanges'
        },
        {
          id: 'order-history',
          label: 'Order History',
          icon: BarChart3,
          path: '/trading/history'
        }
      ]
    },
    {
      id: 'ai',
      label: 'AI Trading',
      icon: Bot,
      children: [
        {
          id: 'ai-bots',
          label: 'Trading Bots',
          icon: Bot,
          path: '/ai/bots',
          badge: 5
        },
        {
          id: 'ai-strategies',
          label: 'AI Strategies',
          icon: Target,
          path: '/ai/strategies'
        },
        {
          id: 'ai-insights',
          label: 'Market Insights',
          icon: BarChart3,
          path: '/ai/insights'
        },
        {
          id: 'ai-models',
          label: 'Model Management',
          icon: Settings,
          path: '/ai/models',
          isNew: true
        }
      ]
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: Wallet,
      children: [
        {
          id: 'portfolio-overview',
          label: 'Overview',
          icon: BarChart3,
          path: '/portfolio'
        },
        {
          id: 'portfolio-analytics',
          label: 'Analytics',
          icon: Activity,
          path: '/portfolio/analytics'
        },
        {
          id: 'portfolio-optimization',
          label: 'Optimization',
          icon: Target,
          path: '/portfolio/optimization'
        },
        {
          id: 'risk-management',
          label: 'Risk Management',
          icon: Shield,
          path: '/portfolio/risk'
        }
      ]
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: Zap,
      children: [
        {
          id: 'n8n-workflows',
          label: 'N8N Workflows',
          icon: Zap,
          path: '/automation/n8n',
          isNew: true
        },
        {
          id: 'alerts',
          label: 'Alerts & Signals',
          icon: Bell,
          path: '/automation/alerts'
        },
        {
          id: 'webhooks',
          label: 'Webhooks',
          icon: Globe,
          path: '/automation/webhooks'
        }
      ]
    },
    {
      id: 'market',
      label: 'Market Data',
      icon: BarChart3,
      children: [
        {
          id: 'market-overview',
          label: 'Market Overview',
          icon: BarChart3,
          path: '/market'
        },
        {
          id: 'news-feed',
          label: 'News & Sentiment',
          icon: Newspaper,
          path: '/market/news'
        },
        {
          id: 'correlations',
          label: 'Correlations',
          icon: Activity,
          path: '/market/correlations'
        },
        {
          id: 'on-chain',
          label: 'On-Chain Data',
          icon: Globe,
          path: '/market/onchain',
          isNew: true
        }
      ]
    },
    {
      id: 'social',
      label: 'Social Trading',
      icon: Users,
      children: [
        {
          id: 'copy-trading',
          label: 'Copy Trading',
          icon: Users,
          path: '/social/copy'
        },
        {
          id: 'leaderboard',
          label: 'Leaderboard',
          icon: Target,
          path: '/social/leaderboard'
        },
        {
          id: 'competitions',
          label: 'Competitions',
          icon: Trophy,
          path: '/social/competitions'
        }
      ]
    },
    {
      id: 'education',
      label: 'Education',
      icon: BookOpen,
      children: [
        {
          id: 'tutorials',
          label: 'Tutorials',
          icon: BookOpen,
          path: '/education/tutorials'
        },
        {
          id: 'glossary',
          label: 'Glossary',
          icon: Search,
          path: '/education/glossary'
        },
        {
          id: 'market-analysis',
          label: 'Market Analysis',
          icon: BarChart3,
          path: '/education/analysis'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings'
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const Icon = item.icon;
    const isActive = isItemActive(item);
    const isExpanded = expandedSections.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <Collapsible key={item.id} open={isExpanded} onOpenChange={() => toggleSection(item.id)}>
          <CollapsibleTrigger asChild>
            <Button 
              variant={isActive ? "secondary" : "ghost"} 
              className={`w-full justify-between text-left ${level > 0 ? 'ml-4' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                {item.badge && (
                  <Badge variant="outline" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path!}
        className={({ isActive }) => 
          `block ${level > 0 ? 'ml-6' : ''}`
        }
      >
        <Button 
          variant={isActive ? "secondary" : "ghost"} 
          className="w-full justify-start text-left"
        >
          <Icon className="h-4 w-4 mr-2" />
          <span>{item.label}</span>
          {item.isNew && <Badge variant="secondary" className="ml-2 text-xs">New</Badge>}
          {item.badge && (
            <Badge variant="outline" className="ml-2 text-xs">
              {item.badge}
            </Badge>
          )}
        </Button>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Sidebar */}
      <nav className={`
        fixed left-0 top-0 h-full w-64 bg-background border-r border-border
        transform transition-transform duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-lg font-semibold">Crypto Trading Platform</h1>
            <p className="text-sm text-muted-foreground">AUD Base Currency</p>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map(item => renderNavigationItem(item))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant="outline" className="text-xs">
                  Online
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <Badge variant="secondary" className="text-xs">
                  Paper Trading
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Version:</span>
                <span>v2.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Spacer */}
      <div className="lg:ml-64">
        {/* Content goes here */}
      </div>
    </>
  );
};

export default EnhancedNavigation;
