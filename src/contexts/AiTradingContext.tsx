
import React, { createContext, useContext, useState, useEffect } from "react";
import { AITradingStrategy, LocalModel, CoinOption } from "@/types/trading";
import { predefinedStrategies, getStrategyById } from "@/utils/aiTradingStrategies";
import { startPriceMonitoring } from "@/services/priceMonitoring";
import { toast } from "@/components/ui/use-toast";

interface AiTradingContextType {
  availableStrategies: AITradingStrategy[];
  activeModels: LocalModel[];
  startModel: (strategyId: string, coins: string[]) => Promise<string | null>;
  stopModel: (modelId: string) => Promise<boolean>;
  getModelById: (modelId: string) => LocalModel | undefined;
  isLoading: boolean;
  modelData: Record<string, CoinOption[]>;
}

const AiTradingContext = createContext<AiTradingContextType>({
  availableStrategies: [],
  activeModels: [],
  startModel: () => Promise.resolve(null),
  stopModel: () => Promise.resolve(false),
  getModelById: () => undefined,
  isLoading: false,
  modelData: {}
});

export const useAiTrading = () => useContext(AiTradingContext);

interface AiTradingProviderProps {
  children: React.ReactNode;
}

export const AiTradingProvider: React.FC<AiTradingProviderProps> = ({ children }) => {
  const [availableStrategies, setAvailableStrategies] = useState<AITradingStrategy[]>(predefinedStrategies);
  const [activeModels, setActiveModels] = useState<LocalModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelData, setModelData] = useState<Record<string, CoinOption[]>>({});
  
  // Load persisted models from localStorage on mount
  useEffect(() => {
    try {
      const savedModels = localStorage.getItem('ai-trading-active-models');
      if (savedModels) {
        setActiveModels(JSON.parse(savedModels));
      }
    } catch (error) {
      console.error('Failed to load saved models:', error);
    }
  }, []);
  
  // Save active models to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ai-trading-active-models', JSON.stringify(activeModels));
    } catch (error) {
      console.error('Failed to save models:', error);
    }
  }, [activeModels]);
  
  // Start monitoring prices for active models
  useEffect(() => {
    const modelStopFunctions: Record<string, () => void> = {};
    
    activeModels.forEach(model => {
      if (model.status === 'running' && model.coins.length > 0 && !modelData[model.id]) {
        // Start monitoring prices for this model's coins
        const stopFunction = startPriceMonitoring(
          model.coins,
          (updatedCoins) => {
            setModelData(prevData => ({
              ...prevData,
              [model.id]: updatedCoins
            }));
          }
        );
        
        modelStopFunctions[model.id] = stopFunction;
      }
    });
    
    // Cleanup function to stop all price monitoring when component unmounts
    return () => {
      Object.values(modelStopFunctions).forEach(stopFn => stopFn());
    };
  }, [activeModels]);
  
  const startModel = async (strategyId: string, coins: string[]): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      const strategy = getStrategyById(strategyId);
      
      if (!strategy) {
        throw new Error(`Strategy with ID ${strategyId} not found`);
      }
      
      if (coins.length === 0) {
        throw new Error('At least one coin must be selected');
      }
      
      // Create a new model instance
      const modelId = `model-${Date.now()}`;
      const newModel: LocalModel = {
        id: modelId,
        name: `${strategy.name} Model`,
        description: `AI trading model using ${strategy.name} strategy`,
        status: 'running',
        strategy: strategy.name,
        coins,
        startedAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        performance: {
          totalPnL: 0,
          winRate: 0,
          trades: 0
        }
      };
      
      // Add the new model to active models
      setActiveModels(prevModels => [...prevModels, newModel]);
      
      toast({
        title: 'Model Started',
        description: `${strategy.name} model is now running on ${coins.length} coins.`,
      });
      
      return modelId;
    } catch (error) {
      console.error('Failed to start model:', error);
      toast({
        title: 'Failed to Start Model',
        description: (error as Error).message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const stopModel = async (modelId: string): Promise<boolean> => {
    try {
      // Find the model to stop
      const modelIndex = activeModels.findIndex(m => m.id === modelId);
      
      if (modelIndex === -1) {
        throw new Error(`Model with ID ${modelId} not found`);
      }
      
      // Update the model status to stopped
      const updatedModels = [...activeModels];
      updatedModels[modelIndex] = {
        ...updatedModels[modelIndex],
        status: 'stopped'
      };
      
      setActiveModels(updatedModels);
      
      // Remove model data
      setModelData(prevData => {
        const newData = { ...prevData };
        delete newData[modelId];
        return newData;
      });
      
      toast({
        title: 'Model Stopped',
        description: 'The trading model has been stopped.',
      });
      
      return true;
    } catch (error) {
      console.error('Failed to stop model:', error);
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive'
      });
      return false;
    }
  };
  
  const getModelById = (modelId: string): LocalModel | undefined => {
    return activeModels.find(model => model.id === modelId);
  };

  return (
    <AiTradingContext.Provider
      value={{
        availableStrategies,
        activeModels,
        startModel,
        stopModel,
        getModelById,
        isLoading,
        modelData
      }}
    >
      {children}
    </AiTradingContext.Provider>
  );
};
