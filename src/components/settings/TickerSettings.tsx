
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Gauge } from "lucide-react";
import { SettingsComponentProps } from "./types";

const TickerSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  // Initialize ticker settings if they don't exist
  React.useEffect(() => {
    const currentValues = form.getValues();
    if (!currentValues.ticker) {
      form.setValue('ticker', {
        enabled: true,
        position: 'bottom',
        speed: 2,
        direction: 'ltr',
        autoPause: true,
        coins: ['bitcoin', 'ethereum', 'solana'],
        showVolume: true,
        showPercentChange: true
      });
    }
  }, [form]);

  // Helper function to update ticker settings
  const updateTickerSettings = (key: string, value: any) => {
    form.setValue(`ticker.${key}`, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Ticker Settings
        </CardTitle>
        <CardDescription>
          Configure how the price ticker displays on your dashboard
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Enable Ticker</FormLabel>
            <FormDescription>
              Show the ticker on your dashboard
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={form.getValues()?.ticker?.enabled || false}
              onCheckedChange={(checked) => updateTickerSettings('enabled', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem>
          <FormLabel>Ticker Position</FormLabel>
          <Select
            value={form.getValues()?.ticker?.position || 'bottom'}
            onValueChange={(value) => updateTickerSettings('position', value)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        
        <FormItem>
          <FormLabel>Ticker Speed</FormLabel>
          <div className="pt-2">
            <Slider
              defaultValue={[form.getValues()?.ticker?.speed || 2]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => updateTickerSettings('speed', value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>
        </FormItem>
        
        <FormItem>
          <FormLabel>Scroll Direction</FormLabel>
          <Select
            value={form.getValues()?.ticker?.direction || 'ltr'}
            onValueChange={(value) => updateTickerSettings('direction', value)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="ltr">Left to Right</SelectItem>
              <SelectItem value="rtl">Right to Left</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Pause on Hover</FormLabel>
            <FormDescription>
              Automatically pause the ticker when hovering
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={form.getValues()?.ticker?.autoPause || true}
              onCheckedChange={(checked) => updateTickerSettings('autoPause', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Show Volume</FormLabel>
            <FormDescription>
              Display 24h trading volume alongside prices
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={form.getValues()?.ticker?.showVolume || false}
              onCheckedChange={(checked) => updateTickerSettings('showVolume', checked)}
            />
          </FormControl>
        </FormItem>
        
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>Show Percent Change</FormLabel>
            <FormDescription>
              Display 24h percent change alongside prices
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={form.getValues()?.ticker?.showPercentChange || true}
              onCheckedChange={(checked) => updateTickerSettings('showPercentChange', checked)}
            />
          </FormControl>
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default TickerSettings;
