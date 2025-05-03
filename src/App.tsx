
import React, { useState, useEffect } from 'react';
import './App.css';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import ThemeSwitcher from './components/settings/ThemeSwitcher';
import { Toaster } from './components/ui/toaster';
import { cn } from './lib/utils';
import { GithubIcon, Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Separator } from './components/ui/separator';

function App() {
  const { theme, colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Only show UI after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn(
      "app min-h-screen flex flex-col bg-background text-foreground",
      `themed-app ${theme} ${colorScheme}`
    )}>
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CT
            </div>
            <h1 className="font-bold text-xl hidden md:block">Crypto Trading Platform</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <GithubIcon size={16} />
                <span>Star on GitHub</span>
              </Button>
              <ThemeSwitcher />
            </div>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[380px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      CT
                    </div>
                    <h2 className="font-bold text-lg">Crypto Trading</h2>
                  </div>
                  
                  <nav className="space-y-2 mb-auto">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      Trading
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      Market Analysis
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      Settings
                    </Button>
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  <div className="mt-auto flex flex-col gap-4">
                    <ThemeSwitcher className="self-start" />
                    <Button variant="outline" size="sm" className="flex items-center gap-2 self-start">
                      <GithubIcon size={16} />
                      <span>Star on GitHub</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container py-6">
          <Dashboard />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 mt-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2025 Crypto Trading Platform</div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}

export default App;
