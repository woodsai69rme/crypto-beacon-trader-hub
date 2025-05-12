
import { ThemeProvider } from './contexts/ThemeContext';
import { ModelTradingProvider } from './contexts/ModelTradingContext';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Main from './Main';
import { UIProvider } from './contexts/UIContext';

function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        <ModelTradingProvider>
          <BrowserRouter>
            <Main />
            <Toaster />
          </BrowserRouter>
        </ModelTradingProvider>
      </UIProvider>
    </ThemeProvider>
  );
}

export default App;
