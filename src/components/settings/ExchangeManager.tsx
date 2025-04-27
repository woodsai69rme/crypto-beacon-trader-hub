
import React from "react";
import ExchangeIntegration from "../trading/ExchangeIntegration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ExchangeManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Management</CardTitle>
        <CardDescription>Connect and manage your cryptocurrency exchange accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <ExchangeIntegration />
      </CardContent>
    </Card>
  );
};

export default ExchangeManager;
