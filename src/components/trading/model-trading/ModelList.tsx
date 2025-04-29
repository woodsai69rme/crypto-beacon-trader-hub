
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LocalModel, ModelListProps } from "@/types/trading";
import { FileCode2, Trash2, FileCheck2, FileWarning, FileQuestion } from "lucide-react";

const ModelList: React.FC<ModelListProps> = ({
  models,
  onRemoveModel,
}) => {
  const getModelIcon = (model: LocalModel) => {
    switch (model.type) {
      case "prediction":
        return <FileCheck2 className="h-5 w-5 text-blue-500" />;
      case "sentiment":
        return <FileCode2 className="h-5 w-5 text-emerald-500" />;
      case "trading":
        return <FileCode2 className="h-5 w-5 text-violet-500" />;
      case "analysis":
        return <FileCode2 className="h-5 w-5 text-amber-500" />;
      default:
        return <FileQuestion className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (model: LocalModel) => {
    if (model.isConnected) {
      return <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Connected</span>;
    }
    
    switch (model.status) {
      case "active":
        return <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Active</span>;
      case "inactive":
        return <span className="text-xs bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded">Inactive</span>;
      case "training":
        return <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">Training</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {models.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/50">
          <FileWarning className="mx-auto h-10 w-10 text-amber-500 mb-2" />
          <h3 className="text-lg font-semibold mb-1">No Models Available</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't added any AI models yet. Generate or connect to a model to get started.
          </p>
        </div>
      ) : (
        models.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getModelIcon(model)}</div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{model.name}</h4>
                      <div className="ml-2">{getStatusBadge(model)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {model.type.charAt(0).toUpperCase() + model.type.slice(1)} Model
                    </p>
                    {model.endpoint && (
                      <p className="text-xs font-mono mt-1 opacity-70 truncate max-w-[300px]">
                        {model.endpoint}
                      </p>
                    )}
                    {model.description && (
                      <p className="text-xs mt-1">{model.description}</p>
                    )}
                    {model.performance && (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        <div className="text-center bg-muted/50 p-1 rounded">
                          <p className="text-[10px] text-muted-foreground">Accuracy</p>
                          <p className="text-xs font-medium">{(model.performance.accuracy * 100).toFixed(0)}%</p>
                        </div>
                        <div className="text-center bg-muted/50 p-1 rounded">
                          <p className="text-[10px] text-muted-foreground">Returns</p>
                          <p className="text-xs font-medium">{model.performance.returns.toFixed(1)}%</p>
                        </div>
                        <div className="text-center bg-muted/50 p-1 rounded">
                          <p className="text-[10px] text-muted-foreground">Sharpe</p>
                          <p className="text-xs font-medium">{model.performance.sharpeRatio.toFixed(1)}</p>
                        </div>
                        <div className="text-center bg-muted/50 p-1 rounded">
                          <p className="text-[10px] text-muted-foreground">Drawdown</p>
                          <p className="text-xs font-medium">{model.performance.maxDrawdown.toFixed(1)}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveModel(model.id)}
                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ModelList;
