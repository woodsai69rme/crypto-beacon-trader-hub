
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertFormData } from "@/types/alerts";
import PriceAlertForm from "./PriceAlertForm";
import VolumeAlertForm from "./VolumeAlertForm";
import TechnicalAlertForm from "./TechnicalAlertForm";

interface AlertFormSheetProps {
  formData: AlertFormData;
  onFormChange: (data: Partial<AlertFormData>) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormSheetProps> = ({
  formData,
  onFormChange,
  onSubmit
}) => {
  const handleTypeChange = (type: string) => {
    onFormChange({ type: type as 'price' | 'volume' | 'technical' });
  };

  // Create specific typed data for each form type
  const priceAlertData = {
    ...formData,
    type: 'price' as const,
    targetPrice: formData.targetPrice || 0,
    isAbove: formData.isAbove || true,
    recurring: formData.recurring || false,
    percentageChange: formData.percentageChange || 0
  };

  const volumeAlertData = {
    ...formData,
    type: 'volume' as const,
    volumeThreshold: formData.volumeThreshold || 0,
    frequency: formData.frequency || 'once'
  };

  const technicalAlertData = {
    ...formData,
    type: 'technical' as const,
    indicator: formData.indicator || '',
    condition: formData.condition || '',
    value: formData.value || 0
  };

  return (
    <div className="mt-6">
      <Tabs 
        value={formData.type} 
        onValueChange={handleTypeChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="price">Price</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price" className="mt-4">
          <PriceAlertForm 
            formData={priceAlertData} 
            setFormData={(data) => onFormChange(data)} 
            onSubmit={onSubmit}
          />
        </TabsContent>
        
        <TabsContent value="volume" className="mt-4">
          <VolumeAlertForm 
            formData={volumeAlertData} 
            setFormData={(data) => onFormChange(data)}
            onSubmit={onSubmit}
          />
        </TabsContent>
        
        <TabsContent value="technical" className="mt-4">
          <TechnicalAlertForm 
            formData={technicalAlertData} 
            setFormData={(data) => onFormChange(data)}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
