
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertFrequency } from "@/types/alerts";

interface VolumeAlertFormProps {
  formData: {
    frequency: AlertFrequency;
    [key: string]: any;
  };
  setFormData: (data: any) => void;
}

const VolumeAlertForm: React.FC<VolumeAlertFormProps> = ({ formData, setFormData }) => {
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
        <SelectItem value="1h">Every Hour</SelectItem>
        <SelectItem value="4h">Every 4 Hours</SelectItem>
        <SelectItem value="24h">Every 24 Hours</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default VolumeAlertForm;
