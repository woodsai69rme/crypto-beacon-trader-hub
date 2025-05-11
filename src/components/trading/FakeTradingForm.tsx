import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TradeOrder, OrderType } from '@/types/trading';
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  orderType: z.enum(['market', 'limit', 'stop', 'stop_limit', 'trailing_stop']),
  side: z.enum(['buy', 'sell']),
  amount: z.number().min(0.00000001, { message: "Amount must be greater than 0" }),
  price: z.number().min(0.00000001, { message: "Price must be greater than 0" }),
  limitPrice: z.number().optional(),
  stopPrice: z.number().optional(),
  trailingAmount: z.number().optional(),
});

const FakeTradingForm: React.FC<{ advancedMode?: boolean }> = ({ advancedMode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [isPercentage, setIsPercentage] = useState<boolean>(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderType: "market",
      side: "buy",
      amount: 0,
      price: 0,
      limitPrice: 0,
      stopPrice: 0,
      trailingAmount: 0,
    },
  });
  
  const { watch, setValue } = form;
  const orderType = watch("orderType");
  const side = watch("side");
  const amount = watch("amount");
  const price = watch("price");
  
  const calculateTotal = () => {
    const total = amount * price;
    return total.toFixed(2);
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newOrder: TradeOrder = {
      id: `order-${Date.now()}`,
      type: values.orderType,
      side: values.side,
      coinId: "bitcoin",
      symbol: "BTC",
      amount: values.amount,
      price: values.price,
      total: amount * price,
      timestamp: new Date(),
      status: "open",
    };
    
    console.log(newOrder);
    
    toast({
      title: "Order Submitted",
      description: `Your ${values.side} order for ${values.amount} BTC at ${values.price} ${selectedCurrency} has been placed.`,
    });
  };

  // Fix the order type comparison issue by updating the OrderType type and using proper comparison
const renderOrderTypeSpecificFields = () => {
  if (orderType === "limit") {
    // Limit order fields
    return (
      <div className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="limitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit Price ({selectedCurrency})</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                    calculateTotal();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  } else if (orderType === "stop" || orderType === "stop_limit" || orderType === "trailing_stop") {
    // Stop order fields
    return (
      <div className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="stopPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Price ({selectedCurrency})</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {orderType === "stop_limit" && (
          <FormField
            control={form.control}
            name="limitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limit Price ({selectedCurrency})</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {orderType === "trailing_stop" && (
          <FormField
            control={form.control}
            name="trailingAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trailing Amount ({isPercentage ? '%' : selectedCurrency})</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="flex-1"
                      {...field} 
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPercentage(!isPercentage)}
                  >
                    {isPercentage ? '%' : selectedCurrency}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    );
  }
  
  return null; // Market orders have no extra fields
};
  
  return (
    <Card className="w-full">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Order Type</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => setValue("orderType", value as OrderType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                      <SelectItem value="stop">Stop Order</SelectItem>
                      <SelectItem value="stop_limit">Stop Limit Order</SelectItem>
                      <SelectItem value="trailing_stop">Trailing Stop Order</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Side</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={(value) => setValue("side", value as "buy" | "sell")} 
                    className="flex space-x-2"
                  >
                    <FormItem>
                      <RadioGroupItem value="buy" id="side-buy" />
                      <FormLabel htmlFor="side-buy">Buy</FormLabel>
                    </FormItem>
                    <FormItem>
                      <RadioGroupItem value="sell" id="side-sell" />
                      <FormLabel htmlFor="side-sell">Sell</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Amount (BTC)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    {...form.register("amount", {
                      onChange: (e) => {
                        setValue("amount", parseFloat(e.target.value));
                        calculateTotal();
                      },
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Price ({selectedCurrency})</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    {...form.register("price", {
                      onChange: (e) => {
                        setValue("price", parseFloat(e.target.value));
                        calculateTotal();
                      },
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            
            {renderOrderTypeSpecificFields()}
            
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Select onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">
                  Total:
                </div>
                <div className="text-lg font-bold">
                  {calculateTotal()} {selectedCurrency}
                </div>
              </div>
            </div>
            
            <Button type="submit">Place Order</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FakeTradingForm;
