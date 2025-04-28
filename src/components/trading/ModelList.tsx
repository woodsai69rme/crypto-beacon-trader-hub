import React from 'react';
import { Button } from "@/components/ui/button";
import { LocalModel } from '@/types/trading';
import { AlertTriangle, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ModelListProps {
  models: LocalModel[];
  isTestingConnection: string | null;
  onTestConnection: (model: LocalModel) => Promise<void>;
  onRemoveModel: (id: string) => void;
}

const ModelList: React.FC<ModelListProps> = ({ 
  models, 
  isTestingConnection, 
  onTestConnection, 
  onRemoveModel 
}) => {
  if (models.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/40 rounded-lg">
        <div className="text-muted-foreground">No local AI models configured yet</div>
        <div className="text-sm mt-2">Add your first model to get started</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {models.map((model) => (
        <div key={model.id} className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{model.name}</h3>
                <div className="text-xs text-muted-foreground mt-1">
                  {model.endpoint}
                </div>
                <div className="mt-2 flex gap-2">
                  <div className="text-xs bg-muted px-2 py-1 rounded-md">
                    {model.type}
                  </div>
                  {model.lastUsed && (
                    <div className="text-xs bg-muted px-2 py-1 rounded-md">
                      Last used: {new Date(model.lastUsed).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isTestingConnection === model.id}
                  onClick={() => onTestConnection(model)}
                >
                  {isTestingConnection === model.id ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Test
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove AI Model?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this AI model configuration? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          onRemoveModel(model.id);
                          toast({
                            title: "Model Removed",
                            description: "The AI model configuration has been removed"
                          });
                        }}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
          
          <div className={`py-2 px-4 flex items-center gap-2 ${
            model.isConnected ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {model.isConnected ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Connected and ready</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">Not connected</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelList;
