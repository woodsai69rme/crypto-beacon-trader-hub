
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import AiChatAssistant from "../components/AiChatAssistant";

const Index = () => {
  return (
    <div className="min-h-screen themed-app">
      <Navbar />
      <Dashboard />
      <Toaster />
      <AiChatAssistant />
    </div>
  );
};

export default Index;
