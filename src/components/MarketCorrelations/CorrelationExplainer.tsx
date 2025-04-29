
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const CorrelationExplainer: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Understanding Correlations</h3>
        
        <div className="space-y-3 text-sm">
          <p>
            Correlation measures the statistical relationship between two assets.
            Values range from -1 (perfect negative correlation) to +1 (perfect positive correlation).
          </p>
          
          <div className="space-y-2">
            <div>
              <h4 className="font-medium">Positive correlation (0 to 1):</h4>
              <p className="text-muted-foreground">
                Assets tend to move in the same direction. When one increases, the other tends to increase as well.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">No correlation (near 0):</h4>
              <p className="text-muted-foreground">
                Assets move independently of each other with no discernible pattern.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Negative correlation (-1 to 0):</h4>
              <p className="text-muted-foreground">
                Assets tend to move in opposite directions. When one increases, the other tends to decrease.
              </p>
            </div>
          </div>
          
          <div className="mt-4 bg-muted/50 p-3 rounded-md">
            <h4 className="font-medium mb-1">Trading implications:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Portfolio diversification:</span> Including assets with low or negative correlation can reduce overall portfolio risk.
              </li>
              <li>
                <span className="font-medium text-foreground">Pair trading:</span> Trading correlated pairs can present opportunities when correlation temporarily breaks down.
              </li>
              <li>
                <span className="font-medium text-foreground">Risk management:</span> Understanding correlations helps predict how assets might behave together during market events.
              </li>
            </ul>
          </div>
          
          <p className="italic mt-2">
            Note: Correlations are not constant and can change over time based on market conditions, news, and other factors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationExplainer;
