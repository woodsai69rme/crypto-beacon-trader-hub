
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CorrelationExplainer: React.FC = () => {
  return (
    <div className="mt-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm">What is correlation in cryptocurrency markets?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Correlation measures the statistical relationship between two assets. 
                In cryptocurrency markets, it shows how closely the price movements of different coins follow each other.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>+1.00</strong>: Perfect positive correlation - the assets move identically in the same direction</li>
                <li><strong>0.00</strong>: No correlation - the assets move independently of each other</li>
                <li><strong>-1.00</strong>: Perfect negative correlation - the assets move in exactly opposite directions</li>
              </ul>
              <p>
                Most cryptocurrencies show some degree of positive correlation, particularly during market-wide events.
                However, understanding the different degrees of correlation can help with portfolio diversification and risk management.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-sm">How to use correlation data for trading</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Portfolio Diversification:</strong> Including assets with lower correlation to each other can reduce overall portfolio risk.</p>
              <p><strong>Pairs Trading:</strong> Assets with historically high correlation that temporarily diverge may present trading opportunities.</p>
              <p><strong>Risk Management:</strong> Understanding correlations helps predict how your portfolio might behave during market events.</p>
              <p><strong>Hedging:</strong> Assets with negative correlation might offer protection against downside moves.</p>
              <p className="italic">
                Remember that correlations are not fixed and can change dramatically during market stress periods or as cryptocurrency projects evolve.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-sm">Correlation time frames and volatility</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Correlation can vary significantly depending on the time frame you're analyzing:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Short-term</strong> (hours/days): Often affected by trading noise, news events, and liquidity</li>
                <li><strong>Medium-term</strong> (weeks/months): May reflect market cycles and sentiment shifts</li>
                <li><strong>Long-term</strong> (years): More likely to show fundamental relationships between assets</li>
              </ul>
              <p>
                During periods of extreme market volatility or crashes, correlations between cryptocurrencies often increase, 
                as market-wide panic or euphoria tends to affect all assets similarly. This is known as "correlation convergence during crisis."
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CorrelationExplainer;
