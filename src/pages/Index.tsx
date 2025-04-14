
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <Navbar />
      <Dashboard />
      <Toaster />
    </div>
  );
};

export default Index;
