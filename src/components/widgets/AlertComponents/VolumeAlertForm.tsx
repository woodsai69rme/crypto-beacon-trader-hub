
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VolumeAlertFormData, COIN_OPTIONS } from "./AlertTypes";

interface VolumeAlertFormProps {
  formData: VolumeAlertFormData;
  setFormData: (data: VolumeAlertFormData) => void;
  onSubmit: () => void;
}

const VolumeAlertForm: React.FC<VolumeAlertFormProps> = ({ formData, setFormData, onSubmit }) => {
  const handleCoinChange = (value: string) => {
    const coin = COIN_OPTIONS[value];
    setFormData({
      ...formData,
      coinId: value,
      coinName: coin.name,
      coinSymbol: coin.symbol
    });
  };

  const handleNotifyViaToggle = (method: "app" | "email" | "push") => {
    const newNotifyVia = formData.notifyVia.includes(method)
      ? formData.notifyVia.filter(v => v !== method)
      : [...formData.notifyVia, method];
    
    setFormData({ ...formData, notifyVia: newNotifyVia });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Coin</label>
            <Select
              value={formData.coinId}
              onValueChange={handleCoinChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                <SelectItem value="solana">Solana (SOL)</SelectItem>
                <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                <SelectItem value="ripple">XRP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Volume Increase Threshold (%)</label>
            <div className="flex items-center">
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.volumeThreshold || ""}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  volumeThreshold: parseFloat(e.target.value) || 0 
                })}
              />
              <span className="ml-2">%</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Timeframe</label>
            <Select
              value={formData.frequency}
              onValueChange={(value: "1h" | "4h" | "24h") => setFormData({ 
                ...formData, 
                frequency: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full" onClick={onSubmit}>
            <Plus className="mr-1 h-4 w-4" />
            Add Volume Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VolumeAlertForm;
