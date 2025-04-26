import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { LocalModel } from "./types";
import { validateFormFields } from "@/utils/formValidation";
import { handleError } from "@/utils/errorHandling";

interface AddModelFormProps {
  newModel: Omit<LocalModel, "id" | "isConnected">;
  onModelChange: (model: Omit<LocalModel, "id" | "isConnected">) => void;
  onSubmit: () => void;
}

const AddModelForm: React.FC<AddModelFormProps> = ({
  newModel,
  onModelChange,
  onSubmit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isValid = validateFormFields(newModel, ["name", "endpoint", "type"]);
      
      if (!isValid) {
        return;
      }

      if (!newModel.endpoint.startsWith("http://") && !newModel.endpoint.startsWith("https://")) {
        handleError("Endpoint must start with http:// or https://", "warning", "Model Form");
        return;
      }

      onSubmit();
    } catch (error) {
      handleError(error, "error", "Model Form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Model Name</Label>
        <Input 
          id="name" 
          required
          placeholder="My Price Prediction Model" 
          value={newModel.name}
          onChange={(e) => onModelChange({ ...newModel, name: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="endpoint">Local Endpoint URL</Label>
        <Input 
          id="endpoint" 
          required
          placeholder="http://localhost:8000" 
          value={newModel.endpoint}
          onChange={(e) => onModelChange({ ...newModel, endpoint: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="type">Model Type</Label>
        <select
          id="type"
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={newModel.type}
          onChange={(e) => onModelChange({ ...newModel, type: e.target.value as LocalModel["type"] })}
        >
          <option value="">Select a type</option>
          <option value="prediction">Price Prediction</option>
          <option value="sentiment">Sentiment Analysis</option>
          <option value="trading">Trading Strategy</option>
          <option value="analysis">Market Analysis</option>
        </select>
      </div>
      
      <Button type="submit" className="w-full">
        Add Local Model
      </Button>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-2">How to Set Up Local Models</h4>
        <p className="text-sm text-muted-foreground mb-4">
          To use local AI models, run a compatible inference server on your machine and enter its endpoint above.
          Common server types include:
        </p>
        <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5 mb-4">
          <li>HuggingFace Transformers API</li>
          <li>ONNX Runtime Web Server</li>
          <li>TensorFlow Serving</li>
          <li>PyTorch Model Server</li>
          <li>LangChain local servers</li>
        </ul>
        <Button variant="outline" className="w-full flex justify-between">
          <span>View Local Model Setup Guide</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default AddModelForm;
