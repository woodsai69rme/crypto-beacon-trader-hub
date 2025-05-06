
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceSelectorProps {
  selectedService: string;
  onServiceSelect: (service: string) => void;
  services?: { id: string; name: string }[];
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  selectedService, 
  onServiceSelect,
  services = [
    { id: 'coingecko', name: 'CoinGecko' },
    { id: 'binance', name: 'Binance' },
    { id: 'coinmarketcap', name: 'CoinMarketCap' },
    { id: 'kraken', name: 'Kraken' }
  ]
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Select Data Provider</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Select value={selectedService} onValueChange={onServiceSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a data provider" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ServiceSelector;
