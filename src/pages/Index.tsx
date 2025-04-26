
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import AiChatAssistant from "../components/AiChatAssistant";

const Index = () => {
  return (
    <div className="min-h-screen themed-app">
      <Navbar />
      <Dashboard />
      <AiChatAssistant />
    </div>
  );
};

export default Index;
