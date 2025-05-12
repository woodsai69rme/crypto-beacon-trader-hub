
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PriceAlertFormData } from '@/types/trading';
import { mockCoinData } from '@/utils/mockData';

interface PriceAlertFormProps {
  formData: PriceAlertFormData;
  onFormChange: (data: PriceAlertFormData) => void;
  onSubmit: () => void;
}

const PriceAlertForm: React.FC<PriceAlertFormProps> = ({ formData, onFormChange, onSubmit }) => {
  const handleCoinChange = (value: string) => {
    const coin = mockCoinData.find(c => c.id === value);
    if (coin) {
      onFormChange({
        ...formData,
        coinId: value,
        coinName: coin.name,
        coinSymbol: coin.symbol
      });
    }
  };

  const handleNotifyViaToggle = (method: string) => {
    const notifyVia = formData.notifyVia || [];
    const newNotifyVia = notifyVia.includes(method)
      ? notifyVia.filter(v => v !== method)
      : [...notifyVia, method];
    
    onFormChange({ ...formData, notifyVia: newNotifyVia });
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
                {mockCoinData.map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Alert me when price is</label>
            <div className="flex items-center space-x-2">
              <Select
                value={formData.isAbove ? "above" : "below"}
                onValueChange={(value) => onFormChange({ 
                  ...formData, 
                  isAbove: value === "above"
                })}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-6"
                    value={formData.targetPrice || ""}
                    onChange={(e) => onFormChange({ 
                      ...formData, 
                      targetPrice: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Enter price"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.recurring}
                onCheckedChange={(checked) => onFormChange({
                  ...formData,
                  recurring: checked
                })}
              />
              <Label htmlFor="recurring">Recurring Alert</Label>
            </div>
            <span className="text-xs text-muted-foreground">
              {formData.recurring 
                ? "Alert will trigger repeatedly" 
                : "Alert will trigger once"}
            </span>
          </div>
          
          <div className="pt-2">
            <label className="text-sm font-medium mb-2 block">Notification Methods</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={formData.notifyVia?.includes("app") ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotifyViaToggle("app")}
              >
                App
              </Button>
              <Button
                variant={formData.notifyVia?.includes("email") ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotifyViaToggle("email")}
              >
                Email
              </Button>
              <Button
                variant={formData.notifyVia?.includes("push") ? "default" : "outline"}
                size="sm"
                onClick={() => handleNotifyViaToggle("push")}
              >
                Push
              </Button>
            </div>
          </div>
          
          <Button className="w-full" onClick={onSubmit}>
            <Plus className="mr-1 h-4 w-4" />
            Add Price Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceAlertForm;
