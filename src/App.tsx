
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AiTradingProvider } from "@/contexts/AiTradingContext";
import { TradingProvider } from "@/contexts/TradingContext";
import { UIContextProvider } from "@/contexts/UIContext";
import EnhancedNavigation from "@/components/navigation/EnhancedNavigation";
import Dashboard from "@/components/Dashboard";
import TradingPage from "@/pages/TradingPage";
import AiBotsPage from "@/pages/AiBotsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NewsPage from "@/pages/NewsPage";
import Web3Page from "@/pages/Web3Page";
import SocialPage from "@/pages/SocialPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import ProjectStatus from "@/pages/ProjectStatus";
import TestingPage from "@/pages/TestingPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UIContextProvider>
        <TradingProvider>
          <AiTradingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <EnhancedNavigation />
                <main className="pb-16 md:pb-0">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/trading" element={<TradingPage />} />
                    <Route path="/ai-bots" element={<AiBotsPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/web3" element={<Web3Page />} />
                    <Route path="/social" element={<SocialPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/status" element={<ProjectStatus />} />
                    <Route path="/testing" element={<TestingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </AiTradingProvider>
        </TradingProvider>
      </UIContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
