
import { ThemeProvider } from './contexts/ThemeContext';
import { ModelTradingProvider } from './contexts/ModelTradingContext';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import MainContent from './MainContent';
import { UIProvider } from './contexts/UIContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        <ModelTradingProvider>
          <BrowserRouter>
            <Navbar />
            <MainContent />
            <Toaster />
          </BrowserRouter>
        </ModelTradingProvider>
      </UIProvider>
    </ThemeProvider>
  );
}

export default App;
