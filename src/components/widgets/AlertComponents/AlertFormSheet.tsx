
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertFormData, PriceAlertFormData, VolumeAlertFormData, TechnicalAlertFormData } from "@/types/alerts";
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

  // Create handlers for each form type that convert the input to the general AlertFormData
  const handlePriceFormChange = (data: Partial<PriceAlertFormData>) => {
    onFormChange(data);
  };

  const handleVolumeFormChange = (data: Partial<VolumeAlertFormData>) => {
    onFormChange(data);
  };

  const handleTechnicalFormChange = (data: Partial<TechnicalAlertFormData>) => {
    onFormChange(data);
  };

  // Wrapper functions to handle the setState actions
  const handlePriceFormWrapper = (value: React.SetStateAction<PriceAlertFormData>) => {
    if (typeof value === 'function') {
      const updatedState = value(priceAlertData);
      handlePriceFormChange(updatedState);
    } else {
      handlePriceFormChange(value);
    }
  };

  const handleVolumeFormWrapper = (value: React.SetStateAction<VolumeAlertFormData>) => {
    if (typeof value === 'function') {
      const updatedState = value(volumeAlertData);
      handleVolumeFormChange(updatedState);
    } else {
      handleVolumeFormChange(value);
    }
  };

  const handleTechnicalFormWrapper = (value: React.SetStateAction<TechnicalAlertFormData>) => {
    if (typeof value === 'function') {
      const updatedState = value(technicalAlertData);
      handleTechnicalFormChange(updatedState);
    } else {
      handleTechnicalFormChange(value);
    }
  };

  // Create the properly typed data for each form
  const priceAlertData: PriceAlertFormData = {
    type: 'price',
    coinId: formData.coinId,
    coinName: formData.coinName,
    coinSymbol: formData.coinSymbol,
    targetPrice: formData.targetPrice || 0,
    isAbove: formData.isAbove ?? true,
    recurring: formData.recurring ?? false,
    percentageChange: formData.percentageChange || 0,
    enabled: formData.enabled ?? true,
    notifyVia: formData.notifyVia || ['app'],
    frequency: formData.frequency
  };

  const volumeAlertData: VolumeAlertFormData = {
    type: 'volume',
    coinId: formData.coinId,
    coinName: formData.coinName,
    coinSymbol: formData.coinSymbol,
    volumeThreshold: formData.volumeThreshold || 0,
    frequency: formData.frequency || 'once',
    enabled: formData.enabled ?? true,
    notifyVia: formData.notifyVia || ['app']
  };

  const technicalAlertData: TechnicalAlertFormData = {
    type: 'technical',
    coinId: formData.coinId,
    coinName: formData.coinName,
    coinSymbol: formData.coinSymbol,
    indicator: formData.indicator || '',
    condition: formData.condition || '',
    value: formData.value || 0,
    enabled: formData.enabled ?? true,
    frequency: formData.frequency,
    notifyVia: formData.notifyVia || ['app']
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
            setFormData={handlePriceFormWrapper} 
            onSubmit={onSubmit}
          />
        </TabsContent>
        
        <TabsContent value="volume" className="mt-4">
          <VolumeAlertForm 
            formData={volumeAlertData} 
            setFormData={handleVolumeFormWrapper}
            onSubmit={onSubmit}
          />
        </TabsContent>
        
        <TabsContent value="technical" className="mt-4">
          <TechnicalAlertForm 
            formData={technicalAlertData} 
            setFormData={handleTechnicalFormWrapper}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
