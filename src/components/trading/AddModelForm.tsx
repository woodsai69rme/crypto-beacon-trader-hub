
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddModelFormProps {
  newModel: {
    name: string;
    endpoint: string;
    type: string;
  };
  onModelChange: (model: any) => void;
  onSubmit: () => void;
}

const AddModelForm: React.FC<AddModelFormProps> = ({ newModel, onModelChange, onSubmit }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm mb-4">
        Configure a connection to your locally running AI model
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel>Model Name</FormLabel>
          <Input
            placeholder="My Trading Model"
            value={newModel.name}
            onChange={(e) => onModelChange({ ...newModel, name: e.target.value })}
          />
          <FormDescription>
            A descriptive name for your AI model
          </FormDescription>
        </div>
        
        <div className="space-y-2">
          <FormLabel>API Endpoint</FormLabel>
          <Input
            placeholder="http://localhost:8000"
            value={newModel.endpoint}
            onChange={(e) => onModelChange({ ...newModel, endpoint: e.target.value })}
          />
          <FormDescription>
            The local address where your model's API is running
          </FormDescription>
        </div>
        
        <div className="space-y-2">
          <FormLabel>Model Type</FormLabel>
          <Select
            value={newModel.type}
            onValueChange={(value) => onModelChange({ ...newModel, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prediction">Price Prediction</SelectItem>
              <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
              <SelectItem value="trading">Trading Strategy</SelectItem>
              <SelectItem value="analysis">Market Analysis</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            The primary function of your AI model
          </FormDescription>
        </div>
        
        <Button 
          className="w-full mt-6" 
          onClick={onSubmit}
          disabled={!newModel.name || !newModel.endpoint}
        >
          Add AI Model
        </Button>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-md text-sm mt-6">
        <p className="font-medium mb-2">Setting up local AI trading models</p>
        <ul className="space-y-1 list-disc ml-5 text-muted-foreground">
          <li>Models must expose REST APIs for inference</li>
          <li>Ensure CORS is enabled on your local server</li>
          <li>For PyTorch models, use TorchServe or Flask</li>
          <li>For TensorFlow models, use TF Serving or Flask</li>
          <li>Models should accept JSON inputs and return JSON outputs</li>
        </ul>
      </div>
    </div>
  );
};

export default AddModelForm;
