
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertFormData } from "@/types/alerts";
import AlertForm from "./AlertForm";

interface AlertFormSheetProps {
  formData: AlertFormData;
  onFormChange: (data: AlertFormData) => void;
  onSubmit: () => void;
}

export const AlertFormSheet: React.FC<AlertFormSheetProps> = ({
  formData,
  onFormChange,
  onSubmit
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-4">Create New Alert</h3>
      
      <AlertForm 
        formData={formData} 
        onChange={onFormChange} 
        onSubmit={onSubmit}
      />
      
      <div className="mt-4 flex justify-end">
        <Button onClick={onSubmit}>Create Alert</Button>
      </div>
    </div>
  );
};
