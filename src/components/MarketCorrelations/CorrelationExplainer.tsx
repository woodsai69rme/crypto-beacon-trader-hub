
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CorrelationExplainer: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Correlation is a statistical measure that expresses the extent to which two variables are related.
        In cryptocurrency trading, understanding correlations can help with portfolio diversification and risk management.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-correlation">
          <AccordionTrigger>What is correlation?</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              Correlation measures how two assets move in relation to each other. It's expressed as a number between -1 and 1:
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-green-500 font-semibold mr-2">+1:</span>
                <span>Perfect positive correlation - the assets move identically in the same direction.</span>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 font-semibold mr-2">-1:</span>
                <span>Perfect negative correlation - the assets move identically in opposite directions.</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 font-semibold mr-2">0:</span>
                <span>No correlation - the assets move independently of each other.</span>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="why-important">
          <AccordionTrigger>Why is correlation important in crypto trading?</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            <p>Understanding correlations between cryptocurrencies helps traders:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Diversify portfolios to manage risk</li>
              <li>Identify hedging opportunities</li>
              <li>Recognize market patterns and trends</li>
              <li>Make more informed trading decisions</li>
              <li>Predict how market events might affect different assets</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="how-calculated">
          <AccordionTrigger>How is correlation calculated?</AccordionTrigger>
          <AccordionContent className="text-sm">
            <p>
              The most common method is the Pearson correlation coefficient, which measures the linear 
              relationship between two variables. It's calculated using price movements over a specific 
              time period. The formula is complex, but essentially it measures how changes in one asset's 
              price correspond to changes in another's.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="btc-correlation">
          <AccordionTrigger>Bitcoin's relationship with other cryptocurrencies</AccordionTrigger>
          <AccordionContent className="text-sm">
            <p>
              Bitcoin has historically shown strong positive correlation with most major altcoins, especially 
              during market-wide events. However, this correlation can weaken during:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Major project-specific developments</li>
              <li>Altcoin season rallies</li>
              <li>Market maturation phases</li>
              <li>Regulatory events affecting specific cryptocurrencies</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="trading-strategies">
          <AccordionTrigger>Correlation-based trading strategies</AccordionTrigger>
          <AccordionContent className="text-sm">
            <p>Some common strategies include:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <span className="font-medium">Pair trading:</span> Taking opposite positions in correlated assets when their typical relationship deviates.
              </li>
              <li>
                <span className="font-medium">Diversification:</span> Building portfolios of assets with low correlation to each other.
              </li>
              <li>
                <span className="font-medium">Hedging:</span> Using negatively correlated assets to protect against market movements.
              </li>
              <li>
                <span className="font-medium">Correlation breakout:</span> Identifying when historical correlations start to break down, which may indicate emerging trends.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CorrelationExplainer;
