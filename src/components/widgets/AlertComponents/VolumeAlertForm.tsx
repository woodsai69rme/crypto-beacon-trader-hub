
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFrequency } from "@/types/alerts";

// Fix the frequency value to use the AlertFrequency type
const VolumeAlertForm: React.FC<{
  formData: {
    frequency: AlertFrequency;
    [key: string]: any;
  };
  setFormData: (data: any) => void;
}> = ({ formData, setFormData }) => {
  return (
    <Select
      value={formData.frequency}
      onValueChange={(value) => setFormData({
        ...formData,
        frequency: value as AlertFrequency
      })}
    >
      <SelectTrigger id="frequency">
        <SelectValue placeholder="Select frequency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="once">Once</SelectItem>
        <SelectItem value="recurring">Recurring</SelectItem>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="hourly">Hourly</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default VolumeAlertForm;
