
import React from 'react';
import { OpenRouterModel } from '@/services/openRouterService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ModelSelectorProps {
  models: OpenRouterModel[];
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  isLoading?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelSelect,
  isLoading = false
}) => {
  // Group models by provider
  const modelsByProvider: Record<string, OpenRouterModel[]> = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, OpenRouterModel[]>);

  return (
    <div className="w-full">
      <Select
        value={selectedModel}
        onValueChange={onModelSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an AI model" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(modelsByProvider).map(provider => (
            <React.Fragment key={provider}>
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                {provider}
              </div>
              {modelsByProvider[provider].map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    <div className="flex gap-1">
                      {model.isFree && (
                        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
                          Free
                        </Badge>
                      )}
                      <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
                        {model.context_length.toLocaleString()} tokens
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
